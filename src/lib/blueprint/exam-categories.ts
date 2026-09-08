export const COURSE_EDITION_SEED = {
  slug: "wra-sales-2024",
  name: "WRA Real Estate Sales 2024",
  jurisdiction: "WI",
} as const;

export const LOCAL_LEARNER_KEY = "local" as const;

export const SALESPERSON_EXAM_ITEM_TOTAL = 140;

/**
 * Public Pearson VUE Wisconsin salesperson content outline (scored items).
 * Exam-weighting structure only — not course material.
 */
export const SALESPERSON_EXAM_CATEGORIES = [
  { code: "I", name: "Ownership and transfer", weight: 14, sortOrder: 1 },
  { code: "II", name: "Land use", weight: 5, sortOrder: 2 },
  { code: "III", name: "Valuing, financing, calculations", weight: 20, sortOrder: 3 },
  { code: "IV", name: "Agency", weight: 32, sortOrder: 4 },
  { code: "V", name: "Disclosures", weight: 13, sortOrder: 5 },
  { code: "VI", name: "Contract law and approved forms", weight: 22, sortOrder: 6 },
  { code: "VII", name: "Business ethics", weight: 14, sortOrder: 7 },
  { code: "VIII", name: "Fair housing", weight: 6, sortOrder: 8 },
  { code: "IX", name: "Federal antitrust", weight: 2, sortOrder: 9 },
  { code: "X", name: "Miscellaneous", weight: 12, sortOrder: 10 },
] as const;

export type ExamCategorySeed = (typeof SALESPERSON_EXAM_CATEGORIES)[number];

export function examCategoryWeightTotal(
  categories: readonly { weight: number }[] = SALESPERSON_EXAM_CATEGORIES,
): number {
  return categories.reduce((sum, category) => sum + category.weight, 0);
}

export function selectStartingExamCategory<
  T extends { code: string; name: string; weight: number },
>(categories: readonly T[]): T {
  if (categories.length === 0) {
    throw new Error("Cannot select a starting exam category from an empty list.");
  }

  return [...categories].sort((a, b) => {
    if (b.weight !== a.weight) {
      return b.weight - a.weight;
    }
    return a.code.localeCompare(b.code);
  })[0];
}
