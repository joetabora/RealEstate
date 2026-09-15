import { describe, expect, it } from "vitest";
import { adaptiveReviewHint, emptyReviewQueueSummary } from "@/lib/mastery/summary";

describe("adaptiveReviewHint", () => {
  it("returns null when there is nothing to repair", () => {
    expect(adaptiveReviewHint(emptyReviewQueueSummary())).toBeNull();
  });

  it("mentions mistakes and overdue counts without inventing a score", () => {
    expect(
      adaptiveReviewHint({
        overdueCount: 2,
        scheduledCount: 5,
        openMistakeCount: 1,
        overdueConcepts: [],
      }),
    ).toBe(
      "Adaptive prefix may pull in 1 open mistake and 2 overdue reviews for the next chapter sitting.",
    );
  });

  it("singularizes a single overdue review", () => {
    expect(
      adaptiveReviewHint({
        overdueCount: 1,
        scheduledCount: 1,
        openMistakeCount: 0,
        overdueConcepts: [],
      }),
    ).toBe(
      "Adaptive prefix may pull in 1 overdue review for the next chapter sitting.",
    );
  });
});
