import type { PrismaClient } from "@prisma/client";
import { DUE_REVIEW_PRACTICE_CAP } from "./types";

export type DueReviewQuestionPick = {
  id: string;
  conceptId: string | null;
  reasonConceptId: string;
};

/**
 * Pick existing active MCQs for overdue review concepts (oldest due first).
 * One question per concept; prefers direct conceptId match, then pair membership.
 */
export async function selectDueReviewQuestions(input: {
  prisma: PrismaClient;
  editionId: string;
  learnerId: string;
  now?: Date;
  cap?: number;
}): Promise<DueReviewQuestionPick[]> {
  const now = input.now ?? new Date();
  const cap = input.cap ?? DUE_REVIEW_PRACTICE_CAP;

  const overdue = await input.prisma.reviewSchedule.findMany({
    where: {
      learnerId: input.learnerId,
      dueAt: { lte: now },
    },
    orderBy: { dueAt: "asc" },
    take: Math.max(cap * 4, cap),
    select: { conceptId: true },
  });

  const picks: DueReviewQuestionPick[] = [];
  const usedQuestionIds = new Set<string>();
  const usedConcepts = new Set<string>();

  for (const row of overdue) {
    if (picks.length >= cap) break;
    if (usedConcepts.has(row.conceptId)) continue;

    const direct = await input.prisma.question.findFirst({
      where: {
        editionId: input.editionId,
        lifecycle: "active",
        conceptId: row.conceptId,
      },
      orderBy: { sortOrder: "asc" },
      select: { id: true, conceptId: true },
    });

    const viaPair =
      direct ??
      (await input.prisma.question.findFirst({
        where: {
          editionId: input.editionId,
          lifecycle: "active",
          pair: {
            OR: [{ conceptAId: row.conceptId }, { conceptBId: row.conceptId }],
          },
        },
        orderBy: { sortOrder: "asc" },
        select: { id: true, conceptId: true },
      }));

    if (!viaPair || usedQuestionIds.has(viaPair.id)) continue;

    usedQuestionIds.add(viaPair.id);
    usedConcepts.add(row.conceptId);
    picks.push({
      id: viaPair.id,
      conceptId: viaPair.conceptId,
      reasonConceptId: row.conceptId,
    });
  }

  return picks;
}
