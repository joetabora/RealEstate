import type { AssetSeed } from "./assets";

/**
 * Hand-authored Chapter 8 (Title of Real Estate) teaching units.
 * Original language plus heading citations. No invented fees, statutes, or exception lists.
 */
export const PHASE4_CH8_ASSETS: readonly AssetSeed[] = [
  {
    slug: "ch8-transfer-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "transfer-of-title",
    title: "Transfer of title",
    body: "Chapter 8 opens Transfer of Title after Chapter Overview. Stay on that sourced heading for conveyance and title ideas — do not invent recording rules beyond the heading.",
    citationSlugs: ["transfer-of-title", "title-chapter-overview"],
  },
  {
    slug: "ch8-warranty-vs-quitclaim-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "warranty-deed", b: "quitclaim-deed" },
    title: "Warranty deed vs quitclaim deed",
    body: "Chapter 8 lists Warranty Deed and Quitclaim Deed as separate headings under Deeds. Repair by naming which deed heading the item is testing. Do not invent warranty language from memory.",
    citationSlugs: ["warranty-deed", "quitclaim-deed", "deeds"],
  },
  {
    slug: "ch8-warranty-vs-quitclaim-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "warranty-deed", b: "quitclaim-deed" },
    title: "Say warranty vs quitclaim",
    body: "Explain why Chapter 8 keeps Warranty Deed and Quitclaim Deed as two headings. One sentence each. Do not invent Wisconsin statute numbers.",
    citationSlugs: ["warranty-deed", "quitclaim-deed"],
  },
  {
    slug: "ch8-pr-vs-trustee-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "personal-representative-deed", b: "trustee-deed" },
    title: "Personal representative vs trustee deed",
    body: "Chapter 8 separates Personal Representative’s Deed from Trustee’s Deed. Repair by asking which role is conveying — estate personal representative or trustee.",
    citationSlugs: ["personal-representative-deed", "trustee-deed"],
  },
  {
    slug: "ch8-wi-transfer-fee-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "wisconsin-transfer-fee",
    title: "Wisconsin transfer fee",
    body: "Chapter 8 notes have a dedicated Wisconsin Transfer Fee heading. Treat it as Wisconsin-scoped — do not invent the fee amount or who pays beyond the sourced heading.",
    citationSlugs: ["wisconsin-transfer-fee"],
  },
  {
    slug: "ch8-easements-vs-encroachments-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "easements", b: "encroachments" },
    title: "Easements vs encroachments",
    body: "Chapter 8 keeps Easements and Encroachments as separate headings under encumbrances to title. Repair by naming which heading the fact pattern fits.",
    citationSlugs: ["easements", "encroachments", "encumbrances-to-title"],
  },
  {
    slug: "ch8-easements-vs-liens-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "easements", b: "liens" },
    title: "Easements vs liens",
    body: "Chapter 8 separates Easements from Liens. Both can affect title, but they are not interchangeable headings. Read both sourced headings before answering.",
    citationSlugs: ["easements", "liens"],
  },
  {
    slug: "ch8-evidence-vs-forms-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "evidence-of-title", b: "forms-of-title-evidence" },
    title: "Evidence of title vs forms of title evidence",
    body: "Chapter 8 has separate Evidence of Title and Forms of Title Evidence headings. Repair by asking whether the item is about needing evidence of title or about the forms of that evidence.",
    citationSlugs: ["evidence-of-title", "forms-of-title-evidence"],
  },
  {
    slug: "ch8-forms-vs-exceptions-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "forms-of-title-evidence", b: "standard-title-insurance-exceptions" },
    title: "Title evidence forms vs standard exceptions",
    body: "Chapter 8 separates Forms of Title Evidence from Standard Title Insurance Exceptions. Do not invent an exception list — stay on the sourced headings.",
    citationSlugs: ["forms-of-title-evidence", "standard-title-insurance-exceptions"],
  },
  {
    slug: "ch8-title-evidence-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "evidence-of-title",
    title: "Evidence of title in plain language",
    body: "A deed alone is not treated as enough proof of title condition in Chapter 8’s Evidence of Title heading. Point to that heading, then to Forms of Title Evidence for how proof is shown.",
    citationSlugs: ["evidence-of-title", "forms-of-title-evidence"],
  },
  {
    slug: "ch8-warranty-quitclaim-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "warranty-deed", b: "quitclaim-deed" },
    title: "Recall: warranty or quitclaim?",
    body: "An item contrasts the most comprehensive deed guarantee with a deed that transfers without warranties. Name the two Chapter 8 deed headings you must keep distinct.",
    citationSlugs: ["warranty-deed", "quitclaim-deed"],
  },
  {
    slug: "ch8-easement-encroachment-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "easements", b: "encroachments" },
    title: "Recall: easement or encroachment?",
    body: "An item describes a driveway right across a neighbor’s land versus a garage that crosses the lot line. Which Chapter 8 headings fit — Easements or Encroachments — and what is the sibling heading for?",
    citationSlugs: ["easements", "encroachments"],
  },
];

export const PHASE4_CH8_SESSION_STEPS: readonly {
  assetSlug: string;
  kind: "learn" | "repair" | "teachback" | "recall";
  reasonCodes: readonly string[];
}[] = [
  { assetSlug: "ch8-transfer-explanation", kind: "learn", reasonCodes: ["exam_weight_ownership", "chapter_8"] },
  { assetSlug: "ch8-warranty-vs-quitclaim-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch8-warranty-vs-quitclaim-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "ch8-pr-vs-trustee-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch8-wi-transfer-fee-explanation", kind: "learn", reasonCodes: ["exam_weight_ownership", "wisconsin_heading"] },
  { assetSlug: "ch8-easements-vs-encroachments-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch8-easements-vs-liens-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch8-evidence-vs-forms-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch8-forms-vs-exceptions-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch8-title-evidence-simple", kind: "learn", reasonCodes: ["exam_weight_ownership", "modality_simple"] },
  { assetSlug: "ch8-warranty-quitclaim-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch8-easement-encroachment-recall", kind: "recall", reasonCodes: ["retrieval"] },
];
