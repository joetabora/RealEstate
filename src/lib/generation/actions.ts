"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getLocalLearner } from "@/lib/learner";
import { generateDraftQuestions } from "./service";
import type { GenerationMode } from "./types";

export async function generateDraftsAction(formData: FormData) {
  const modeRaw = String(formData.get("mode") ?? "mock");
  const mode: GenerationMode = modeRaw === "live" ? "live" : "mock";
  const limit = Number(formData.get("limit") ?? "3");
  const online = String(formData.get("online") ?? "1") !== "0";

  try {
    const learner = await getLocalLearner(prisma);
    await generateDraftQuestions({
      prisma,
      learnerId: learner.id,
      mode,
      limit: Number.isFinite(limit) ? limit : 3,
      online,
    });
  } catch {
    redirect("/validation?genError=1");
  }

  revalidatePath("/validation");
  redirect("/validation?generated=1");
}
