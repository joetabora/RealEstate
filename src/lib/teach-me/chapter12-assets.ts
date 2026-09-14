import type { AssetSeed } from "./assets";

/**
 * Hand-authored Chapter 12 (Other Approved Forms) teaching units.
 * Original language plus PUB725 heading citations. No invented form-line text or fees.
 */
export const PHASE4_CH12_ASSETS: readonly AssetSeed[] = [
  {
    slug: "ch12-other-forms-overview-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "other-forms-chapter-overview",
    title: "Other approved forms overview",
    body: "Chapter 12 opens with Chapter Overview, then walks Wisconsin approved forms beyond the offer itself: counters, amendments, notice, cancellation, option, and bill of sale. Stay on those sourced headings — do not invent form-line language.",
    citationSlugs: ["other-forms-chapter-overview"],
  },
  {
    slug: "ch12-wb44-vs-wb46-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "wb-44-counter-offer", b: "wb-46-multiple-counter-proposal" },
    title: "WB-44 vs WB-46",
    body: "Chapter 12 keeps WB-44 Counter-Offer and WB-46 Multiple Counter-Proposal as separate headings. Repair by naming which heading the negotiation path fits. Do not invent form-line differences beyond the sourced headings.",
    citationSlugs: ["wb-44-counter-offer", "wb-46-multiple-counter-proposal"],
  },
  {
    slug: "ch12-wb40-vs-wb41-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "wb-40-amendment-to-offer", b: "wb-41-notice-relating-to-offer" },
    title: "WB-40 vs WB-41",
    body: "Chapter 12 separates WB-40 Amendment to Offer to Purchase from WB-41 Notice Relating to Offer to Purchase. An amendment changes agreed terms; a notice delivers required information — keep the headings distinct.",
    citationSlugs: ["wb-40-amendment-to-offer", "wb-41-notice-relating-to-offer"],
  },
  {
    slug: "ch12-wb42-vs-wb40-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "wb-42-amendment-to-listing", b: "wb-40-amendment-to-offer" },
    title: "WB-42 vs WB-40",
    body: "Chapter 12 lists WB-42 Amendment to Listing Contract and WB-40 Amendment to Offer to Purchase as separate headings. Repair by asking which contract the amendment heading is attached to.",
    citationSlugs: ["wb-42-amendment-to-listing", "wb-40-amendment-to-offer"],
  },
  {
    slug: "ch12-wb45-vs-wb41-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "wb-45-cancellation-mutual-release", b: "wb-41-notice-relating-to-offer" },
    title: "WB-45 vs WB-41",
    body: "Chapter 12 keeps WB-45 Cancellation Agreement and Mutual Release distinct from WB-41 Notice Relating to Offer to Purchase. Ending the deal and giving notice are not interchangeable headings.",
    citationSlugs: ["wb-45-cancellation-mutual-release", "wb-41-notice-relating-to-offer"],
  },
  {
    slug: "ch12-wb24-vs-wb25-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "wb-24-option-to-purchase", b: "wb-25-bill-of-sale" },
    title: "WB-24 vs WB-25",
    body: "Chapter 12 separates WB-24 Option to Purchase from WB-25 Bill of Sale. Repair by naming which heading fits — an option on real estate versus a personal-property transfer form.",
    citationSlugs: ["wb-24-option-to-purchase", "wb-25-bill-of-sale"],
  },
  {
    slug: "ch12-wb44-counter-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "wb-44-counter-offer",
    title: "WB-44 Counter-Offer",
    body: "Chapter 12 opens the form list with WB-44 Counter-Offer. Treat it as Wisconsin-scoped approved-form material — do not invent drafting rules beyond the sourced heading.",
    citationSlugs: ["wb-44-counter-offer", "other-forms-chapter-overview"],
  },
  {
    slug: "ch12-wb40-vs-wb41-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "wb-40-amendment-to-offer", b: "wb-41-notice-relating-to-offer" },
    title: "Say WB-40 vs WB-41",
    body: "Explain why Chapter 12 keeps WB-40 Amendment to Offer to Purchase and WB-41 Notice Relating to Offer to Purchase as two headings. One sentence each. Do not invent form-line language.",
    citationSlugs: ["wb-40-amendment-to-offer", "wb-41-notice-relating-to-offer"],
  },
  {
    slug: "ch12-option-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "wb-24-option-to-purchase",
    title: "Option to purchase in plain language",
    body: "When an item is about a right to buy later rather than a present sale of personal property, point to Chapter 12’s WB-24 Option to Purchase heading — not WB-25 Bill of Sale.",
    citationSlugs: ["wb-24-option-to-purchase"],
  },
  {
    slug: "ch12-wb44-wb46-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "wb-44-counter-offer", b: "wb-46-multiple-counter-proposal" },
    title: "Recall: WB-44 or WB-46?",
    body: "An item contrasts a single counter with a multiple counter-proposal path. Name the two Chapter 12 headings you must keep distinct.",
    citationSlugs: ["wb-44-counter-offer", "wb-46-multiple-counter-proposal"],
  },
  {
    slug: "ch12-wb42-wb40-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "wb-42-amendment-to-listing", b: "wb-40-amendment-to-offer" },
    title: "Recall: listing amendment or offer amendment?",
    body: "An item asks which approved form amends a listing versus an offer. Name the two Chapter 12 headings.",
    citationSlugs: ["wb-42-amendment-to-listing", "wb-40-amendment-to-offer"],
  },
  {
    slug: "ch12-wb24-wb25-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "wb-24-option-to-purchase", b: "wb-25-bill-of-sale" },
    title: "Recall: option or bill of sale?",
    body: "An item contrasts a real-estate option with transferring personal property. Which Chapter 12 headings fit?",
    citationSlugs: ["wb-24-option-to-purchase", "wb-25-bill-of-sale"],
  },
];

export const PHASE4_CH12_SESSION_STEPS: readonly {
  assetSlug: string;
  kind: "learn" | "repair" | "teachback" | "recall";
  reasonCodes: readonly string[];
}[] = [
  { assetSlug: "ch12-other-forms-overview-explanation", kind: "learn", reasonCodes: ["exam_weight_forms", "chapter_12"] },
  { assetSlug: "ch12-wb44-vs-wb46-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch12-wb40-vs-wb41-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch12-wb42-vs-wb40-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch12-wb45-vs-wb41-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch12-wb24-vs-wb25-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch12-wb44-counter-explanation", kind: "learn", reasonCodes: ["exam_weight_forms", "wisconsin_heading"] },
  { assetSlug: "ch12-wb40-vs-wb41-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "ch12-option-simple", kind: "learn", reasonCodes: ["exam_weight_forms", "modality_simple"] },
  { assetSlug: "ch12-wb44-wb46-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch12-wb42-wb40-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch12-wb24-wb25-recall", kind: "recall", reasonCodes: ["retrieval"] },
];
