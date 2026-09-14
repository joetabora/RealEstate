import type { AssetSeed } from "./assets";

/**
 * Hand-authored Chapter 5 (Fair Housing) teaching units.
 * Original language plus heading citations. No invented protected-class lists or statutes.
 */
export const PHASE4_CH5_ASSETS: readonly AssetSeed[] = [
  {
    slug: "ch5-fair-housing-explanation",
    kind: "explanation",
    informationClass: "general_explanation",
    conceptSlug: "fair-housing-law",
    title: "Fair housing law",
    body: "Chapter 5 opens with Fair Housing Law. Notes then split Wisconsin’s protected classes, prohibited conduct, and permissible conduct under that parent idea. Do not invent a class list from memory here — use the sourced headings.",
    citationSlugs: ["fair-housing-law"],
  },
  {
    slug: "ch5-wi-classes-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "wisconsin-protected-classes",
    title: "Wisconsin’s 13 protected classes",
    body: "Chapter 5 notes have a dedicated heading for Wisconsin’s 13 Protected Classes under Fair Housing Law. Treat that as its own Wisconsin-scoped heading, not as a paraphrase of federal classes invented here.",
    citationSlugs: ["wisconsin-protected-classes", "fair-housing-law"],
  },
  {
    slug: "ch5-prohibited-permissible-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "prohibited-under-fair-housing", b: "permissible-under-fair-housing" },
    title: "Prohibited vs permissible under fair housing",
    body: "Chapter 5 notes list Prohibited Under Fair Housing Law and Permissible Under Fair Housing Law as separate headings. Repair by asking which heading the conduct fits — do not invent examples beyond those headings.",
    citationSlugs: ["prohibited-under-fair-housing", "permissible-under-fair-housing"],
  },
  {
    slug: "ch5-prohibited-permissible-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "prohibited-under-fair-housing", b: "permissible-under-fair-housing" },
    title: "Say prohibited vs permissible",
    body: "Explain why Chapter 5 keeps prohibited and permissible fair housing conduct as two headings. One sentence each. Do not invent Wisconsin statute numbers.",
    citationSlugs: ["prohibited-under-fair-housing", "permissible-under-fair-housing"],
  },
  {
    slug: "ch5-advertising-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "fair-housing-advertising", b: "demographic-data-protected-classes" },
    title: "Advertising vs demographic data",
    body: "Chapter 5 notes separate Advertising from Use of Demographic Data Relating to Protected Classes. Repair by naming which heading the item is testing — marketing language versus demographic data use.",
    citationSlugs: ["fair-housing-advertising", "demographic-data-protected-classes"],
  },
  {
    slug: "ch5-ada-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "fair-housing-law", b: "americans-with-disabilities-act" },
    title: "Fair housing law vs ADA",
    body: "Chapter 5 has separate headings for Fair Housing Law and The Americans with Disabilities Act (ADA). They are related disability/access topics, not interchangeable labels. Read both sourced headings.",
    citationSlugs: ["fair-housing-law", "americans-with-disabilities-act"],
  },
  {
    slug: "ch5-ada-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "americans-with-disabilities-act",
    title: "ADA in plain language",
    body: "When an item says ADA, point to Chapter 5’s Americans with Disabilities Act heading — not only to the Fair Housing Law parent heading. Do not invent accommodation examples beyond the sourced heading.",
    citationSlugs: ["americans-with-disabilities-act"],
  },
  {
    slug: "ch5-complaints-procedures-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "handling-fair-housing-complaints", b: "fair-housing-office-procedures" },
    title: "Complaints vs office procedures",
    body: "Chapter 5 separates Handling Complaints from Establishing Office Procedures Regarding Fair Housing. Repair by asking whether the item is about a complaint path or about office procedures.",
    citationSlugs: ["handling-fair-housing-complaints", "fair-housing-office-procedures"],
  },
  {
    slug: "ch5-wi-classes-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "wisconsin-protected-classes", b: "fair-housing-law" },
    title: "Say the Wisconsin classes heading",
    body: "Explain that Wisconsin’s 13 Protected Classes is its own Chapter 5 notes heading under Fair Housing Law. Do not recite an invented list — name the heading and why it is Wisconsin-scoped.",
    citationSlugs: ["wisconsin-protected-classes", "fair-housing-law"],
  },
  {
    slug: "ch5-prohibited-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "prohibited-under-fair-housing", b: "permissible-under-fair-housing" },
    title: "Recall: prohibited or permissible?",
    body: "An item asks whether a practice is allowed under fair housing. Name the two Chapter 5 notes headings you must keep distinct before answering.",
    citationSlugs: ["prohibited-under-fair-housing", "permissible-under-fair-housing"],
  },
  {
    slug: "ch5-ada-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "fair-housing-law", b: "americans-with-disabilities-act" },
    title: "Recall: fair housing or ADA?",
    body: "An item uses the phrase Americans with Disabilities Act. Is that the Fair Housing Law heading or the separate ADA heading in Chapter 5 — and what is the sibling heading?",
    citationSlugs: ["fair-housing-law", "americans-with-disabilities-act"],
  },
  {
    slug: "ch5-complaints-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "handling-fair-housing-complaints", b: "fair-housing-office-procedures" },
    title: "Recall: complaints or office procedures?",
    body: "A firm is writing fair housing policies for its office. Which Chapter 5 heading fits better — Handling Complaints or Establishing Office Procedures — and what is the other heading for?",
    citationSlugs: ["handling-fair-housing-complaints", "fair-housing-office-procedures"],
  },
];

export const PHASE4_CH5_SESSION_STEPS: readonly {
  assetSlug: string;
  kind: "learn" | "repair" | "teachback" | "recall";
  reasonCodes: readonly string[];
}[] = [
  { assetSlug: "ch5-fair-housing-explanation", kind: "learn", reasonCodes: ["exam_weight_fair_housing", "chapter_5"] },
  { assetSlug: "ch5-wi-classes-explanation", kind: "learn", reasonCodes: ["exam_weight_fair_housing", "wisconsin_heading"] },
  { assetSlug: "ch5-prohibited-permissible-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch5-prohibited-permissible-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "ch5-advertising-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch5-ada-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch5-ada-simple", kind: "learn", reasonCodes: ["exam_weight_fair_housing", "modality_simple"] },
  { assetSlug: "ch5-complaints-procedures-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch5-wi-classes-teachback", kind: "teachback", reasonCodes: ["confusion_pair", "wisconsin_heading"] },
  { assetSlug: "ch5-prohibited-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch5-ada-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch5-complaints-recall", kind: "recall", reasonCodes: ["retrieval"] },
];
