import type { AssetSeed } from "./assets";

/**
 * Hand-authored Chapter 10 (Offers to Purchase) teaching units.
 * Original language plus heading citations. No invented form-line text, fees, or deadlines.
 */
export const PHASE4_CH10_ASSETS: readonly AssetSeed[] = [
  {
    slug: "ch10-acceptance-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "acceptance-and-binding-acceptance",
    title: "Acceptance and binding acceptance",
    body: "Chapter 10 has an Acceptance and Binding Acceptance heading after Preparing Contracts. Treat acceptance and binding acceptance as the distinction named by that heading — do not invent timing rules beyond the sourced heading.",
    citationSlugs: ["acceptance-and-binding-acceptance", "preparing-contracts"],
  },
  {
    slug: "ch10-wb11-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "wb-11-residential-offer",
    title: "WB-11 Residential Offer to Purchase",
    body: "Chapter 10’s main approved form heading is WB-11 Residential Offer to Purchase. Later headings split WB-14 condominium and WB-13 vacant land offers. Stay on the sourced form headings — do not invent line text.",
    citationSlugs: ["wb-11-residential-offer"],
  },
  {
    slug: "ch10-wb11-vs-wb14-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "wb-11-residential-offer", b: "wb-14-condominium-offer" },
    title: "WB-11 vs WB-14",
    body: "Chapter 10 has separate WB-11 Residential and WB-14 Condominium offer headings. Repair by naming which approved-form heading the property type requires.",
    citationSlugs: ["wb-11-residential-offer", "wb-14-condominium-offer"],
  },
  {
    slug: "ch10-wb11-vs-wb13-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "wb-11-residential-offer", b: "wb-13-vacant-land-offer" },
    title: "WB-11 vs WB-13",
    body: "Chapter 10 separates WB-11 Residential from WB-13 Vacant Land Offer to Purchase. Do not treat them as interchangeable forms.",
    citationSlugs: ["wb-11-residential-offer", "wb-13-vacant-land-offer"],
  },
  {
    slug: "ch10-financing-vs-not-contingent-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "financing-commitment-contingency", b: "offer-not-contingent-on-financing" },
    title: "Financing contingency vs not contingent",
    body: "Chapter 10 notes list Financing Commitment Contingency and Offer Not Contingent on Financing as separate WB-11 headings. Repair by asking which heading the offer actually uses.",
    citationSlugs: ["financing-commitment-contingency", "offer-not-contingent-on-financing"],
  },
  {
    slug: "ch10-bump-vs-secondary-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "bump-clause", b: "secondary-offer" },
    title: "Bump clause vs secondary offer",
    body: "Chapter 10 notes keep Bump Clause and Secondary Offer as separate headings. Repair by naming which WB-11 heading the fact pattern fits.",
    citationSlugs: ["bump-clause", "secondary-offer"],
  },
  {
    slug: "ch10-inspection-vs-appraisal-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "inspection-contingency", b: "appraisal-contingency" },
    title: "Inspection vs appraisal contingency",
    body: "Chapter 10 notes separate Inspection Contingency from Appraisal Contingency. They are related contingencies, not interchangeable labels.",
    citationSlugs: ["inspection-contingency", "appraisal-contingency"],
  },
  {
    slug: "ch10-drafting-vs-presentation-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "drafting-and-submission-of-offers", b: "presentation-of-offers" },
    title: "Drafting/submission vs presentation",
    body: "Chapter 10 separates Drafting and Submission of Offers from Presentation of Offers. Repair by asking whether the item is about preparing/submitting or about presenting offers.",
    citationSlugs: ["drafting-and-submission-of-offers", "presentation-of-offers"],
  },
  {
    slug: "ch10-wb11-vs-wb14-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "wb-11-residential-offer", b: "wb-14-condominium-offer" },
    title: "Say WB-11 vs WB-14",
    body: "Explain why Chapter 10 keeps WB-11 Residential and WB-14 Condominium offers as two headings. One sentence each. Do not invent form-line wording.",
    citationSlugs: ["wb-11-residential-offer", "wb-14-condominium-offer"],
  },
  {
    slug: "ch10-equitable-title-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "equitable-title",
    title: "Equitable title in plain language",
    body: "When an item says equitable title in an offer context, point to Chapter 10’s Equitable Title heading — after Acceptance and Binding Acceptance. Do not invent when equitable title arises beyond that heading.",
    citationSlugs: ["equitable-title", "acceptance-and-binding-acceptance"],
  },
  {
    slug: "ch10-financing-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "financing-commitment-contingency", b: "offer-not-contingent-on-financing" },
    title: "Recall: financing contingency or not?",
    body: "An item asks whether the buyer’s offer depends on getting a loan commitment. Name the two Chapter 10 WB-11 headings you must keep distinct before answering.",
    citationSlugs: ["financing-commitment-contingency", "offer-not-contingent-on-financing"],
  },
  {
    slug: "ch10-bump-secondary-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "bump-clause", b: "secondary-offer" },
    title: "Recall: bump clause or secondary offer?",
    body: "A seller already has an accepted offer and receives another. Which Chapter 10 headings fit — Bump Clause or Secondary Offer — and what is the other heading for?",
    citationSlugs: ["bump-clause", "secondary-offer"],
  },
];

export const PHASE4_CH10_SESSION_STEPS: readonly {
  assetSlug: string;
  kind: "learn" | "repair" | "teachback" | "recall";
  reasonCodes: readonly string[];
}[] = [
  { assetSlug: "ch10-acceptance-explanation", kind: "learn", reasonCodes: ["exam_weight_forms", "chapter_10"] },
  { assetSlug: "ch10-wb11-explanation", kind: "learn", reasonCodes: ["exam_weight_forms", "wisconsin_form"] },
  { assetSlug: "ch10-wb11-vs-wb14-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch10-wb11-vs-wb13-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch10-financing-vs-not-contingent-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch10-bump-vs-secondary-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch10-inspection-vs-appraisal-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch10-drafting-vs-presentation-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch10-wb11-vs-wb14-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "ch10-equitable-title-simple", kind: "learn", reasonCodes: ["exam_weight_forms", "modality_simple"] },
  { assetSlug: "ch10-financing-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch10-bump-secondary-recall", kind: "recall", reasonCodes: ["retrieval"] },
];
