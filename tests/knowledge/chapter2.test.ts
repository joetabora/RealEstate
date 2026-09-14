import { describe, expect, it } from "vitest";
import {
  CHAPTER_2_CONCEPTS,
  CHAPTER_2_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
  WI_SCOPED_CHAPTER_2_SLUGS,
  activateConfusionPairs,
  canonicalPairKey,
} from "@/lib/knowledge";

describe("Chapter 2 knowledge catalog", () => {
  const slugs = CHAPTER_2_CONCEPTS.map((concept) => concept.slug);

  it("gives every concept a PDF page citation", () => {
    expect(CHAPTER_2_CONCEPTS.length).toBeGreaterThan(0);
    for (const concept of CHAPTER_2_CONCEPTS) {
      expect(concept.chapterNumber).toBe(2);
      expect(concept.citations.length).toBeGreaterThan(0);
      for (const citation of concept.citations) {
        expect(citation.pdfPage).toBeGreaterThan(0);
        expect(citation.heading.length).toBeGreaterThan(0);
      }
    }
  });

  it("maps Agency concepts to IV and antitrust to IX only", () => {
    for (const concept of CHAPTER_2_CONCEPTS) {
      if (concept.group === "antitrust") {
        expect(concept.examCategoryCodes).toEqual(["IX"]);
      } else {
        expect(concept.examCategoryCodes).toEqual(["IV"]);
      }
    }
  });

  it("flags Wisconsin-scoped Chapter 2 slugs from inspected markers", () => {
    expect([...WI_SCOPED_CHAPTER_2_SLUGS].sort()).toEqual(
      [
        "antitrust-laws",
        "creation-of-agency",
        "express-agency",
        "implied-agency",
        "other-commission-issues",
        "payment-of-buyers-firm",
        "payment-of-listing-firm",
      ].sort(),
    );
  });

  it("activates exclusive agency vs exclusive right to sell", () => {
    const active = activateConfusionPairs(slugs, CHAPTER_2_CONFUSION_PAIRS);
    expect(
      active.some(
        (pair) =>
          canonicalPairKey(pair.a, pair.b) ===
          canonicalPairKey("exclusive-agency-listing", "exclusive-right-to-sell-listing"),
      ),
    ).toBe(true);
  });

  it("does not activate deferred pairs from Chapter 2", () => {
    const present = new Set(slugs);
    for (const pair of DEFERRED_CONFUSION_PAIRS) {
      expect(present.has(pair.a) && present.has(pair.b)).toBe(false);
    }
    const accidental = activateConfusionPairs(slugs, DEFERRED_CONFUSION_PAIRS);
    expect(accidental).toHaveLength(0);
  });
});
