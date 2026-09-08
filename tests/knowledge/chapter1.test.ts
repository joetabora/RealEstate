import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  CHAPTER_1_CONCEPTS,
  CHAPTER_1_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_1_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 1 knowledge catalog", () => {
  const slugs = CHAPTER_1_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_1_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_1_CONCEPTS) {
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
        expect(citation.heading.length).toBeGreaterThan(0);
      }
    }
  });

  it("maps every Chapter 1 concept to exam category IV only", () => {
    for (const concept of CHAPTER_1_CONCEPTS) {
      expect(concept.examCategoryCodes).toEqual(["IV"]);
    }
  });

  it("flags Wisconsin-sourced slugs from inspected chapter markers", () => {
    expect([...WI_SCOPED_CHAPTER_1_SLUGS].sort()).toEqual(
      [
        "advertises-property",
        "agency-disclosure-obligations",
        "broker",
        "client-agency-disclosure",
        "disclosure-of-compensation-and-interests",
        "dsps-notification",
        "license-exceptions",
        "multiple-representation-with-designated-agency",
        "multiple-representation-without-designated-agency",
        "nature-of-agency",
        "negotiation",
        "pattern-of-sales",
        "shows-property",
        "written-report-of-property-value",
      ].sort(),
    );
  });

  it("keeps deferred confusion-pair slugs out of Chapter 1", () => {
    const present = new Set(slugs);
    for (const pair of DEFERRED_CONFUSION_PAIRS) {
      expect(present.has(pair.a)).toBe(false);
      expect(present.has(pair.b)).toBe(false);
    }
  });

  it("activates only pairs whose both slugs exist", () => {
    const active = activateConfusionPairs(slugs, [
      ...CHAPTER_1_CONFUSION_PAIRS,
      { a: "client", b: "missing-later-chapter", reason: "should drop" },
    ]);
    expect(active.every((pair) => slugs.includes(pair.a) && slugs.includes(pair.b))).toBe(
      true,
    );
    expect(active.some((pair) => pair.b === "missing-later-chapter")).toBe(false);
    expect(
      active.some(
        (pair) => canonicalPairKey(pair.a, pair.b) === canonicalPairKey("client", "customer"),
      ),
    ).toBe(true);
  });

  it("does not activate easement vs license from Chapter 1", () => {
    const active = activateConfusionPairs(slugs, [
      ...CHAPTER_1_CONFUSION_PAIRS,
      ...DEFERRED_CONFUSION_PAIRS,
    ]);
    expect(
      active.some((pair) => canonicalPairKey(pair.a, pair.b) === canonicalPairKey("easement", "license")),
    ).toBe(false);
  });

  it("uses unique slugs", () => {
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("prisma schema (Phase 3)", () => {
  it("declares concept and confusion models", () => {
    const schema = readFileSync(
      path.resolve(process.cwd(), "prisma/schema.prisma"),
      "utf8",
    );
    for (const model of [
      "Concept",
      "ConceptCitation",
      "ConceptExamCategory",
      "ConceptRelationship",
      "ConfusionPair",
      "ConfusionEvidence",
    ]) {
      expect(schema).toContain(`model ${model}`);
    }
  });
});
