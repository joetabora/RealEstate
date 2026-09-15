import { describe, expect, it } from "vitest";
import {
  DUE_REVIEW_PRACTICE_CAP,
  isPracticePlannerVersion,
  PLANNER_VERSION_PRACTICE_DUE_REVIEW,
  practiceSittingByPlannerVersion,
} from "@/lib/questions/types";

describe("due-review practice planner", () => {
  it("recognizes the Phase 6 due-review planner version", () => {
    expect(isPracticePlannerVersion(PLANNER_VERSION_PRACTICE_DUE_REVIEW)).toBe(true);
    expect(practiceSittingByPlannerVersion(PLANNER_VERSION_PRACTICE_DUE_REVIEW)?.label).toBe(
      "Due review",
    );
    expect(DUE_REVIEW_PRACTICE_CAP).toBeGreaterThan(0);
  });
});
