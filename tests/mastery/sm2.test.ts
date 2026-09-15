import { describe, expect, it } from "vitest";
import { applySm2, qualityFromAttempt, TEACH_ME_REVIEW_QUALITY } from "@/lib/mastery/sm2";

describe("qualityFromAttempt", () => {
  it("maps overconfident misses to quality 1", () => {
    expect(qualityFromAttempt(false, 5)).toBe(1);
    expect(qualityFromAttempt(false, 4)).toBe(1);
  });

  it("maps low-confidence misses to quality 2", () => {
    expect(qualityFromAttempt(false, 1)).toBe(2);
    expect(qualityFromAttempt(false, 2)).toBe(2);
  });

  it("maps correct answers by confidence band", () => {
    expect(qualityFromAttempt(true, 1)).toBe(3);
    expect(qualityFromAttempt(true, 3)).toBe(4);
    expect(qualityFromAttempt(true, 5)).toBe(5);
  });
});

describe("applySm2", () => {
  const now = new Date("2026-09-15T12:00:00.000Z");

  it("resets repetitions and schedules one day after a failure", () => {
    const next = applySm2(
      { intervalDays: 6, easeFactor: 2.5, repetitions: 2, lapses: 0 },
      1,
      now,
    );
    expect(next.repetitions).toBe(0);
    expect(next.intervalDays).toBe(1);
    expect(next.lapses).toBe(1);
    expect(next.dueAt.toISOString()).toBe("2026-09-16T12:00:00.000Z");
  });

  it("uses classic 1 then 6 day intervals on first successes", () => {
    const first = applySm2(null, 4, now);
    expect(first.repetitions).toBe(1);
    expect(first.intervalDays).toBe(1);

    const second = applySm2(
      {
        intervalDays: first.intervalDays,
        easeFactor: first.easeFactor,
        repetitions: first.repetitions,
        lapses: first.lapses,
      },
      5,
      now,
    );
    expect(second.repetitions).toBe(2);
    expect(second.intervalDays).toBe(6);
  });

  it("never drops ease factor below 1.3", () => {
    const next = applySm2(
      { intervalDays: 1, easeFactor: 1.3, repetitions: 0, lapses: 3 },
      0,
      now,
    );
    expect(next.easeFactor).toBeGreaterThanOrEqual(1.3);
  });
});

describe("TEACH_ME_REVIEW_QUALITY", () => {
  it("is a successful review quality (not a lapse)", () => {
    expect(TEACH_ME_REVIEW_QUALITY).toBeGreaterThanOrEqual(3);
    expect(TEACH_ME_REVIEW_QUALITY).toBeLessThanOrEqual(5);
  });
});
