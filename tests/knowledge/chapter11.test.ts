import { describe, expect, it } from "vitest";
import {
  CHAPTER_11_CONCEPTS,
  CHAPTER_11_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_11_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 11 knowledge catalog", () => {
  const slugs = CHAPTER_11_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_11_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_11_CONCEPTS) {
      expect(concept.chapterNumber).toBe(11);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
      }
    }
  });

  it("maps concepts to exam category III", () => {
    for (const concept of CHAPTER_11_CONCEPTS) {
      expect(concept.examCategoryCodes).toEqual(["III"]);
    }
  });

  it("flags Wisconsin foreclosure stages as WI-scoped", () => {
    expect(WI_SCOPED_CHAPTER_11_SLUGS).toEqual(["stages-of-foreclosure-wisconsin"]);
  });

  it("activates conventional vs government and foreclosure vs deed in lieu", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_11_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("conventional-financing", "government-financing"),
      ),
    ).toBe(true);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("foreclosure", "deed-in-lieu-of-foreclosure"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 11", () => {
    expect(activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS)).toHaveLength(0);
  });
});
