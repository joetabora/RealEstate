"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import {
  activateValidatedAsset,
  activateValidatedQuestion,
  advanceAssetGate,
  advanceQuestionGate,
  runQuestionPipeline,
} from "./runner";

export async function advanceValidationAction(formData: FormData) {
  const kind = String(formData.get("kind") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!id || (kind !== "question" && kind !== "learning_asset")) {
    redirect("/validation");
  }
  try {
    if (kind === "question") await advanceQuestionGate(prisma, id);
    else await advanceAssetGate(prisma, id);
  } catch {
    redirect("/validation?error=1");
  }
  revalidatePath("/validation");
  redirect("/validation");
}

export async function runPipelineAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/validation");
  try {
    await runQuestionPipeline(prisma, id);
  } catch {
    redirect("/validation?error=1");
  }
  revalidatePath("/validation");
  redirect("/validation");
}

export async function activateValidatedAction(formData: FormData) {
  const kind = String(formData.get("kind") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!id || (kind !== "question" && kind !== "learning_asset")) {
    redirect("/validation");
  }
  try {
    if (kind === "question") await activateValidatedQuestion(prisma, id);
    else await activateValidatedAsset(prisma, id);
  } catch {
    redirect("/validation?error=1");
  }
  revalidatePath("/validation");
  revalidatePath("/practice");
  revalidatePath("/");
  redirect("/validation");
}
