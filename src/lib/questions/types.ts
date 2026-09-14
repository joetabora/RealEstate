export const PLANNER_VERSION_PRACTICE_CH1 = "phase5-ch1-practice-v1";

export const PRACTICE_PLANNER_VERSIONS = [PLANNER_VERSION_PRACTICE_CH1] as const;

export type PracticePlannerVersion = (typeof PRACTICE_PLANNER_VERSIONS)[number];

export const PRACTICE_SESSION_TARGET_MINUTES = 15;

export function isPracticePlannerVersion(
  version: string | null | undefined,
): version is PracticePlannerVersion {
  return (
    typeof version === "string" &&
    (PRACTICE_PLANNER_VERSIONS as readonly string[]).includes(version)
  );
}
