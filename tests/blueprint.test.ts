import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  COURSE_EDITION_SEED,
  SALESPERSON_EXAM_CATEGORIES,
  SALESPERSON_EXAM_ITEM_TOTAL,
  examCategoryWeightTotal,
  selectStartingExamCategory,
} from "@/lib/blueprint";
import { buildTeachMeHomeFallback } from "@/lib/teach-me/home";

describe("salesperson exam blueprint", () => {
  it("weights sum to exactly 140", () => {
    expect(examCategoryWeightTotal()).toBe(140);
    expect(examCategoryWeightTotal()).toBe(SALESPERSON_EXAM_ITEM_TOTAL);
  });

  it("contains the ten official top-level categories", () => {
    expect(SALESPERSON_EXAM_CATEGORIES.map((c) => c.code)).toEqual([
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
    ]);
  });

  it("selects Agency as the starting area because it has the largest weight", () => {
    const start = selectStartingExamCategory(SALESPERSON_EXAM_CATEGORIES);
    expect(start.code).toBe("IV");
    expect(start.name).toBe("Agency");
    expect(start.weight).toBe(32);
  });

  it("builds Teach Me fallback data from the blueprint without a database", () => {
    const home = buildTeachMeHomeFallback();
    expect(home.databaseConnected).toBe(false);
    expect(home.hasSession).toBe(false);
    expect(home.edition.slug).toBe(COURSE_EDITION_SEED.slug);
    expect(home.startingCategory).toMatchObject({
      code: "IV",
      name: "Agency",
      weight: 32,
    });
    expect(examCategoryWeightTotal(home.categories)).toBe(140);
  });
});

describe("CourseEdition seed", () => {
  it("is deterministic", () => {
    expect(COURSE_EDITION_SEED).toEqual({
      slug: "wra-sales-2024",
      name: "WRA Real Estate Sales 2024",
      jurisdiction: "WI",
    });
  });
});

describe("prisma schema", () => {
  it("declares the Phase 1 models", () => {
    const schema = readFileSync(
      path.resolve(process.cwd(), "prisma/schema.prisma"),
      "utf8",
    );
    for (const model of [
      "CourseEdition",
      "ExamCategory",
      "Learner",
      "LearningSession",
      "SessionItem",
    ]) {
      expect(schema).toContain(`model ${model}`);
    }
  });
});
