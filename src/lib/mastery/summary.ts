import type { PrismaClient } from "@prisma/client";

export type OverdueConceptSummary = {
  slug: string;
  name: string;
  chapterNumber: number;
  dueAt: string;
};

export type ReviewQueueSummary = {
  overdueCount: number;
  scheduledCount: number;
  openMistakeCount: number;
  overdueConcepts: OverdueConceptSummary[];
};

const OVERDUE_LIST_CAP = 12;

export async function getReviewQueueSummary(input: {
  prisma: PrismaClient;
  learnerId: string;
  now?: Date;
  overdueListCap?: number;
}): Promise<ReviewQueueSummary> {
  const now = input.now ?? new Date();
  const listCap = input.overdueListCap ?? OVERDUE_LIST_CAP;

  const [overdueCount, scheduledCount, openMistakeCount, overdueRows] =
    await Promise.all([
      input.prisma.reviewSchedule.count({
        where: { learnerId: input.learnerId, dueAt: { lte: now } },
      }),
      input.prisma.reviewSchedule.count({
        where: { learnerId: input.learnerId },
      }),
      input.prisma.mistake.count({
        where: { learnerId: input.learnerId, resolvedAt: null },
      }),
      input.prisma.reviewSchedule.findMany({
        where: { learnerId: input.learnerId, dueAt: { lte: now } },
        orderBy: { dueAt: "asc" },
        take: listCap,
        include: {
          concept: {
            select: { slug: true, name: true, chapterNumber: true },
          },
        },
      }),
    ]);

  return {
    overdueCount,
    scheduledCount,
    openMistakeCount,
    overdueConcepts: overdueRows.map((row) => ({
      slug: row.concept.slug,
      name: row.concept.name,
      chapterNumber: row.concept.chapterNumber,
      dueAt: row.dueAt.toISOString(),
    })),
  };
}

export function emptyReviewQueueSummary(): ReviewQueueSummary {
  return {
    overdueCount: 0,
    scheduledCount: 0,
    openMistakeCount: 0,
    overdueConcepts: [],
  };
}

/** Short copy for Teach Me controls — counts only, no readiness %. */
export function adaptiveReviewHint(summary: ReviewQueueSummary): string | null {
  const parts: string[] = [];
  if (summary.openMistakeCount > 0) {
    parts.push(
      `${summary.openMistakeCount} open mistake${summary.openMistakeCount === 1 ? "" : "s"}`,
    );
  }
  if (summary.overdueCount > 0) {
    parts.push(
      `${summary.overdueCount} overdue review${summary.overdueCount === 1 ? "" : "s"}`,
    );
  }
  if (parts.length === 0) return null;
  return `Adaptive prefix may pull in ${parts.join(" and ")} for the next chapter sitting.`;
}
