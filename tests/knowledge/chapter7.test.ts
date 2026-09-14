import { describe, expect, it } from "vitest";
import {
  CHAPTER_7_CONCEPTS,
  CHAPTER_7_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_7_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 7 knowledge catalog", () => {
  const slugs = CHAPTER_7_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_7_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_7_CONCEPTS) {
      expect(concept.chapterNumber).toBe(7);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
      }
    }
  });

  it("maps every Chapter 7 concept to exam category I only", () => {
    for (const concept of CHAPTER_7_CONCEPTS) {
      expect(concept.examCategoryCodes).toEqual(["I"]);
    }
  });

  it("flags Wisconsin marital property headings as WI-scoped", () => {
    expect(WI_SCOPED_CHAPTER_7_SLUGS).toEqual([
      "wisconsin-marital-property",
      "management-and-control",
    ]);
  });

  it("activates fixtures vs trade fixtures and freehold vs leasehold", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_7_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("property-fixtures", "trade-fixtures"),
      ),
    ).toBe(true);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("freehold-estates", "leasehold-estates"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 7", () => {
    expect(activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS)).toHaveLength(0);
  });
});
