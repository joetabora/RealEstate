import type { AssetSeed } from "./assets";

/**
 * Hand-authored Chapter 9 (Land Use) teaching units.
 * Original language plus heading citations. No invented ordinances, fees, or statute lists.
 */
export const PHASE4_CH9_ASSETS: readonly AssetSeed[] = [
  {
    slug: "ch9-wi-zoning-basics-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "wisconsin-zoning-law-basics",
    title: "Wisconsin zoning law basics",
    body: "Chapter 9 opens with Wisconsin Zoning Law Basics after Chapter Overview. Treat it as Wisconsin-scoped police-power / local control context — do not invent extraterritorial mile limits beyond the sourced heading.",
    citationSlugs: ["wisconsin-zoning-law-basics", "land-use-chapter-overview"],
  },
  {
    slug: "ch9-permitted-vs-conditional-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "permitted-uses", b: "conditional-uses" },
    title: "Permitted uses vs conditional uses",
    body: "Chapter 9 lists Permitted Uses and Conditional Uses as separate headings under Zoning. Repair by asking whether the use is authorized for all owners in the district or needs a discretionary approval path.",
    citationSlugs: ["permitted-uses", "conditional-uses", "zoning"],
  },
  {
    slug: "ch9-permitted-vs-conditional-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "permitted-uses", b: "conditional-uses" },
    title: "Say permitted vs conditional",
    body: "Explain why Chapter 9 keeps Permitted Uses and Conditional Uses as two headings. One sentence each. Do not invent Wisconsin statute numbers.",
    citationSlugs: ["permitted-uses", "conditional-uses"],
  },
  {
    slug: "ch9-variance-vs-nonconforming-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "variances", b: "nonconforming-use" },
    title: "Variances vs nonconforming use",
    body: "Chapter 9 separates Variances from Nonconforming Use. Repair by naming which heading fits — a requested exception versus a use that already existed against later zoning.",
    citationSlugs: ["variances", "nonconforming-use"],
  },
  {
    slug: "ch9-spot-vs-downzoning-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "spot-zoning", b: "downzoning" },
    title: "Spot zoning vs downzoning",
    body: "Chapter 9 keeps Spot Zoning and Downzoning as separate headings. Do not treat them as interchangeable labels — read both sourced headings.",
    citationSlugs: ["spot-zoning", "downzoning"],
  },
  {
    slug: "ch9-shoreland-vs-wetlands-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "shoreland-zoning", b: "wetlands" },
    title: "Shoreland zoning vs wetlands",
    body: "Chapter 9 separates Shoreland Zoning from Wetlands under water-related land use. Repair by naming which heading the item is testing.",
    citationSlugs: ["shoreland-zoning", "wetlands", "water-rights"],
  },
  {
    slug: "ch9-deed-conditions-vs-restrictions-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "deed-conditions", b: "deed-restrictions" },
    title: "Deed conditions vs deed restrictions",
    body: "Chapter 9 notes list Deed Conditions and Deed Restrictions (Deed Covenants, Subdivision Restrictions) as separate headings under Private Land Use Controls. Repair by naming which private-control heading fits.",
    citationSlugs: ["deed-conditions", "deed-restrictions", "private-land-use-controls"],
  },
  {
    slug: "ch9-wi-basics-vs-zoning-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "wisconsin-zoning-law-basics", b: "zoning" },
    title: "WI zoning basics vs zoning",
    body: "Chapter 9 has separate Wisconsin Zoning Law Basics and Zoning headings. One is the Wisconsin-scoped basics heading; the other opens the zoning tool headings that follow.",
    citationSlugs: ["wisconsin-zoning-law-basics", "zoning"],
  },
  {
    slug: "ch9-zoning-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "zoning",
    title: "Zoning in plain language",
    body: "When an item says zoning, point to Chapter 9’s Zoning heading, then check whether Permitted Uses, Conditional Uses, Variances, or another child heading is a better fit. Do not invent ordinance text.",
    citationSlugs: ["zoning", "permitted-uses", "conditional-uses"],
  },
  {
    slug: "ch9-deed-controls-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "deed-conditions", b: "deed-restrictions" },
    title: "Say deed conditions vs restrictions",
    body: "Explain why Chapter 9 keeps Deed Conditions and Deed Restrictions as two headings under Private Land Use Controls. Do not invent covenant examples beyond those headings.",
    citationSlugs: ["deed-conditions", "deed-restrictions"],
  },
  {
    slug: "ch9-permitted-conditional-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "permitted-uses", b: "conditional-uses" },
    title: "Recall: permitted or conditional?",
    body: "An item contrasts a use allowed for everyone in a district with a use that needs discretionary board approval. Name the two Chapter 9 headings you must keep distinct.",
    citationSlugs: ["permitted-uses", "conditional-uses"],
  },
  {
    slug: "ch9-variance-nonconforming-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "variances", b: "nonconforming-use" },
    title: "Recall: variance or nonconforming use?",
    body: "An item describes a use that lawfully existed before a zoning change. Which Chapter 9 heading fits better — Variances or Nonconforming Use — and what is the other heading for?",
    citationSlugs: ["variances", "nonconforming-use"],
  },
];

export const PHASE4_CH9_SESSION_STEPS: readonly {
  assetSlug: string;
  kind: "learn" | "repair" | "teachback" | "recall";
  reasonCodes: readonly string[];
}[] = [
  { assetSlug: "ch9-wi-zoning-basics-explanation", kind: "learn", reasonCodes: ["exam_weight_land_use", "wisconsin_heading"] },
  { assetSlug: "ch9-permitted-vs-conditional-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch9-permitted-vs-conditional-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "ch9-variance-vs-nonconforming-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch9-spot-vs-downzoning-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch9-shoreland-vs-wetlands-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch9-deed-conditions-vs-restrictions-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch9-wi-basics-vs-zoning-comparison", kind: "repair", reasonCodes: ["confusion_pair", "wisconsin_heading"] },
  { assetSlug: "ch9-zoning-simple", kind: "learn", reasonCodes: ["exam_weight_land_use", "modality_simple"] },
  { assetSlug: "ch9-deed-controls-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "ch9-permitted-conditional-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch9-variance-nonconforming-recall", kind: "recall", reasonCodes: ["retrieval"] },
];
