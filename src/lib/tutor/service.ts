import type { PrismaClient } from "@prisma/client";
import { getTutorEnvConfig, utcDayKey } from "./config";
import { replyWithMockTutor } from "./mock";
import { replyWithOpenAiTutor } from "./openai";
import { retrieveTutorContext } from "./retrieve";
import {
  isTutorMode,
  type TutorChatMessage,
  type TutorMode,
  type TutorStatus,
} from "./types";

function parseCitations(value: unknown): TutorChatMessage["citations"] {
  if (!Array.isArray(value)) return [];
  const citations: TutorChatMessage["citations"] = [];
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const label = "label" in row && typeof row.label === "string" ? row.label : null;
    if (!label) continue;
    const href =
      "href" in row && typeof row.href === "string" ? row.href : undefined;
    citations.push({ label, href });
  }
  return citations;
}

export async function getTutorStatus(input: {
  prisma: PrismaClient;
  learnerId: string;
}): Promise<TutorStatus> {
  const env = getTutorEnvConfig();
  const learner = await input.prisma.learner.findUnique({
    where: { id: input.learnerId },
    select: { tutorMode: true },
  });
  const rawMode = learner?.tutorMode ?? "off";
  const typedMode: TutorMode = isTutorMode(rawMode) ? rawMode : "off";

  const usage = await input.prisma.tutorUsageDay.findUnique({
    where: {
      learnerId_day: {
        learnerId: input.learnerId,
        day: utcDayKey(),
      },
    },
  });
  const spentTodayUsd = (usage?.estimatedCents ?? 0) / 100;
  const remainingTodayUsd = Math.max(0, env.dailySpendCapUsd - spentTodayUsd);

  const thread = await input.prisma.tutorThread.findFirst({
    where: { learnerId: input.learnerId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: { orderBy: { createdAt: "asc" }, take: 40 },
    },
  });

  return {
    databaseConnected: true,
    mode: typedMode,
    liveConfigured: env.liveConfigured,
    liveAvailable: env.liveConfigured && remainingTodayUsd > 0,
    model: env.model,
    dailySpendCapUsd: env.dailySpendCapUsd,
    spentTodayUsd,
    remainingTodayUsd,
    threadId: thread?.id ?? null,
    messages:
      thread?.messages.map((message) => ({
        id: message.id,
        role: message.role === "assistant" ? "assistant" : "user",
        body: message.body,
        provider: message.provider,
        citations: parseCitations(message.citations),
        createdAt: message.createdAt.toISOString(),
      })) ?? [],
  };
}

export async function setTutorMode(input: {
  prisma: PrismaClient;
  learnerId: string;
  mode: TutorMode;
}): Promise<TutorMode> {
  const env = getTutorEnvConfig();
  if (input.mode === "live" && !env.liveConfigured) {
    throw new Error("Live tutor needs OPENAI_API_KEY in .env.");
  }

  await input.prisma.learner.update({
    where: { id: input.learnerId },
    data: { tutorMode: input.mode },
  });
  return input.mode;
}

export async function sendTutorMessage(input: {
  prisma: PrismaClient;
  learnerId: string;
  message: string;
  /** Client connectivity — live mode requires online. */
  online?: boolean;
}): Promise<TutorStatus> {
  const text = input.message.trim();
  if (!text) {
    throw new Error("Message cannot be empty.");
  }

  const status = await getTutorStatus({
    prisma: input.prisma,
    learnerId: input.learnerId,
  });

  if (status.mode === "off") {
    throw new Error("Tutor is off. Switch to Mock or Live first.");
  }

  if (status.mode === "live" && input.online === false) {
    throw new Error("Live tutor needs a network connection. Switch to Mock while offline.");
  }

  let threadId = status.threadId;
  if (!threadId) {
    const thread = await input.prisma.tutorThread.create({
      data: {
        learnerId: input.learnerId,
        title: text.slice(0, 80),
      },
    });
    threadId = thread.id;
  }

  await input.prisma.tutorMessage.create({
    data: {
      threadId,
      role: "user",
      body: text,
      provider: status.mode,
    },
  });

  const history = status.messages.map((message) => ({
    role: message.role,
    body: message.body,
  }));

  const contextHits = await retrieveTutorContext({
    prisma: input.prisma,
    query: text,
  });

  let reply;
  if (status.mode === "mock") {
    reply = replyWithMockTutor(text, contextHits);
  } else {
    if (!status.liveConfigured) {
      throw new Error("Live tutor needs OPENAI_API_KEY in .env.");
    }
    if (status.remainingTodayUsd <= 0) {
      throw new Error("Daily live tutor spend cap reached. Switch to Mock or wait until tomorrow.");
    }
    reply = await replyWithOpenAiTutor({
      userMessage: text,
      history,
      contextHits,
    });
    if (reply.tokenEstimate && reply.tokenEstimate > 0) {
      await recordUsage({
        prisma: input.prisma,
        learnerId: input.learnerId,
        tokenEstimate: reply.tokenEstimate,
      });
    }
  }

  await input.prisma.tutorMessage.create({
    data: {
      threadId,
      role: "assistant",
      body: reply.body,
      provider: reply.provider,
      citations: reply.citations,
      tokenEstimate: reply.tokenEstimate ?? null,
    },
  });
  await input.prisma.tutorThread.update({
    where: { id: threadId },
    data: { updatedAt: new Date() },
  });

  return getTutorStatus({
    prisma: input.prisma,
    learnerId: input.learnerId,
  });
}

async function recordUsage(input: {
  prisma: PrismaClient;
  learnerId: string;
  tokenEstimate: number;
}) {
  const env = getTutorEnvConfig();
  const cents = Math.max(
    1,
    Math.ceil((input.tokenEstimate / 1000) * env.usdPer1kTokens * 100),
  );
  const day = utcDayKey();
  await input.prisma.tutorUsageDay.upsert({
    where: {
      learnerId_day: {
        learnerId: input.learnerId,
        day,
      },
    },
    create: {
      learnerId: input.learnerId,
      day,
      estimatedCents: cents,
      tokenEstimate: input.tokenEstimate,
    },
    update: {
      estimatedCents: { increment: cents },
      tokenEstimate: { increment: input.tokenEstimate },
    },
  });
}
