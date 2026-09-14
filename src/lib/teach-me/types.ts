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

export const PLANNER_VERSION = "phase4-agency-v1";
export const SESSION_TARGET_MINUTES = 20;

export type ConceptStudyState = "not_started" | "learning";
