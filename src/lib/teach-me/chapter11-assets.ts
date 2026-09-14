import type { AssetSeed } from "./assets";

/**
 * Hand-authored Chapter 11 (Financing) teaching units.
 * Original language plus heading citations. No invented rates, fees, or statute numbers.
 */
export const PHASE4_CH11_ASSETS: readonly AssetSeed[] = [
  {
    slug: "ch11-mortgage-law-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "mortgage-law",
    title: "Mortgage law",
    body: "Chapter 11 opens Mortgage Law after Chapter Overview, then moves into Foreclosure and Facts About Mortgages. Stay on those sourced headings — do not invent lien theory or rate rules.",
    citationSlugs: ["mortgage-law", "financing-chapter-overview"],
  },
  {
    slug: "ch11-foreclosure-vs-deed-in-lieu-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "foreclosure", b: "deed-in-lieu-of-foreclosure" },
    title: "Foreclosure vs deed in lieu",
    body: "Chapter 11 notes separate Foreclosure from Deed in Lieu of Foreclosure. Repair by naming which heading the path fits. Do not invent Wisconsin timeline details beyond the Stages of Foreclosure in Wisconsin heading when that heading applies.",
    citationSlugs: ["foreclosure", "deed-in-lieu-of-foreclosure"],
  },
  {
    slug: "ch11-conventional-vs-nonconforming-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "conventional-financing", b: "nonconforming-loans" },
    title: "Conventional vs nonconforming",
    body: "Chapter 11 lists Conventional Financing and Nonconforming Loans as separate headings under sources of financing. Repair by asking which heading the loan type fits.",
    citationSlugs: ["conventional-financing", "nonconforming-loans"],
  },
  {
    slug: "ch11-conventional-vs-government-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "conventional-financing", b: "government-financing" },
    title: "Conventional vs government financing",
    body: "Chapter 11 separates Conventional Financing from Government Financing. Government financing later splits FHA, VA, and USDA headings in the notes — do not invent program rules beyond those headings.",
    citationSlugs: ["conventional-financing", "government-financing"],
  },
  {
    slug: "ch11-seller-vs-conventional-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "seller-financing", b: "conventional-financing" },
    title: "Seller financing vs conventional",
    body: "Chapter 11 keeps Seller Financing and Conventional Financing as separate headings. Repair by naming which source-of-financing heading the item is testing.",
    citationSlugs: ["seller-financing", "conventional-financing", "sources-of-financing"],
  },
  {
    slug: "ch11-tila-vs-respa-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "tila-regulation-z", b: "respa" },
    title: "TILA/Reg Z vs RESPA",
    body: "Chapter 11 has separate Truth in Lending / Regulation Z and RESPA headings under Financing Legislation. They are related disclosure statutes, not interchangeable labels.",
    citationSlugs: ["tila-regulation-z", "respa", "financing-legislation"],
  },
  {
    slug: "ch11-respa-vs-trid-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "respa", b: "trid" },
    title: "RESPA vs TRID",
    body: "Chapter 11 separates RESPA from TILA/RESPA Integrated Disclosure (TRID). Repair by naming which heading the disclosure item fits.",
    citationSlugs: ["respa", "trid"],
  },
  {
    slug: "ch11-wi-foreclosure-stages-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "stages-of-foreclosure-wisconsin",
    title: "Stages of foreclosure in Wisconsin",
    body: "Chapter 11 notes have a dedicated Stages of Foreclosure in Wisconsin heading under Foreclosure. Treat it as Wisconsin-scoped — do not invent a stage list beyond the sourced heading.",
    citationSlugs: ["stages-of-foreclosure-wisconsin", "foreclosure"],
  },
  {
    slug: "ch11-conventional-vs-government-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "conventional-financing", b: "government-financing" },
    title: "Say conventional vs government financing",
    body: "Explain why Chapter 11 keeps Conventional Financing and Government Financing as two headings. One sentence each. Do not invent loan program rules.",
    citationSlugs: ["conventional-financing", "government-financing"],
  },
  {
    slug: "ch11-primary-secondary-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "primary-and-secondary-markets",
    title: "Primary and secondary markets in plain language",
    body: "When an item contrasts originating a loan with selling it into the secondary market, point to Chapter 11’s Primary and Secondary Markets heading. Do not invent investor names beyond the sourced heading.",
    citationSlugs: ["primary-and-secondary-markets"],
  },
  {
    slug: "ch11-conventional-nonconforming-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "conventional-financing", b: "nonconforming-loans" },
    title: "Recall: conventional or nonconforming?",
    body: "An item contrasts a loan that meets secondary-market standards with one that does not. Name the two Chapter 11 headings you must keep distinct.",
    citationSlugs: ["conventional-financing", "nonconforming-loans"],
  },
  {
    slug: "ch11-respa-trid-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "respa", b: "trid" },
    title: "Recall: RESPA or TRID?",
    body: "An item mentions integrated disclosure forms for a closed-end consumer mortgage. Which Chapter 11 headings fit — RESPA or TRID — and what is the sibling heading for?",
    citationSlugs: ["respa", "trid"],
  },
];

export const PHASE4_CH11_SESSION_STEPS: readonly {
  assetSlug: string;
  kind: "learn" | "repair" | "teachback" | "recall";
  reasonCodes: readonly string[];
}[] = [
  { assetSlug: "ch11-mortgage-law-explanation", kind: "learn", reasonCodes: ["exam_weight_financing", "chapter_11"] },
  { assetSlug: "ch11-foreclosure-vs-deed-in-lieu-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch11-conventional-vs-nonconforming-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch11-conventional-vs-government-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch11-seller-vs-conventional-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch11-tila-vs-respa-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch11-respa-vs-trid-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch11-wi-foreclosure-stages-explanation", kind: "learn", reasonCodes: ["exam_weight_financing", "wisconsin_heading"] },
  { assetSlug: "ch11-conventional-vs-government-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "ch11-primary-secondary-simple", kind: "learn", reasonCodes: ["exam_weight_financing", "modality_simple"] },
  { assetSlug: "ch11-conventional-nonconforming-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch11-respa-trid-recall", kind: "recall", reasonCodes: ["retrieval"] },
];
