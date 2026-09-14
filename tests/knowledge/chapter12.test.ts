import { describe, expect, it } from "vitest";
import {
  CHAPTER_12_CONCEPTS,
  CHAPTER_12_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_12_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 12 knowledge catalog", () => {
  const slugs = CHAPTER_12_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_12_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_12_CONCEPTS) {
      expect(concept.chapterNumber).toBe(12);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
        expect(citation.documentSlug).toBe("pub725-course-book");
      }
    }
  });

  it("maps concepts to exam category VI", () => {
    for (const concept of CHAPTER_12_CONCEPTS) {
      expect(concept.examCategoryCodes).toEqual(["VI"]);
    }
  });

  it("flags Wisconsin approved forms as WI-scoped", () => {
    expect(WI_SCOPED_CHAPTER_12_SLUGS).toEqual([
      "wb-44-counter-offer",
      "wb-46-multiple-counter-proposal",
      "wb-42-amendment-to-listing",
      "wb-40-amendment-to-offer",
      "wb-41-notice-relating-to-offer",
      "wb-45-cancellation-mutual-release",
      "wb-24-option-to-purchase",
      "wb-25-bill-of-sale",
    ]);
  });

  it("activates WB-44 vs WB-46 and WB-40 vs WB-41", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_12_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("wb-44-counter-offer", "wb-46-multiple-counter-proposal"),
      ),
    ).toBe(true);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("wb-40-amendment-to-offer", "wb-41-notice-relating-to-offer"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 12", () => {
    expect(activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS)).toHaveLength(0);
  });
});
