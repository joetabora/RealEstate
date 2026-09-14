import { describe, expect, it } from "vitest";
import {
  CHAPTER_14_CONCEPTS,
  CHAPTER_14_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_14_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 14 knowledge catalog", () => {
  const slugs = CHAPTER_14_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_14_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_14_CONCEPTS) {
      expect(concept.chapterNumber).toBe(14);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
        expect(citation.documentSlug).toBe("pub725-course-book");
      }
    }
  });

  it("maps concepts to exam category X", () => {
    for (const concept of CHAPTER_14_CONCEPTS) {
      expect(concept.examCategoryCodes).toEqual(["X"]);
    }
  });

  it("flags Wisconsin trust-account headings as WI-scoped", () => {
    expect(WI_SCOPED_CHAPTER_14_SLUGS).toEqual([
      "reeb-18-trust-accounts",
      "client-funds",
      "non-client-funds",
      "ibreta",
      "depositing-funds",
    ]);
  });

  it("activates client vs non-client funds and REEB 18 vs IBRETA", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_14_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) === canonicalPairKey("client-funds", "non-client-funds"),
      ),
    ).toBe(true);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("reeb-18-trust-accounts", "ibreta"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 14", () => {
    expect(activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS)).toHaveLength(0);
  });
});
