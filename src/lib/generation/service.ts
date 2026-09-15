import type { PrismaClient } from "@prisma/client";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { getTutorEnvConfig, utcDayKey } from "@/lib/tutor/config";
import { buildLiveDraft } from "./live";
import { buildMockDraft } from "./mock";
import { persistGeneratedQuestion } from "./persist";
import { findDraftTargets } from "./targets";
import type { GenerationMode, GenerationResult } from "./types";

export async function generateDraftQuestions(input: {
  prisma: PrismaClient;
  learnerId: string;
  mode: GenerationMode;
  limit?: number;
  /** Client connectivity — live mode requires online. */
  online?: boolean;
}): Promise<GenerationResult> {
  const limit = Math.min(Math.max(input.limit ?? 3, 1), 10);
  const edition = await input.prisma.courseEdition.findUnique({
    where: { slug: COURSE_EDITION_SEED.slug },
  });
  if (!edition) {
    throw new Error("Course edition missing. Run seed first.");
  }

  if (input.mode === "live") {
    const env = getTutorEnvConfig();
    if (!env.liveConfigured) {
      throw new Error("Live generation needs OPENAI_API_KEY in .env.");
    }
    if (input.online === false) {
      throw new Error("Live generation needs a network connection. Use mock while offline.");
    }
    const remaining = await remainingSpendUsd(input.prisma, input.learnerId);
    if (remaining <= 0) {
      throw new Error("Daily live spend cap reached. Use mock or wait until tomorrow.");
    }
  }

  const targets = await findDraftTargets(input.prisma, edition.id, limit);
  const created: GenerationResult["created"] = [];
  const skipped: string[] = [];
  let tokenEstimate = 0;

  const maxSort = await input.prisma.question.aggregate({
    where: { editionId: edition.id },
    _max: { sortOrder: true },
  });
  let sortOrder = (maxSort._max.sortOrder ?? 0) + 1;

  for (const target of targets) {
    try {
      let draft;
      if (input.mode === "mock") {
        draft = buildMockDraft(target);
      } else {
        const live = await buildLiveDraft(target);
        draft = live.draft;
        tokenEstimate += live.tokenEstimate;
        if (live.tokenEstimate > 0) {
          await recordUsage({
            prisma: input.prisma,
            learnerId: input.learnerId,
            tokenEstimate: live.tokenEstimate,
          });
        }
      }

      const row = await persistGeneratedQuestion(input.prisma, {
        editionId: edition.id,
        target,
        draft,
        sortOrder,
      });
      sortOrder += 1;
      created.push({
        id: row.id,
        slug: row.slug,
        pairKey: target.canonicalKey,
        lifecycle: row.lifecycle,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      skipped.push(`${target.canonicalKey}: ${message}`);
    }
  }

  return { mode: input.mode, created, skipped, tokenEstimate };
}

export async function getGenerationStatus(input: {
  prisma: PrismaClient;
  learnerId: string;
}): Promise<{
  liveConfigured: boolean;
  liveAvailable: boolean;
  dailySpendCapUsd: number;
  spentTodayUsd: number;
  remainingTodayUsd: number;
  model: string;
}> {
  const env = getTutorEnvConfig();
  const remainingTodayUsd = await remainingSpendUsd(input.prisma, input.learnerId);
  const spentTodayUsd = Math.max(0, env.dailySpendCapUsd - remainingTodayUsd);
  return {
    liveConfigured: env.liveConfigured,
    liveAvailable: env.liveConfigured && remainingTodayUsd > 0,
    dailySpendCapUsd: env.dailySpendCapUsd,
    spentTodayUsd,
    remainingTodayUsd,
    model: env.model,
  };
}

async function remainingSpendUsd(prisma: PrismaClient, learnerId: string): Promise<number> {
  const env = getTutorEnvConfig();
  const usage = await prisma.tutorUsageDay.findUnique({
    where: {
      learnerId_day: {
        learnerId,
        day: utcDayKey(),
      },
    },
  });
  const spentTodayUsd = (usage?.estimatedCents ?? 0) / 100;
  return Math.max(0, env.dailySpendCapUsd - spentTodayUsd);
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
