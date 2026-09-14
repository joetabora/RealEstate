"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { startOrResumeChapter1Practice, submitPracticeAnswer } from "./session";

export async function startChapter1PracticeAction() {
  const session = await startOrResumeChapter1Practice();
  revalidatePath("/practice");
  revalidatePath("/mistakes");
  redirect(`/practice/session/${session.id}`);
}

export async function submitPracticeAnswerAction(formData: FormData) {
  const sessionId = String(formData.get("sessionId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const optionId = String(formData.get("optionId") ?? "");
  const confidence = Number(formData.get("confidence") ?? 0);
  const latencyMsRaw = formData.get("latencyMs");
  const latencyMs =
    latencyMsRaw != null && String(latencyMsRaw).length > 0
      ? Number(latencyMsRaw)
      : undefined;

  if (!sessionId || !itemId || !optionId) {
    redirect("/practice");
  }

  const result = await submitPracticeAnswer({
    sessionId,
    itemId,
    optionId,
    confidence,
    latencyMs: Number.isFinite(latencyMs) ? latencyMs : undefined,
  });

  revalidatePath(`/practice/session/${sessionId}`);
  revalidatePath("/practice");
  revalidatePath("/mistakes");
  revalidatePath("/progress");

  if (!result.correct) {
    redirect(
      `/practice/session/${sessionId}?missed=1&why=${encodeURIComponent(result.remediationWhyMissed ?? "")}&distinction=${encodeURIComponent(result.remediationDistinction ?? "")}`,
    );
  }

  redirect(`/practice/session/${sessionId}`);
}
