"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { getLocalLearner } from "@/lib/learner";
import {
  createClassMissCapture,
  discardClassMissCapture,
  linkClassMissToMistake,
} from "./class-miss";

export async function uploadClassMissAction(formData: FormData) {
  const file = formData.get("photo");
  const note = String(formData.get("note") ?? "");
  const conceptSlug = String(formData.get("conceptSlug") ?? "").trim();
  const runOcr = formData.get("runOcr") === "on";

  if (!(file instanceof File) || file.size === 0) {
    redirect("/mistakes?upload=empty");
  }

  try {
    const learner = await getLocalLearner(prisma);
    let conceptId: string | null = null;
    if (conceptSlug) {
      const concept = await prisma.concept.findFirst({
        where: {
          slug: conceptSlug,
          edition: { slug: COURSE_EDITION_SEED.slug },
        },
        select: { id: true },
      });
      conceptId = concept?.id ?? null;
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    await createClassMissCapture({
      prisma,
      learnerId: learner.id,
      bytes,
      mimeType: file.type || "image/jpeg",
      note,
      conceptId,
      runOcr,
    });
  } catch {
    redirect("/mistakes?upload=error");
  }

  revalidatePath("/mistakes");
  redirect("/mistakes?upload=ok");
}

export async function discardClassMissAction(formData: FormData) {
  const captureId = String(formData.get("captureId") ?? "");
  if (!captureId) {
    redirect("/mistakes");
  }
  try {
    const learner = await getLocalLearner(prisma);
    await discardClassMissCapture({
      prisma,
      learnerId: learner.id,
      captureId,
    });
  } catch {
    redirect("/mistakes?upload=error");
  }
  revalidatePath("/mistakes");
  redirect("/mistakes");
}

export async function linkClassMissAction(formData: FormData) {
  const captureId = String(formData.get("captureId") ?? "");
  const mistakeId = String(formData.get("mistakeId") ?? "");
  if (!captureId || !mistakeId) {
    redirect("/mistakes");
  }
  try {
    const learner = await getLocalLearner(prisma);
    await linkClassMissToMistake({
      prisma,
      learnerId: learner.id,
      captureId,
      mistakeId,
    });
  } catch {
    redirect("/mistakes?upload=error");
  }
  revalidatePath("/mistakes");
  redirect("/mistakes");
}
