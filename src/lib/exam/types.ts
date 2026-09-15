import {
  SALESPERSON_EXAM_CATEGORIES,
  SALESPERSON_EXAM_ITEM_TOTAL,
} from "@/lib/blueprint";

export const PLANNER_VERSION_EXAM_SIM = "phase9-exam-sim-v1";
export const EXAM_SIM_LABEL = "Blueprint exam simulation";
export const EXAM_SIM_DISCLAIMER =
  "Study simulation only — not a licensing exam and not the course’s 140-item practice test.";

/** Wisconsin salesperson timed exam is typically 3.5 hours for 140 items → 90s/item. */
export const EXAM_SECONDS_PER_ITEM = 90;

export function examTargetMinutes(itemCount: number): number {
  return Math.max(1, Math.ceil((itemCount * EXAM_SECONDS_PER_ITEM) / 60));
}

export function examEndsAtIso(startedAt: Date, itemCount: number): string {
  const ms = itemCount * EXAM_SECONDS_PER_ITEM * 1000;
  return new Date(startedAt.getTime() + ms).toISOString();
}

export type ExamCategoryQuota = {
  code: string;
  name: string;
  blueprintWeight: number;
  available: number;
  seats: number;
};

export type ExamCategoryScore = {
  code: string;
  name: string;
  answered: number;
  correct: number;
};

export const EXAM_BLUEPRINT_ROWS = SALESPERSON_EXAM_CATEGORIES.map((row) => ({
  code: row.code,
  name: row.name,
  weight: row.weight,
}));

export { SALESPERSON_EXAM_ITEM_TOTAL };
