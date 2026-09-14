export const ASSET_KINDS = [
  "explanation",
  "simple_language",
  "scenario",
  "comparison",
  "teachback_prompt",
  "recall_prompt",
] as const;

export type AssetKind = (typeof ASSET_KINDS)[number];

export const INFORMATION_CLASSES = [
  "course_sourced",
  "general_explanation",
  "needs_verification",
] as const;

export type InformationClass = (typeof INFORMATION_CLASSES)[number];

/** Chapter 1 Agency Relationships sitting. */
export const PLANNER_VERSION_CH1 = "phase4-agency-v1";

/** Chapter 2 Agency Issues sitting. */
export const PLANNER_VERSION_CH2 = "phase4-ch2-v1";

/** Chapter 3 Agency Agreements sitting. */
export const PLANNER_VERSION_CH3 = "phase4-ch3-v1";

/** Ordered Teach Me sittings: finish each chapter before the next opens. */
export const TEACH_ME_PLANNER_VERSIONS = [
  PLANNER_VERSION_CH1,
  PLANNER_VERSION_CH2,
  PLANNER_VERSION_CH3,
] as const;

export type TeachMeSittingId = "chapter1" | "chapter2" | "chapter3";

/** @deprecated Prefer PLANNER_VERSION_CH1 — kept for older imports/tests. */
export const PLANNER_VERSION = PLANNER_VERSION_CH1;

export const SESSION_TARGET_MINUTES = 20;

export type ConceptStudyState = "not_started" | "learning";

export function sittingLabelForPlanner(plannerVersion: string | null | undefined): string {
  if (plannerVersion === PLANNER_VERSION_CH3) {
    return "Chapter 3 — Agency Agreements";
  }
  if (plannerVersion === PLANNER_VERSION_CH2) {
    return "Chapter 2 — Agency Issues";
  }
  return "Chapter 1 — Agency Relationships";
}

export function recommendedNextForPlanner(plannerVersion: string | null | undefined): string {
  if (plannerVersion === PLANNER_VERSION_CH3) {
    return "Chapter 3 sitting complete. Review Agency Agreements on Progress. Chapters 4–14 come next.";
  }
  if (plannerVersion === PLANNER_VERSION_CH2) {
    return "Chapter 2 sitting complete. Start session again for Chapter 3 — Agency Agreements.";
  }
  return "Chapter 1 sitting complete. Start session again for Chapter 2 — Agency Issues.";
}
