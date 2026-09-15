import type { PrismaClient } from "@prisma/client";
import { applySm2, qualityFromAttempt, type Sm2State } from "./sm2";

/** Advance SM-2 schedules with an explicit quality (0–5). */
export async function advanceReviewSchedulesForConcepts(input: {
  prisma: PrismaClient;
  learnerId: string;
  conceptIds: Iterable<string>;
  quality: number;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const conceptIds = [...new Set(input.conceptIds)];
  if (conceptIds.length === 0) {
    return { quality: Math.min(5, Math.max(0, Math.round(input.quality))) };
  }

  const quality = Math.min(5, Math.max(0, Math.round(input.quality)));

  for (const conceptId of conceptIds) {
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

/** Practice attempts: map correct + confidence → quality, then advance. */
export async function updateReviewSchedulesForConcepts(input: {
  prisma: PrismaClient;
  learnerId: string;
  conceptIds: Iterable<string>;
  correct: boolean;
  confidence: number;
  now?: Date;
}) {
  return advanceReviewSchedulesForConcepts({
    prisma: input.prisma,
    learnerId: input.learnerId,
    conceptIds: input.conceptIds,
    quality: qualityFromAttempt(input.correct, input.confidence),
    now: input.now,
  });
}
