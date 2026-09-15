import { COURSE_CHAPTER_TITLES } from "@/lib/knowledge/types";

export const PLANNER_VERSION_PRACTICE_CH1 = "phase5-ch1-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH2 = "phase5-ch2-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH3 = "phase5-ch3-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH4 = "phase5-ch4-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH5 = "phase5-ch5-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH6 = "phase5-ch6-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH7 = "phase5-ch7-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH8 = "phase5-ch8-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH9 = "phase5-ch9-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH10 = "phase5-ch10-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH11 = "phase5-ch11-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH12 = "phase5-ch12-practice-v1";
export const PLANNER_VERSION_PRACTICE_CH13 = "phase5-ch13-practice-v1";

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
  {
    chapterNumber: 6 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH6,
    label: `Chapter 6 — ${COURSE_CHAPTER_TITLES[6]}`,
    shortLabel: COURSE_CHAPTER_TITLES[6],
  },
  {
    chapterNumber: 7 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH7,
    label: `Chapter 7 — ${COURSE_CHAPTER_TITLES[7]}`,
    shortLabel: COURSE_CHAPTER_TITLES[7],
  },
  {
    chapterNumber: 8 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH8,
    label: `Chapter 8 — ${COURSE_CHAPTER_TITLES[8]}`,
    shortLabel: COURSE_CHAPTER_TITLES[8],
  },
  {
    chapterNumber: 9 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH9,
    label: `Chapter 9 — ${COURSE_CHAPTER_TITLES[9]}`,
    shortLabel: COURSE_CHAPTER_TITLES[9],
  },
  {
    chapterNumber: 10 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH10,
    label: `Chapter 10 — ${COURSE_CHAPTER_TITLES[10]}`,
    shortLabel: COURSE_CHAPTER_TITLES[10],
  },
  {
    chapterNumber: 11 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH11,
    label: `Chapter 11 — ${COURSE_CHAPTER_TITLES[11]}`,
    shortLabel: COURSE_CHAPTER_TITLES[11],
  },
  {
    chapterNumber: 12 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH12,
    label: `Chapter 12 — ${COURSE_CHAPTER_TITLES[12]}`,
    shortLabel: COURSE_CHAPTER_TITLES[12],
  },
  {
    chapterNumber: 13 as const,
    plannerVersion: PLANNER_VERSION_PRACTICE_CH13,
    label: `Chapter 13 — ${COURSE_CHAPTER_TITLES[13]}`,
    shortLabel: COURSE_CHAPTER_TITLES[13],
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
