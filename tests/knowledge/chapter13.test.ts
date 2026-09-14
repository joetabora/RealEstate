import { describe, expect, it } from "vitest";
import {
  CHAPTER_13_CONCEPTS,
  CHAPTER_13_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_13_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 13 knowledge catalog", () => {
  const slugs = CHAPTER_13_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_13_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_13_CONCEPTS) {
      expect(concept.chapterNumber).toBe(13);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
        expect(citation.documentSlug).toBe("pub725-course-book");
      }
    }
  });

  it("maps concepts to exam category VI", () => {
    for (const concept of CHAPTER_13_CONCEPTS) {
      expect(concept.examCategoryCodes).toEqual(["VI"]);
    }
  });

  it("flags Wisconsin practice headings as WI-scoped", () => {
    expect(WI_SCOPED_CHAPTER_13_SLUGS).toEqual([
      "reeb-15-copies-and-records",
      "approved-forms-and-legal-advice",
      "wra-contract-drafting-tools",
    ]);
  });

  it("activates validity vs status and REEB 15 vs approved forms", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_13_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("validity-of-contracts", "status-of-contracts"),
      ),
    ).toBe(true);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("reeb-15-copies-and-records", "approved-forms-and-legal-advice"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 13", () => {
    expect(activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS)).toHaveLength(0);
  });
});
