import { describe, expect, it } from "vitest";
import {
  CHAPTER_10_CONCEPTS,
  CHAPTER_10_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_10_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 10 knowledge catalog", () => {
  const slugs = CHAPTER_10_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_10_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_10_CONCEPTS) {
      expect(concept.chapterNumber).toBe(10);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
      }
    }
  });

  it("maps concepts to exam category VI, with agency process on IV+VI", () => {
    for (const concept of CHAPTER_10_CONCEPTS) {
      if (
        [
          "offer-confidentiality-issues",
          "drafting-and-submission-of-offers",
          "cooperating-with-other-firms",
          "presentation-of-offers",
        ].includes(concept.slug)
      ) {
        expect(concept.examCategoryCodes).toEqual(["IV", "VI"]);
      } else {
        expect(concept.examCategoryCodes).toEqual(["VI"]);
      }
    }
  });

  it("flags approved offer forms and WB-11 provisions as WI-scoped", () => {
    expect(WI_SCOPED_CHAPTER_10_SLUGS).toEqual([
      "wb-11-residential-offer",
      "offer-earnest-money",
      "inspection-contingency",
      "financing-commitment-contingency",
      "offer-not-contingent-on-financing",
      "appraisal-contingency",
      "bump-clause",
      "secondary-offer",
      "wb-14-condominium-offer",
      "wb-13-vacant-land-offer",
    ]);
  });

  it("activates WB-11 vs WB-14 and bump vs secondary", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_10_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("wb-11-residential-offer", "wb-14-condominium-offer"),
      ),
    ).toBe(true);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) === canonicalPairKey("bump-clause", "secondary-offer"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 10", () => {
    expect(activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS)).toHaveLength(0);
  });
});
