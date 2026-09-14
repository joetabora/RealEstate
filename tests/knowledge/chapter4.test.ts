import { describe, expect, it } from "vitest";
import {
  CHAPTER_4_CONCEPTS,
  CHAPTER_4_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_4_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 4 knowledge catalog", () => {
  const slugs = CHAPTER_4_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_4_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_4_CONCEPTS) {
      expect(concept.chapterNumber).toBe(4);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
        expect(citation.heading.length).toBeGreaterThan(0);
      }
    }
  });

  it("maps concepts to Disclosures V and optionally forms VI only", () => {
    for (const concept of CHAPTER_4_CONCEPTS) {
      for (const code of concept.examCategoryCodes) {
        expect(["V", "VI"]).toContain(code);
      }
      expect(concept.examCategoryCodes).toContain("V");
    }
  });

  it("flags Wisconsin-scoped owner/condo/licensee disclosure slugs", () => {
    expect(WI_SCOPED_CHAPTER_4_SLUGS).toEqual(
      expect.arrayContaining([
        "disclosure-by-owners",
        "seller-completion-of-recr",
        "licensee-disclosure-obligations",
        "condominium-disclosure-requirements",
      ]),
    );
    expect(WI_SCOPED_CHAPTER_4_SLUGS).not.toContain("lead-based-paint");
  });

  it("activates owner vs licensee and as-is vs owner disclosure pairs", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_4_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("disclosure-by-owners", "licensee-disclosure-obligations"),
      ),
    ).toBe(true);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("as-is-sales", "disclosure-by-owners"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 4", () => {
    expect(activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS)).toHaveLength(0);
  });
});
