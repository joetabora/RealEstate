import { describe, expect, it } from "vitest";
import {
  CHAPTER_3_CONCEPTS,
  CHAPTER_3_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_3_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 3 knowledge catalog", () => {
  const slugs = CHAPTER_3_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_3_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_3_CONCEPTS) {
      expect(concept.chapterNumber).toBe(3);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
        expect(citation.heading.length).toBeGreaterThan(0);
      }
    }
  });

  it("maps concepts to Agency IV and/or approved-forms VI only", () => {
    for (const concept of CHAPTER_3_CONCEPTS) {
      for (const code of concept.examCategoryCodes) {
        expect(["IV", "VI"]).toContain(code);
      }
      expect(concept.examCategoryCodes.length).toBeGreaterThan(0);
    }
  });

  it("flags Wisconsin-scoped WB form slugs", () => {
    expect(WI_SCOPED_CHAPTER_3_SLUGS).toEqual(
      expect.arrayContaining([
        "wb-1-residential-listing",
        "wb-4-condo-listing",
        "wb-36-buyer-agency",
        "protected-buyer",
        "protected-property",
      ]),
    );
    expect(WI_SCOPED_CHAPTER_3_SLUGS).not.toContain("real-estate-transaction");
  });

  it("activates WB-1 vs WB-36 and protected buyer vs protected property", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_3_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("wb-1-residential-listing", "wb-36-buyer-agency"),
      ),
    ).toBe(true);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("protected-buyer", "protected-property"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 3", () => {
    const accidental = activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS);
    expect(accidental).toHaveLength(0);
  });
});
