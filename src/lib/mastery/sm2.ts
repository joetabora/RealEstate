/**
 * Classic SM-2 scheduling (deterministic). Quality is 0–5; below 3 resets the card.
 * No LLM involvement.
 */

export type Sm2State = {
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lapses: number;
};

export type Sm2Result = Sm2State & {
  quality: number;
  dueAt: Date;
};

const MIN_EASE = 1.3;

/** Map practice correctness + confidence (1–5) to SM-2 quality (0–5). */
export function qualityFromAttempt(correct: boolean, confidence: number): number {
  const c = Math.min(5, Math.max(1, Math.round(confidence)));
  if (!correct) {
    // Overconfidence misses are the highest-priority failures.
    if (c >= 4) return 1;
    if (c <= 2) return 2;
    return 1;
  }
  if (c <= 2) return 3;
  if (c >= 4) return 5;
  return 4;
}

export function applySm2(
  prior: Sm2State | null,
  quality: number,
  now: Date = new Date(),
): Sm2Result {
  const q = Math.min(5, Math.max(0, Math.round(quality)));
  let easeFactor = prior?.easeFactor ?? 2.5;
  let repetitions = prior?.repetitions ?? 0;
  let intervalDays = prior?.intervalDays ?? 0;
  let lapses = prior?.lapses ?? 0;

  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < MIN_EASE) easeFactor = MIN_EASE;

  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else if (repetitions === 0) {
    repetitions = 1;
    intervalDays = 1;
  } else if (repetitions === 1) {
    repetitions = 2;
    intervalDays = 6;
  } else {
    repetitions += 1;
    intervalDays = Math.max(1, Math.round(intervalDays * easeFactor));
  }

  const dueAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  return {
    quality: q,
    intervalDays,
    easeFactor,
    repetitions,
    lapses,
    dueAt,
  };
}
