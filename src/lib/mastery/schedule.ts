import type { PrismaClient } from "@prisma/client";
import { applySm2, qualityFromAttempt, type Sm2State } from "./sm2";

export async function updateReviewSchedulesForConcepts(input: {
  prisma: PrismaClient;
  learnerId: string;
  conceptIds: Iterable<string>;
  correct: boolean;
  confidence: number;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const quality = qualityFromAttempt(input.correct, input.confidence);

  for (const conceptId of input.conceptIds) {
    const existing = await input.prisma.reviewSchedule.findUnique({
      where: {
        learnerId_conceptId: {
          learnerId: input.learnerId,
          conceptId,
        },
      },
    });

    const prior: Sm2State | null = existing
      ? {
          intervalDays: existing.intervalDays,
          easeFactor: existing.easeFactor,
          repetitions: existing.repetitions,
          lapses: existing.lapses,
        }
      : null;

    const next = applySm2(prior, quality, now);

    await input.prisma.reviewSchedule.upsert({
      where: {
        learnerId_conceptId: {
          learnerId: input.learnerId,
          conceptId,
        },
      },
      create: {
        learnerId: input.learnerId,
        conceptId,
        dueAt: next.dueAt,
        intervalDays: next.intervalDays,
        easeFactor: next.easeFactor,
        repetitions: next.repetitions,
        lapses: next.lapses,
        lastQuality: next.quality,
        lastReviewedAt: now,
      },
      update: {
        dueAt: next.dueAt,
        intervalDays: next.intervalDays,
        easeFactor: next.easeFactor,
        repetitions: next.repetitions,
        lapses: next.lapses,
        lastQuality: next.quality,
        lastReviewedAt: now,
      },
    });
  }

  return { quality };
}
