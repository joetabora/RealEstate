"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getLocalLearner } from "@/lib/learner";
import { getTutorStatus, sendTutorMessage, setTutorMode } from "./service";
import { isTutorMode, type TutorMode, type TutorStatus } from "./types";

export async function loadTutorStatusAction(): Promise<TutorStatus> {
  try {
    const learner = await getLocalLearner(prisma);
    return getTutorStatus({ prisma, learnerId: learner.id });
  } catch {
    return {
      databaseConnected: false,
      mode: "off",
      liveConfigured: false,
      liveAvailable: false,
      model: "gpt-4o-mini",
      dailySpendCapUsd: 1,
      spentTodayUsd: 0,
      remainingTodayUsd: 1,
      threadId: null,
      messages: [],
    };
  }
}

export async function setTutorModeAction(mode: string): Promise<TutorStatus> {
  if (!isTutorMode(mode)) {
    throw new Error("Invalid tutor mode.");
  }
  const learner = await getLocalLearner(prisma);
  await setTutorMode({ prisma, learnerId: learner.id, mode: mode as TutorMode });
  revalidatePath("/tutor");
  return getTutorStatus({ prisma, learnerId: learner.id });
}

export async function sendTutorMessageAction(message: string): Promise<TutorStatus> {
  const learner = await getLocalLearner(prisma);
  const status = await sendTutorMessage({
    prisma,
    learnerId: learner.id,
    message,
  });
  revalidatePath("/tutor");
  return status;
}
