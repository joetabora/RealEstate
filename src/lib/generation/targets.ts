import type { PrismaClient } from "@prisma/client";
import type { DraftTarget } from "./types";

const PIPELINE_LIFECYCLES = [
  "generated",
  "source_check",
  "structural_check",
  "answer_check",
  "ambiguity_check",
  "wi_fact_check",
  "validated",
  "rejected",
] as const;

/**
 * Prefer active pairs with fewest drafts already in the pipeline.
 * Caps how many targets we return for one batch.
 */
export async function findDraftTargets(
  prisma: PrismaClient,
  editionId: string,
  limit: number,
): Promise<DraftTarget[]> {
  const pairs = await prisma.confusionPair.findMany({
    where: { editionId, active: true },
    include: {
      conceptA: {
        include: {
          examCategories: { include: { examCategory: true } },
          citations: true,
        },
      },
      conceptB: {
        include: {
          examCategories: { include: { examCategory: true } },
          citations: true,
        },
      },
      questions: { select: { id: true, lifecycle: true, slug: true } },
    },
    orderBy: { canonicalKey: "asc" },
  });

  const targets: DraftTarget[] = [];
  for (const pair of pairs) {
    // Need at least one citation across the pair to label course_sourced honestly.
    if (pair.conceptA.citations.length + pair.conceptB.citations.length === 0) {
      continue;
    }
    const existingDraftCount = pair.questions.filter(
      (q) =>
        q.slug.startsWith("gen-") ||
        (PIPELINE_LIFECYCLES as readonly string[]).includes(q.lifecycle),
    ).length;
    // Soft cap: skip pairs that already have 3+ pipeline drafts.
    if (existingDraftCount >= 3) continue;

    targets.push({
      pairId: pair.id,
      canonicalKey: pair.canonicalKey,
      reason: pair.reason,
      chapterNumber: Math.min(pair.conceptA.chapterNumber, pair.conceptB.chapterNumber),
      conceptA: {
        id: pair.conceptA.id,
        slug: pair.conceptA.slug,
        name: pair.conceptA.name,
        examCategoryCodes: pair.conceptA.examCategories.map((j) => j.examCategory.code),
      },
      conceptB: {
        id: pair.conceptB.id,
        slug: pair.conceptB.slug,
        name: pair.conceptB.name,
        examCategoryCodes: pair.conceptB.examCategories.map((j) => j.examCategory.code),
      },
      existingQuestionCount: pair.questions.length,
      existingDraftCount,
    });
  }

  targets.sort((a, b) => {
    if (a.existingDraftCount !== b.existingDraftCount) {
      return a.existingDraftCount - b.existingDraftCount;
    }
    return a.canonicalKey.localeCompare(b.canonicalKey);
  });

  return targets.slice(0, Math.max(0, limit));
}
