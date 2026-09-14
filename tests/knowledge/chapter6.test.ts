import { describe, expect, it } from "vitest";
import {
  CHAPTER_6_CONCEPTS,
  CHAPTER_6_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_6_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 6 knowledge catalog", () => {
  const slugs = CHAPTER_6_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_6_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_6_CONCEPTS) {
      expect(concept.chapterNumber).toBe(6);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
      }
    }
  });

  it("maps every Chapter 6 concept to exam category III only", () => {
    for (const concept of CHAPTER_6_CONCEPTS) {
      expect(concept.examCategoryCodes).toEqual(["III"]);
    }
  });

  it("has no Wisconsin-only scoped concepts in Chapter 6", () => {
    expect(WI_SCOPED_CHAPTER_6_SLUGS).toEqual([]);
  });

  it("activates market/appraised vs principles and principles vs market data", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_6_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("market-value-versus-appraised-value", "principles-of-value"),
      ),
    ).toBe(true);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("principles-of-value", "market-data-sales-comparison-approach"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 6", () => {
    expect(activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS)).toHaveLength(0);
  });
});
