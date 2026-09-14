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

/** Chapter 4 Disclosure Obligations sitting. */
export const PLANNER_VERSION_CH4 = "phase4-ch4-v1";

/** Chapter 5 Fair Housing sitting. */
export const PLANNER_VERSION_CH5 = "phase4-ch5-v1";

/** Chapter 6 Valuation sitting. */
export const PLANNER_VERSION_CH6 = "phase4-ch6-v1";

/** Chapter 7 Real Property Ownership sitting. */
export const PLANNER_VERSION_CH7 = "phase4-ch7-v1";

/** Chapter 8 Title of Real Estate sitting. */
export const PLANNER_VERSION_CH8 = "phase4-ch8-v1";

export const TEACH_ME_SITTINGS = [
  {
    id: "chapter1" as const,
    plannerVersion: PLANNER_VERSION_CH1,
    label: "Chapter 1 — Agency Relationships",
    shortNext: "Agency Relationships",
  },
  {
    id: "chapter2" as const,
    plannerVersion: PLANNER_VERSION_CH2,
    label: "Chapter 2 — Agency Issues",
    shortNext: "Agency Issues",
  },
  {
    id: "chapter3" as const,
    plannerVersion: PLANNER_VERSION_CH3,
    label: "Chapter 3 — Agency Agreements",
    shortNext: "Agency Agreements",
  },
  {
    id: "chapter4" as const,
    plannerVersion: PLANNER_VERSION_CH4,
    label: "Chapter 4 — Disclosure Obligations",
    shortNext: "Disclosure Obligations",
  },
  {
    id: "chapter5" as const,
    plannerVersion: PLANNER_VERSION_CH5,
    label: "Chapter 5 — Fair Housing",
    shortNext: "Fair Housing",
  },
  {
    id: "chapter6" as const,
    plannerVersion: PLANNER_VERSION_CH6,
    label: "Chapter 6 — Valuation",
    shortNext: "Valuation",
  },
  {
    id: "chapter7" as const,
    plannerVersion: PLANNER_VERSION_CH7,
    label: "Chapter 7 — Real Property Ownership",
    shortNext: "Real Property Ownership",
  },
  {
    id: "chapter8" as const,
    plannerVersion: PLANNER_VERSION_CH8,
    label: "Chapter 8 — Title of Real Estate",
    shortNext: "Title of Real Estate",
  },
] as const;

export type TeachMeSittingId = (typeof TEACH_ME_SITTINGS)[number]["id"];

/** Ordered Teach Me sittings: finish each chapter before the next opens. */
export const TEACH_ME_PLANNER_VERSIONS = TEACH_ME_SITTINGS.map(
  (sitting) => sitting.plannerVersion,
);

/** @deprecated Prefer PLANNER_VERSION_CH1 — kept for older imports/tests. */
export const PLANNER_VERSION = PLANNER_VERSION_CH1;

export const SESSION_TARGET_MINUTES = 20;

export type ConceptStudyState = "not_started" | "learning";

export function sittingById(id: TeachMeSittingId) {
  const sitting = TEACH_ME_SITTINGS.find((row) => row.id === id);
  if (!sitting) {
    throw new Error(`Unknown Teach Me sitting: ${id}`);
  }
  return sitting;
}

export function sittingByPlannerVersion(plannerVersion: string | null | undefined) {
  return (
    TEACH_ME_SITTINGS.find((row) => row.plannerVersion === plannerVersion) ?? TEACH_ME_SITTINGS[0]
  );
}

export function sittingLabelForPlanner(plannerVersion: string | null | undefined): string {
  return sittingByPlannerVersion(plannerVersion).label;
}

export function recommendedNextForPlanner(plannerVersion: string | null | undefined): string {
  const index = TEACH_ME_SITTINGS.findIndex((row) => row.plannerVersion === plannerVersion);
  const current = TEACH_ME_SITTINGS[Math.max(index, 0)];
  const next = index >= 0 ? TEACH_ME_SITTINGS[index + 1] : undefined;
  if (!next) {
    return `${current.label} sitting complete. Review on Progress. Chapters 9–14 come next.`;
  }
  return `${current.label} sitting complete. Start session again for ${next.label}.`;
}
