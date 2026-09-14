import { describe, expect, it } from "vitest";
import {
  CHAPTER_5_CONCEPTS,
  CHAPTER_5_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_5_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 5 knowledge catalog", () => {
  const slugs = CHAPTER_5_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_5_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_5_CONCEPTS) {
      expect(concept.chapterNumber).toBe(5);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
      }
    }
  });

  it("maps every Chapter 5 concept to exam category VIII only", () => {
    for (const concept of CHAPTER_5_CONCEPTS) {
      expect(concept.examCategoryCodes).toEqual(["VIII"]);
    }
  });

  it("flags Wisconsin protected classes as WI-scoped", () => {
    expect(WI_SCOPED_CHAPTER_5_SLUGS).toEqual(["wisconsin-protected-classes"]);
  });

  it("activates prohibited vs permissible and fair housing vs ADA", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_5_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("prohibited-under-fair-housing", "permissible-under-fair-housing"),
      ),
    ).toBe(true);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("fair-housing-law", "americans-with-disabilities-act"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 5", () => {
    expect(activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS)).toHaveLength(0);
  });
});
