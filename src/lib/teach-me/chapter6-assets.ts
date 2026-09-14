import type { AssetSeed } from "./assets";

/**
 * Hand-authored Chapter 6 (Valuation) teaching units.
 * Original language plus heading citations. No invented formulas, dollar fees, or statutes.
 */
export const PHASE4_CH6_ASSETS: readonly AssetSeed[] = [
  {
    slug: "ch6-overview-explanation",
    kind: "explanation",
    informationClass: "general_explanation",
    conceptSlug: "valuation-chapter-overview",
    title: "Valuation chapter overview",
    body: "Chapter 6 opens with Chapter Overview: buyers and sellers expect licensees to guide market value. The notes then split into Market Value Versus Appraised Value, Principles of Value, and The Market Data (Sales Comparison) Approach. Stay on those headings — do not invent appraisal math here.",
    citationSlugs: ["valuation-chapter-overview"],
  },
  {
    slug: "ch6-market-vs-appraised-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "market-value-versus-appraised-value",
    title: "Market value versus appraised value",
    body: "Chapter 6 notes have a dedicated Market Value Versus Appraised Value heading. Treat market value and appraised value as the distinction named by that heading — not as interchangeable labels. Do not invent dollar thresholds or Wisconsin appraisal rules beyond the sourced heading.",
    citationSlugs: ["market-value-versus-appraised-value"],
  },
  {
    slug: "ch6-market-vs-appraised-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "market-value-versus-appraised-value",
    title: "Market vs appraised in plain language",
    body: "When an item contrasts market value with an appraisal, point to Chapter 6’s Market Value Versus Appraised Value heading. Read that sourced heading before guessing which role the licensee plays versus the appraiser.",
    citationSlugs: ["market-value-versus-appraised-value"],
  },
  {
    slug: "ch6-market-vs-principles-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "market-value-versus-appraised-value", b: "principles-of-value" },
    title: "Market/appraised vs principles of value",
    body: "Chapter 6 notes keep Market Value Versus Appraised Value and Principles of Value as separate headings. Repair by asking whether the item is about those two value labels or about the principles heading.",
    citationSlugs: ["market-value-versus-appraised-value", "principles-of-value"],
  },
  {
    slug: "ch6-principles-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "principles-of-value",
    title: "Principles of value",
    body: "Chapter 6 has a Principles of Value heading after Market Value Versus Appraised Value. Use that heading for principle-named ideas in this chapter. Do not invent a numbered principle list from memory — stay on the sourced heading.",
    citationSlugs: ["principles-of-value"],
  },
  {
    slug: "ch6-principles-vs-market-data-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "principles-of-value", b: "market-data-sales-comparison-approach" },
    title: "Principles vs market data approach",
    body: "Chapter 6 separates Principles of Value from The Market Data (Sales Comparison) Approach. Repair by naming which heading the item is testing — a value principle versus the sales-comparison approach.",
    citationSlugs: ["principles-of-value", "market-data-sales-comparison-approach"],
  },
  {
    slug: "ch6-market-data-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "market-data-sales-comparison-approach",
    title: "Market data (sales comparison) approach",
    body: "Chapter 6 notes title this heading The Market Data (Sales Comparison) Approach. It is the approach heading for comparing a subject property to comparables — not the same heading as Market Value Versus Appraised Value or Principles of Value. Do not invent adjustment dollars beyond the sourced heading.",
    citationSlugs: ["market-data-sales-comparison-approach"],
  },
  {
    slug: "ch6-market-vs-approach-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "market-value-versus-appraised-value", b: "market-data-sales-comparison-approach" },
    title: "Value labels vs market data approach",
    body: "Chapter 6 separates Market Value Versus Appraised Value from The Market Data (Sales Comparison) Approach. One heading names value labels; the other names the comparison approach. Do not collapse them into one idea.",
    citationSlugs: [
      "market-value-versus-appraised-value",
      "market-data-sales-comparison-approach",
    ],
  },
  {
    slug: "ch6-market-vs-principles-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "market-value-versus-appraised-value", b: "principles-of-value" },
    title: "Say market/appraised vs principles",
    body: "Explain why Chapter 6 keeps Market Value Versus Appraised Value and Principles of Value as two headings. One sentence each. Do not invent Wisconsin statute numbers.",
    citationSlugs: ["market-value-versus-appraised-value", "principles-of-value"],
  },
  {
    slug: "ch6-principles-vs-approach-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "principles-of-value", b: "market-data-sales-comparison-approach" },
    title: "Say principles vs market data approach",
    body: "Explain the difference between the Principles of Value heading and The Market Data (Sales Comparison) Approach heading in Chapter 6. Do not invent adjustment examples.",
    citationSlugs: ["principles-of-value", "market-data-sales-comparison-approach"],
  },
  {
    slug: "ch6-market-vs-appraised-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "market-value-versus-appraised-value", b: "market-data-sales-comparison-approach" },
    title: "Recall: value labels or market data approach?",
    body: "An item contrasts a licensee’s market analysis with an appraisal. Name the Chapter 6 heading for that contrast — and name the separate Market Data (Sales Comparison) Approach heading so you do not mix them.",
    citationSlugs: [
      "market-value-versus-appraised-value",
      "market-data-sales-comparison-approach",
    ],
  },
  {
    slug: "ch6-principles-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "principles-of-value", b: "market-data-sales-comparison-approach" },
    title: "Recall: principles or market data approach?",
    body: "An item asks about a named principle of value. Is that the Principles of Value heading or The Market Data (Sales Comparison) Approach heading — and what is the sibling heading for?",
    citationSlugs: ["principles-of-value", "market-data-sales-comparison-approach"],
  },
];

export const PHASE4_CH6_SESSION_STEPS: readonly {
  assetSlug: string;
  kind: "learn" | "repair" | "teachback" | "recall";
  reasonCodes: readonly string[];
}[] = [
  { assetSlug: "ch6-overview-explanation", kind: "learn", reasonCodes: ["exam_weight_valuing", "chapter_6"] },
  { assetSlug: "ch6-market-vs-appraised-explanation", kind: "learn", reasonCodes: ["exam_weight_valuing", "chapter_6"] },
  { assetSlug: "ch6-market-vs-appraised-simple", kind: "learn", reasonCodes: ["exam_weight_valuing", "modality_simple"] },
  { assetSlug: "ch6-market-vs-principles-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch6-principles-explanation", kind: "learn", reasonCodes: ["exam_weight_valuing", "chapter_6"] },
  { assetSlug: "ch6-principles-vs-market-data-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch6-market-data-explanation", kind: "learn", reasonCodes: ["exam_weight_valuing", "chapter_6"] },
  { assetSlug: "ch6-market-vs-approach-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch6-market-vs-principles-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "ch6-principles-vs-approach-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "ch6-market-vs-appraised-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch6-principles-recall", kind: "recall", reasonCodes: ["retrieval"] },
];
