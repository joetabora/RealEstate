import { describe, expect, it } from "vitest";
import {
  CHAPTER_1_CONFUSION_PAIRS,
  CHAPTER_2_CONFUSION_PAIRS,
  CHAPTER_3_CONFUSION_PAIRS,
  CHAPTER_4_CONFUSION_PAIRS,
  CHAPTER_5_CONFUSION_PAIRS,
  CHAPTER_6_CONFUSION_PAIRS,
  CHAPTER_7_CONFUSION_PAIRS,
  CHAPTER_8_CONFUSION_PAIRS,
  CHAPTER_9_CONFUSION_PAIRS,
  CHAPTER_10_CONFUSION_PAIRS,
  CHAPTER_11_CONFUSION_PAIRS,
  CHAPTER_12_CONFUSION_PAIRS,
  CHAPTER_13_CONFUSION_PAIRS,
  DEFERRED_CONFUSION_PAIRS,
} from "@/lib/knowledge";
import { canonicalPairKey } from "@/lib/knowledge/types";
import {
  citationsForAsset,
  PHASE4_ASSETS,
  PHASE4_SESSION_STEPS,
  pairKeyForAsset,
} from "@/lib/teach-me/assets";
import {
  PHASE4_CH2_ASSETS,
  PHASE4_CH2_SESSION_STEPS,
} from "@/lib/teach-me/chapter2-assets";
import {
  PHASE4_CH3_ASSETS,
  PHASE4_CH3_SESSION_STEPS,
} from "@/lib/teach-me/chapter3-assets";
import {
  PHASE4_CH4_ASSETS,
  PHASE4_CH4_SESSION_STEPS,
} from "@/lib/teach-me/chapter4-assets";
import {
  PHASE4_CH5_ASSETS,
  PHASE4_CH5_SESSION_STEPS,
} from "@/lib/teach-me/chapter5-assets";
import {
  PHASE4_CH6_ASSETS,
  PHASE4_CH6_SESSION_STEPS,
} from "@/lib/teach-me/chapter6-assets";
import {
  PHASE4_CH7_ASSETS,
  PHASE4_CH7_SESSION_STEPS,
} from "@/lib/teach-me/chapter7-assets";
import {
  PHASE4_CH8_ASSETS,
  PHASE4_CH8_SESSION_STEPS,
} from "@/lib/teach-me/chapter8-assets";
import {
  PHASE4_CH9_ASSETS,
  PHASE4_CH9_SESSION_STEPS,
} from "@/lib/teach-me/chapter9-assets";
import {
  PHASE4_CH10_ASSETS,
  PHASE4_CH10_SESSION_STEPS,
} from "@/lib/teach-me/chapter10-assets";
import {
  PHASE4_CH11_ASSETS,
  PHASE4_CH11_SESSION_STEPS,
} from "@/lib/teach-me/chapter11-assets";
import {
  PHASE4_CH12_ASSETS,
  PHASE4_CH12_SESSION_STEPS,
} from "@/lib/teach-me/chapter12-assets";
import {
  PHASE4_CH13_ASSETS,
  PHASE4_CH13_SESSION_STEPS,
} from "@/lib/teach-me/chapter13-assets";

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

describe("Chapter 2 Agency Issues assets", () => {
  it("gives every Chapter 2 asset a PDF page citation", () => {
    expect(PHASE4_CH2_ASSETS).toHaveLength(PHASE4_CH2_SESSION_STEPS.length);
    for (const asset of PHASE4_CH2_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.pdfPage > 0)).toBe(true);
      expect(citations.every((citation) => citation.chapterNumber === 2)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const bodies = PHASE4_CH2_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
  });

  it("only uses confusion pairs that exist in Chapter 2", () => {
    const activeKeys = new Set(
      CHAPTER_2_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    const deferredKeys = new Set(
      DEFERRED_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_CH2_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
      expect(deferredKeys.has(key)).toBe(false);
    }
  });
});

describe("Chapter 3 Agency Agreements assets", () => {
  it("gives every Chapter 3 asset a PDF page citation", () => {
    expect(PHASE4_CH3_ASSETS).toHaveLength(PHASE4_CH3_SESSION_STEPS.length);
    for (const asset of PHASE4_CH3_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.pdfPage > 0)).toBe(true);
      expect(citations.every((citation) => citation.chapterNumber === 3)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const bodies = PHASE4_CH3_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
  });

  it("only uses confusion pairs that exist in Chapter 3", () => {
    const activeKeys = new Set(
      CHAPTER_3_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    const deferredKeys = new Set(
      DEFERRED_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_CH3_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
      expect(deferredKeys.has(key)).toBe(false);
    }
  });
});

describe("Chapter 4 Disclosure Obligations assets", () => {
  it("gives every Chapter 4 asset a PDF page citation", () => {
    expect(PHASE4_CH4_ASSETS).toHaveLength(PHASE4_CH4_SESSION_STEPS.length);
    for (const asset of PHASE4_CH4_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.pdfPage > 0)).toBe(true);
      expect(citations.every((citation) => citation.chapterNumber === 4)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const bodies = PHASE4_CH4_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
  });

  it("only uses confusion pairs that exist in Chapter 4", () => {
    const activeKeys = new Set(
      CHAPTER_4_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    const deferredKeys = new Set(
      DEFERRED_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_CH4_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
      expect(deferredKeys.has(key)).toBe(false);
    }
  });
});

describe("Chapter 5 Fair Housing assets", () => {
  it("gives every Chapter 5 asset a PDF page citation", () => {
    expect(PHASE4_CH5_ASSETS).toHaveLength(PHASE4_CH5_SESSION_STEPS.length);
    for (const asset of PHASE4_CH5_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.chapterNumber === 5)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers, dollar fees, or protected-class lists", () => {
    const bodies = PHASE4_CH5_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
    expect(bodies).not.toMatch(/race,\s*color/i);
  });

  it("only uses confusion pairs that exist in Chapter 5", () => {
    const activeKeys = new Set(
      CHAPTER_5_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_CH5_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
    }
  });
});

describe("Chapter 6 Valuation assets", () => {
  it("gives every Chapter 6 asset a PDF page citation", () => {
    expect(PHASE4_CH6_ASSETS).toHaveLength(PHASE4_CH6_SESSION_STEPS.length);
    for (const asset of PHASE4_CH6_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.chapterNumber === 6)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const bodies = PHASE4_CH6_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
  });

  it("only uses confusion pairs that exist in Chapter 6", () => {
    const activeKeys = new Set(
      CHAPTER_6_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_CH6_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
    }
  });
});

describe("Chapter 7 Real Property Ownership assets", () => {
  it("gives every Chapter 7 asset a PDF page citation", () => {
    expect(PHASE4_CH7_ASSETS).toHaveLength(PHASE4_CH7_SESSION_STEPS.length);
    for (const asset of PHASE4_CH7_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.chapterNumber === 7)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const bodies = PHASE4_CH7_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
  });

  it("only uses confusion pairs that exist in Chapter 7", () => {
    const activeKeys = new Set(
      CHAPTER_7_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_CH7_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
    }
  });
});

describe("Chapter 8 Title of Real Estate assets", () => {
  it("gives every Chapter 8 asset a PDF page citation", () => {
    expect(PHASE4_CH8_ASSETS).toHaveLength(PHASE4_CH8_SESSION_STEPS.length);
    for (const asset of PHASE4_CH8_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.chapterNumber === 8)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const bodies = PHASE4_CH8_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
  });

  it("only uses confusion pairs that exist in Chapter 8", () => {
    const activeKeys = new Set(
      CHAPTER_8_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_CH8_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
    }
  });
});

describe("Chapter 9 Land Use assets", () => {
  it("gives every Chapter 9 asset a PDF page citation", () => {
    expect(PHASE4_CH9_ASSETS).toHaveLength(PHASE4_CH9_SESSION_STEPS.length);
    for (const asset of PHASE4_CH9_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.chapterNumber === 9)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const bodies = PHASE4_CH9_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
  });

  it("only uses confusion pairs that exist in Chapter 9", () => {
    const activeKeys = new Set(
      CHAPTER_9_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_CH9_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
    }
  });
});

describe("Chapter 10 Offers to Purchase assets", () => {
  it("gives every Chapter 10 asset a PDF page citation", () => {
    expect(PHASE4_CH10_ASSETS).toHaveLength(PHASE4_CH10_SESSION_STEPS.length);
    for (const asset of PHASE4_CH10_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.chapterNumber === 10)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const bodies = PHASE4_CH10_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
  });

  it("only uses confusion pairs that exist in Chapter 10", () => {
    const activeKeys = new Set(
      CHAPTER_10_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_CH10_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
    }
  });
});

describe("Chapter 11 Financing assets", () => {
  it("gives every Chapter 11 asset a PDF page citation", () => {
    expect(PHASE4_CH11_ASSETS).toHaveLength(PHASE4_CH11_SESSION_STEPS.length);
    for (const asset of PHASE4_CH11_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.chapterNumber === 11)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const bodies = PHASE4_CH11_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
  });

  it("only uses confusion pairs that exist in Chapter 11", () => {
    const activeKeys = new Set(
      CHAPTER_11_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_CH11_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
    }
  });
});

describe("Chapter 12 Other Approved Forms assets", () => {
  it("gives every Chapter 12 asset a PDF page citation", () => {
    expect(PHASE4_CH12_ASSETS).toHaveLength(PHASE4_CH12_SESSION_STEPS.length);
    for (const asset of PHASE4_CH12_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.chapterNumber === 12)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const bodies = PHASE4_CH12_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
  });

  it("only uses confusion pairs that exist in Chapter 12", () => {
    const activeKeys = new Set(
      CHAPTER_12_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_CH12_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
    }
  });
});

describe("Chapter 13 Contract Law assets", () => {
  it("gives every Chapter 13 asset a PDF page citation", () => {
    expect(PHASE4_CH13_ASSETS).toHaveLength(PHASE4_CH13_SESSION_STEPS.length);
    for (const asset of PHASE4_CH13_ASSETS) {
      const citations = citationsForAsset(asset);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.chapterNumber === 13)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const bodies = PHASE4_CH13_ASSETS.map((asset) => asset.body).join(" ");
    expect(bodies).not.toMatch(/wis\.?\s*stat/i);
    expect(bodies).not.toMatch(/\$\d/);
  });

  it("only uses confusion pairs that exist in Chapter 13", () => {
    const activeKeys = new Set(
      CHAPTER_13_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const asset of PHASE4_CH13_ASSETS) {
      const key = pairKeyForAsset(asset);
      if (!key) continue;
      expect(activeKeys.has(key)).toBe(true);
    }
  });
});
