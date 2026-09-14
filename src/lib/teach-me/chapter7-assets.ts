import type { AssetSeed } from "./assets";

/**
 * Hand-authored Chapter 7 (Real Property Ownership) teaching units.
 * Original language plus heading citations. No invented statutes, fees, or rule lists.
 */
export const PHASE4_CH7_ASSETS: readonly AssetSeed[] = [
  {
    slug: "ch7-ownership-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "real-property-ownership",
    title: "Real property ownership",
    body: "Chapter 7 opens with Real Property Ownership after Chapter Overview. Treat ownership rights as the sourced heading — do not invent a bundle-of-rights checklist beyond what that heading covers.",
    citationSlugs: ["real-property-ownership", "ownership-chapter-overview"],
  },
  {
    slug: "ch7-real-vs-personal-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "real-versus-personal-property",
    title: "Real versus personal property",
    body: "Chapter 7 notes have a Real Versus Personal Property heading before Fixtures, Trade Fixtures, and Mobile Homes. Keep classification on that parent heading first; do not invent Wisconsin bill-of-sale rules beyond the sourced headings.",
    citationSlugs: ["real-versus-personal-property"],
  },
  {
    slug: "ch7-fixtures-vs-trade-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "property-fixtures", b: "trade-fixtures" },
    title: "Fixtures vs trade fixtures",
    body: "Chapter 7 lists Fixtures and Trade Fixtures as separate headings. Repair by asking which heading the item fits — ordinary fixtures versus trade fixtures for business tenants. Do not invent test-factor lists from memory.",
    citationSlugs: ["property-fixtures", "trade-fixtures"],
  },
  {
    slug: "ch7-fixtures-vs-trade-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "property-fixtures", b: "trade-fixtures" },
    title: "Say fixtures vs trade fixtures",
    body: "Explain why Chapter 7 keeps Fixtures and Trade Fixtures as two headings. One sentence each. Do not invent Wisconsin statute numbers.",
    citationSlugs: ["property-fixtures", "trade-fixtures"],
  },
  {
    slug: "ch7-freehold-vs-leasehold-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "freehold-estates", b: "leasehold-estates" },
    title: "Freehold vs leasehold estates",
    body: "Chapter 7 separates Freehold Estates from Leasehold Estates under Estates in Land. Repair by naming which heading the interest fits — freehold versus leasehold — before answering.",
    citationSlugs: ["freehold-estates", "leasehold-estates", "estates-in-land"],
  },
  {
    slug: "ch7-estates-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "estates-in-land",
    title: "Estates in land in plain language",
    body: "When an item says estate in land, point to Chapter 7’s Estates in Land heading, then check whether Freehold Estates or Leasehold Estates is the better child heading. Do not invent duration rules beyond those headings.",
    citationSlugs: ["estates-in-land", "freehold-estates", "leasehold-estates"],
  },
  {
    slug: "ch7-condo-vs-coop-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "condominium-ownership", b: "cooperative-ownership" },
    title: "Condo vs cooperative ownership",
    body: "Chapter 7 has separate Condominium Ownership and Cooperative Ownership headings. They are different ownership forms — do not treat them as interchangeable labels. Read both sourced headings.",
    citationSlugs: ["condominium-ownership", "cooperative-ownership"],
  },
  {
    slug: "ch7-condo-vs-timeshare-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "condominium-ownership", b: "time-share-ownership" },
    title: "Condo vs time-share ownership",
    body: "Chapter 7 separates Condominium Ownership from Time-Share Ownership. Repair by asking which heading the item is testing before answering.",
    citationSlugs: ["condominium-ownership", "time-share-ownership"],
  },
  {
    slug: "ch7-wi-marital-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "wisconsin-marital-property",
    title: "Wisconsin marital property",
    body: "Chapter 7 notes have a dedicated Wisconsin Marital Property heading. Treat it as Wisconsin-scoped — do not invent marital-property class lists or statute numbers beyond the sourced heading.",
    citationSlugs: ["wisconsin-marital-property"],
  },
  {
    slug: "ch7-marital-vs-control-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "wisconsin-marital-property", b: "management-and-control" },
    title: "Marital property vs management and control",
    body: "Chapter 7 separates Wisconsin Marital Property from Management and Control. Repair by naming which heading the item fits — classification of marital property versus management and control.",
    citationSlugs: ["wisconsin-marital-property", "management-and-control"],
  },
  {
    slug: "ch7-freehold-leasehold-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "freehold-estates", b: "leasehold-estates" },
    title: "Recall: freehold or leasehold?",
    body: "An item describes a tenancy with a reversion to the landlord. Name the two Chapter 7 estate headings you must keep distinct — Freehold Estates and Leasehold Estates — before answering.",
    citationSlugs: ["freehold-estates", "leasehold-estates"],
  },
  {
    slug: "ch7-condo-coop-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "condominium-ownership", b: "cooperative-ownership" },
    title: "Recall: condo or cooperative?",
    body: "An item contrasts owning a unit with owning stock in a housing corporation. Which Chapter 7 heading fits better — Condominium Ownership or Cooperative Ownership — and what is the other heading for?",
    citationSlugs: ["condominium-ownership", "cooperative-ownership"],
  },
];

export const PHASE4_CH7_SESSION_STEPS: readonly {
  assetSlug: string;
  kind: "learn" | "repair" | "teachback" | "recall";
  reasonCodes: readonly string[];
}[] = [
  { assetSlug: "ch7-ownership-explanation", kind: "learn", reasonCodes: ["exam_weight_ownership", "chapter_7"] },
  { assetSlug: "ch7-real-vs-personal-explanation", kind: "learn", reasonCodes: ["exam_weight_ownership", "chapter_7"] },
  { assetSlug: "ch7-fixtures-vs-trade-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch7-fixtures-vs-trade-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "ch7-freehold-vs-leasehold-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch7-estates-simple", kind: "learn", reasonCodes: ["exam_weight_ownership", "modality_simple"] },
  { assetSlug: "ch7-condo-vs-coop-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch7-condo-vs-timeshare-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch7-wi-marital-explanation", kind: "learn", reasonCodes: ["exam_weight_ownership", "wisconsin_heading"] },
  { assetSlug: "ch7-marital-vs-control-comparison", kind: "repair", reasonCodes: ["confusion_pair", "wisconsin_heading"] },
  { assetSlug: "ch7-freehold-leasehold-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch7-condo-coop-recall", kind: "recall", reasonCodes: ["retrieval"] },
];
