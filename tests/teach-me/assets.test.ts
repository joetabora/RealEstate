import { describe, expect, it } from "vitest";
import { CHAPTER_1_CONFUSION_PAIRS, DEFERRED_CONFUSION_PAIRS } from "@/lib/knowledge";
import { canonicalPairKey } from "@/lib/knowledge/types";
import { citationsForAsset, PHASE4_ASSETS, PHASE4_SESSION_STEPS, pairKeyForAsset } from "@/lib/teach-me/assets";

describe("Phase 4 Agency assets", () => {
  it("gives every asset a PDF page citation", () => {
    expect(PHASE4_ASSETS.length).toBeGreaterThan(0);
    expect(PHASE4_ASSETS).toHaveLength(PHASE4_SESSION_STEPS.length);
    for (const asset of PHASE4_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.pdfPage > 0)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers", () => {
    const bodies = PHASE4_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
  });

  it("marks designated-agency comparison as course-sourced", () => {
    const asset = PHASE4_ASSETS.find((row) => row.slug === "designated-agency-comparison");
    expect(asset?.informationClass).toBe("course_sourced");
    expect(asset?.citationSlugs).toContain("multiple-representation-with-designated-agency");
  });

  it("only uses confusion pairs that exist in Chapter 1", () => {
    const activeKeys = new Set(
      CHAPTER_1_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    const deferredKeys = new Set(
      DEFERRED_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
      expect(deferredKeys.has(key)).toBe(false);
    }
  });
});
