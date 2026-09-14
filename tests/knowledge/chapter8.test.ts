import { describe, expect, it } from "vitest";
import {
  CHAPTER_8_CONCEPTS,
  CHAPTER_8_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_8_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 8 knowledge catalog", () => {
  const slugs = CHAPTER_8_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_8_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_8_CONCEPTS) {
      expect(concept.chapterNumber).toBe(8);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
      }
    }
  });

  it("maps title concepts to I and tax calculations to III", () => {
    for (const concept of CHAPTER_8_CONCEPTS) {
      if (concept.slug === "tax-calculations") {
        expect(concept.examCategoryCodes).toEqual(["III"]);
      } else {
        expect(concept.examCategoryCodes).toEqual(["I"]);
      }
    }
  });

  it("flags Wisconsin transfer fee as WI-scoped", () => {
    expect(WI_SCOPED_CHAPTER_8_SLUGS).toEqual(["wisconsin-transfer-fee"]);
  });

  it("activates warranty vs quitclaim and easements vs encroachments", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_8_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("warranty-deed", "quitclaim-deed"),
      ),
    ).toBe(true);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) === canonicalPairKey("easements", "encroachments"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 8", () => {
    expect(activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS)).toHaveLength(0);
  });
});
