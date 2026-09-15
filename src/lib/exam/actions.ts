"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  finishExamSimulationEarly,
  startOrResumeExamSimulation,
  submitExamAnswer,
} from "./session";

export async function startExamSimulationAction() {
  let session;
  try {
    session = await startOrResumeExamSimulation();
  } catch {
    redirect("/exam");
  }
  revalidatePath("/exam");
  revalidatePath("/mistakes");
  revalidatePath("/progress");
  redirect(`/exam/session/${session.id}`);
}

export async function submitExamAnswerAction(formData: FormData) {
  const sessionId = String(formData.get("sessionId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const optionId = String(formData.get("optionId") ?? "");
  const latencyMsRaw = formData.get("latencyMs");
  const latencyMs =
    latencyMsRaw != null && String(latencyMsRaw).length > 0
      ? Number(latencyMsRaw)
      : undefined;

  if (!sessionId || !itemId || !optionId) {
    redirect("/exam");
  }

  await submitExamAnswer({
    sessionId,
    itemId,
    optionId,
    latencyMs: Number.isFinite(latencyMs) ? latencyMs : undefined,
  });

  revalidatePath(`/exam/session/${sessionId}`);
  revalidatePath("/exam");
  revalidatePath("/mistakes");
  revalidatePath("/progress");
  redirect(`/exam/session/${sessionId}`);
}

export async function finishExamEarlyAction(formData: FormData) {
  const sessionId = String(formData.get("sessionId") ?? "");
  if (!sessionId) {
    redirect("/exam");
  }
  try {
    await finishExamSimulationEarly(sessionId);
  } catch {
    redirect("/exam");
  }
  revalidatePath(`/exam/session/${sessionId}`);
  revalidatePath("/exam");
  redirect(`/exam/session/${sessionId}`);
}
