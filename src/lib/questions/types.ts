import { COURSE_CHAPTER_TITLES } from "@/lib/knowledge/types";

export const PLANNER_VERSION_PRACTICE_CH1 = "phase5-ch1-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH2 = "phase5-ch2-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH3 = "phase5-ch3-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH4 = "phase5-ch4-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH5 = "phase5-ch5-practice-v1";

export const PRACTICE_SITTINGS = [
  {
    chapterNumber: 1 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH1,
    label: `Chapter 1 — ${COURSE_CHAPTER_TITLES[1]}`,
    shortLabel: COURSE_CHAPTER_TITLES[1],
  },
  {
    chapterNumber: 2 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH2,
    label: `Chapter 2 — ${COURSE_CHAPTER_TITLES[2]}`,
    shortLabel: COURSE_CHAPTER_TITLES[2],
  },
  {
    chapterNumber: 3 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH3,
    label: `Chapter 3 — ${COURSE_CHAPTER_TITLES[3]}`,
    shortLabel: COURSE_CHAPTER_TITLES[3],
  },
  {
    chapterNumber: 4 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH4,
    label: `Chapter 4 — ${COURSE_CHAPTER_TITLES[4]}`,
    shortLabel: COURSE_CHAPTER_TITLES[4],
  },
  {
    chapterNumber: 5 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH5,
    label: `Chapter 5 — ${COURSE_CHAPTER_TITLES[5]}`,
    shortLabel: COURSE_CHAPTER_TITLES[5],
  },
] as const;

export const PRACTICE_PLANNER_VERSIONS = PRACTICE_SITTINGS.map(
  (sitting) => sitting.plannerVersion,
);

export type PracticePlannerVersion = (typeof PRACTICE_PLANNER_VERSIONS)[number];
export type PracticeChapterNumber = (typeof PRACTICE_SITTINGS)[number]["chapterNumber"];

export const PRACTICE_SESSION_TARGET_MINUTES = 15;

export function isPracticePlannerVersion(
  version: string | null | undefined,
): version is PracticePlannerVersion {
  return (
    typeof version === "string" &&
    (PRACTICE_PLANNER_VERSIONS as readonly string[]).includes(version)
  );
}

export function practiceSittingByChapter(chapterNumber: number) {
  const sitting = PRACTICE_SITTINGS.find((row) => row.chapterNumber === chapterNumber);
  if (!sitting) {
    throw new Error(`No Phase 5 practice sitting for chapter ${chapterNumber}.`);
  }
  return sitting;
}

export function practiceSittingByPlannerVersion(plannerVersion: string | null | undefined) {
  return PRACTICE_SITTINGS.find((row) => row.plannerVersion === plannerVersion) ?? null;
}
