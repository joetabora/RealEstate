import { describe, expect, it } from "vitest";
import { ConceptDetail } from "@/components/concept-detail";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ConceptDetailData } from "@/lib/knowledge/queries";

const baseConcept: ConceptDetailData = {
  slug: "nature-of-agency",
  name: "The nature of the agency",
  groupLabel: "Roles",
  jurisdictionScope: "wi",
  examCategoryCodes: ["IV"],
  chapterNumber: 1,
  state: "learning",
  reviewSchedule: null,
  citations: [],
  prerequisites: [],
  requiredBy: [],
  partOf: [],
  confusionPairs: [],
  mathTemplateId: null,
  mathHref: null,
};

describe("ConceptDetail review schedule", () => {
  it("explains missing schedules without inventing a score", () => {
    const html = renderToStaticMarkup(createElement(ConceptDetail, { concept: baseConcept }));
    expect(html).toContain("No SM-2 schedule yet");
    expect(html).not.toContain("0%");
  });

  it("renders overdue schedule fields and a Practice link", () => {
    const html = renderToStaticMarkup(
      createElement(ConceptDetail, {
        concept: {
          ...baseConcept,
          reviewSchedule: {
            dueAt: "2000-01-01T00:00:00.000Z",
            intervalDays: 1,
            repetitions: 0,
            lapses: 2,
            lastQuality: 1,
            lastReviewedAt: "1999-12-31T00:00:00.000Z",
            overdue: true,
          },
        },
      }),
    );
    expect(html).toContain("Overdue");
    expect(html).toContain("quality 1");
    expect(html).toContain("/practice");
  });
});
