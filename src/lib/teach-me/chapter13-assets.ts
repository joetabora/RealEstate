import type { AssetSeed } from "./assets";

/**
 * Hand-authored Chapter 13 (Contract Law) teaching units.
 * Original language plus PUB725 heading citations. No invented statute or form-line text.
 */
export const PHASE4_CH13_ASSETS: readonly AssetSeed[] = [
  {
    slug: "ch13-contract-law-overview-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "contract-law-chapter-overview",
    title: "Contract law overview",
    body: "Chapter 13 opens with Chapter Overview, then Rules of Contract Construction, REEB 15, approved forms and legal advice, validity, conveyance, status, drafting tools, and creation/termination. Stay on those sourced headings — do not invent elements of a contract or statute numbers beyond what the headings name.",
    citationSlugs: ["contract-law-chapter-overview"],
  },
  {
    slug: "ch13-validity-vs-status-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "validity-of-contracts", b: "status-of-contracts" },
    title: "Validity vs status of contracts",
    body: "Chapter 13 keeps Validity of Contracts and Status of Contracts as separate headings. Repair by naming which heading the item is testing — whether a contract can bind versus where it sits in its life cycle.",
    citationSlugs: ["validity-of-contracts", "status-of-contracts"],
  },
  {
    slug: "ch13-creation-termination-vs-status-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "creation-and-termination-of-contracts", b: "status-of-contracts" },
    title: "Creation/termination vs status",
    body: "Chapter 13 separates Creation and Termination of Contracts from Status of Contracts. Repair by asking which heading fits — how a contract starts or ends versus how status is labeled.",
    citationSlugs: ["creation-and-termination-of-contracts", "status-of-contracts"],
  },
  {
    slug: "ch13-approved-forms-vs-drafting-tools-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "approved-forms-and-legal-advice", b: "wra-contract-drafting-tools" },
    title: "Approved forms vs drafting tools",
    body: "Chapter 13 lists Approved Forms and Legal Advice separately from WRA Contract Drafting Tools for Licensees. Keep the practice rule heading distinct from the drafting-tools heading.",
    citationSlugs: ["approved-forms-and-legal-advice", "wra-contract-drafting-tools"],
  },
  {
    slug: "ch13-conveyance-vs-validity-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "conveyance-of-real-property", b: "validity-of-contracts" },
    title: "Conveyance vs validity",
    body: "Chapter 13 keeps Conveyance of Real Property distinct from Validity of Contracts. Repair by naming which heading the transfer question fits.",
    citationSlugs: ["conveyance-of-real-property", "validity-of-contracts"],
  },
  {
    slug: "ch13-reeb15-vs-approved-forms-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "reeb-15-copies-and-records", b: "approved-forms-and-legal-advice" },
    title: "REEB 15 vs approved forms and legal advice",
    body: "Chapter 13 has separate headings for REEB 15 Obligation to Furnish Copies and Maintain Records and Approved Forms and Legal Advice. Do not invent REEB rule text beyond the sourced heading names.",
    citationSlugs: ["reeb-15-copies-and-records", "approved-forms-and-legal-advice"],
  },
  {
    slug: "ch13-rules-construction-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "rules-of-contract-construction",
    title: "Rules of contract construction",
    body: "Chapter 13’s PDF splits Rules of Contract Construction across consecutive headings on the same page. Treat them as one topic — do not invent construction canons beyond the sourced headings.",
    citationSlugs: ["rules-of-contract-construction", "contract-law-chapter-overview"],
  },
  {
    slug: "ch13-validity-vs-status-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "validity-of-contracts", b: "status-of-contracts" },
    title: "Say validity vs status",
    body: "Explain why Chapter 13 keeps Validity of Contracts and Status of Contracts as two headings. One sentence each. Do not invent legal tests beyond the sourced headings.",
    citationSlugs: ["validity-of-contracts", "status-of-contracts"],
  },
  {
    slug: "ch13-reeb15-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "reeb-15-copies-and-records",
    title: "REEB 15 in plain language",
    body: "When an item is about furnishing copies or keeping records under a Wisconsin real estate board rule heading, point to Chapter 13’s REEB 15 heading — not the Approved Forms and Legal Advice heading.",
    citationSlugs: ["reeb-15-copies-and-records"],
  },
  {
    slug: "ch13-validity-status-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "validity-of-contracts", b: "status-of-contracts" },
    title: "Recall: validity or status?",
    body: "An item contrasts whether a contract can bind with where it sits in its life cycle. Name the two Chapter 13 headings you must keep distinct.",
    citationSlugs: ["validity-of-contracts", "status-of-contracts"],
  },
  {
    slug: "ch13-forms-drafting-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "approved-forms-and-legal-advice", b: "wra-contract-drafting-tools" },
    title: "Recall: approved forms or drafting tools?",
    body: "An item contrasts using approved forms / legal advice limits with WRA drafting tools. Name the two Chapter 13 headings.",
    citationSlugs: ["approved-forms-and-legal-advice", "wra-contract-drafting-tools"],
  },
  {
    slug: "ch13-creation-status-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "creation-and-termination-of-contracts", b: "status-of-contracts" },
    title: "Recall: creation/termination or status?",
    body: "An item asks how a contract starts or ends versus how status is labeled. Which Chapter 13 headings fit?",
    citationSlugs: ["creation-and-termination-of-contracts", "status-of-contracts"],
  },
];

export const PHASE4_CH13_SESSION_STEPS: readonly {
  assetSlug: string;
  kind: "learn" | "repair" | "teachback" | "recall";
  reasonCodes: readonly string[];
}[] = [
  { assetSlug: "ch13-contract-law-overview-explanation", kind: "learn", reasonCodes: ["exam_weight_forms", "chapter_13"] },
  { assetSlug: "ch13-validity-vs-status-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch13-creation-termination-vs-status-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch13-approved-forms-vs-drafting-tools-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch13-conveyance-vs-validity-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch13-reeb15-vs-approved-forms-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch13-rules-construction-explanation", kind: "learn", reasonCodes: ["exam_weight_forms", "chapter_13"] },
  { assetSlug: "ch13-validity-vs-status-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "ch13-reeb15-simple", kind: "learn", reasonCodes: ["exam_weight_forms", "wisconsin_heading", "modality_simple"] },
  { assetSlug: "ch13-validity-status-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch13-forms-drafting-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch13-creation-status-recall", kind: "recall", reasonCodes: ["retrieval"] },
];
