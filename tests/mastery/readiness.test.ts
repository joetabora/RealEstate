import { describe, expect, it } from "vitest";
import {
  buildExamReadinessSummary,
  emptyExamReadinessSummary,
} from "@/lib/mastery/readiness";

describe("Phase 15 exam readiness narrative", () => {
  it("returns blueprint rows with empty-signal copy", () => {
    const summary = emptyExamReadinessSummary();
    expect(summary.categories).toHaveLength(10);
    expect(summary.headline.toLowerCase()).toMatch(/not a score prediction|no study signals/);
    expect(summary.categories[0].line).toMatch(/no open signals yet/);
    expect(summary.nextActions.some((a) => a.href === "/")).toBe(true);
  });

  it("aggregates mistakes and overdue by exam category without inventing a score %", () => {
    const summary = buildExamReadinessSummary({
      categories: [
        { code: "IV", name: "Agency", weight: 32 },
        { code: "III", name: "Valuing, financing, calculations", weight: 20 },
      ],
      conceptCategories: new Map([
        ["c1", ["IV"]],
        ["c2", ["IV"]],
        ["c3", ["III"]],
      ]),
      learningConceptIds: new Set(["c1"]),
      openMistakeConceptIds: ["c1", "c2"],
      overdueConceptIds: ["c3"],
      lastSimAt: "2026-09-15T12:00:00.000Z",
      lastSimOverall: { correct: 18, answered: 24, total: 24 },
      lastSimByCategory: [
        { code: "IV", name: "Agency", answered: 10, correct: 7 },
        { code: "III", name: "Valuing, financing, calculations", answered: 5, correct: 4 },
      ],
    });

    const agency = summary.categories.find((c) => c.code === "IV");
    const math = summary.categories.find((c) => c.code === "III");
    expect(agency?.openMistakeCount).toBe(2);
    expect(agency?.learningCount).toBe(1);
    expect(agency?.line).toMatch(/2 open mistakes/);
    expect(agency?.line).toMatch(/last sim 7\/10/);
    expect(math?.overdueCount).toBe(1);
    expect(summary.headline).toMatch(/last sim 18\/24/);
    expect(summary.headline.toLowerCase()).not.toMatch(/you will score|% mastery/);
    expect(summary.nextActions[0]?.href).toBe("/mistakes");
  });

  it("never claims a predicted licensing score", () => {
    const summary = buildExamReadinessSummary({
      categories: [{ code: "IX", name: "Federal antitrust", weight: 2 }],
      conceptCategories: new Map(),
      learningConceptIds: new Set(),
      openMistakeConceptIds: [],
      overdueConceptIds: [],
      lastSimAt: null,
      lastSimOverall: null,
      lastSimByCategory: [],
    });
    expect(summary.headline.toLowerCase()).toMatch(/not a.*score prediction|no study signals/);
  });
});
