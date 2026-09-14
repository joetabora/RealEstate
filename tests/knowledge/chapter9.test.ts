import { describe, expect, it } from "vitest";
import {
  CHAPTER_9_CONCEPTS,
  CHAPTER_9_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_9_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 9 knowledge catalog", () => {
  const slugs = CHAPTER_9_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_9_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_9_CONCEPTS) {
      expect(concept.chapterNumber).toBe(9);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
      }
    }
  });

  it("maps every Chapter 9 concept to exam category II only", () => {
    for (const concept of CHAPTER_9_CONCEPTS) {
      expect(concept.examCategoryCodes).toEqual(["II"]);
    }
  });

  it("flags Wisconsin zoning law basics as WI-scoped", () => {
    expect(WI_SCOPED_CHAPTER_9_SLUGS).toEqual(["wisconsin-zoning-law-basics"]);
  });

  it("activates permitted vs conditional and variances vs nonconforming", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_9_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("permitted-uses", "conditional-uses"),
      ),
    ).toBe(true);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("variances", "nonconforming-use"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 9", () => {
    expect(activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS)).toHaveLength(0);
  });
});
