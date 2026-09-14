import type { AssetSeed } from "./assets";

/**
 * Hand-authored Chapter 14 (Trust Accounts) teaching units.
 * Original language plus PUB725 heading citations. No invented deposit deadlines or interest rules.
 */
export const PHASE4_CH14_ASSETS: readonly AssetSeed[] = [
  {
    slug: "ch14-trust-overview-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "trust-accounts-chapter-overview",
    title: "Trust accounts overview",
    body: "Chapter 14 opens with Chapter Overview, then REEB 18 Trust Accounts, client vs non-client funds, IBRETA, and Depositing Funds. Stay on those sourced headings — do not invent deposit deadlines, interest rates, or REEB rule text beyond the heading names.",
    citationSlugs: ["trust-accounts-chapter-overview"],
  },
  {
    slug: "ch14-client-vs-nonclient-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "client-funds", b: "non-client-funds" },
    title: "Client funds vs non-client funds",
    body: "Chapter 14’s Real Estate Funds heading names client funds and non-client funds as distinct labels. Repair by asking which label the money fits under that sourced heading.",
    citationSlugs: ["client-funds", "non-client-funds"],
  },
  {
    slug: "ch14-reeb18-vs-ibreta-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "reeb-18-trust-accounts", b: "ibreta" },
    title: "REEB 18 vs IBRETA",
    body: "Chapter 14 keeps REEB 18 Trust Accounts separate from IBRETA. Repair by naming which heading the item is testing — the trust-account rule chapter versus the IBRETA heading.",
    citationSlugs: ["reeb-18-trust-accounts", "ibreta"],
  },
  {
    slug: "ch14-depositing-vs-ibreta-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "depositing-funds", b: "ibreta" },
    title: "Depositing funds vs IBRETA",
    body: "Chapter 14 separates Depositing Funds from IBRETA. When to deposit and what IBRETA is about are different sourced headings — do not invent timing rules beyond Depositing Funds.",
    citationSlugs: ["depositing-funds", "ibreta"],
  },
  {
    slug: "ch14-client-vs-depositing-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "client-funds", b: "depositing-funds" },
    title: "Client funds vs depositing funds",
    body: "Chapter 14 lists Real Estate Funds (client/non-client) separately from Depositing Funds. Classifying the money and depositing it are not the same heading.",
    citationSlugs: ["client-funds", "depositing-funds"],
  },
  {
    slug: "ch14-reeb18-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "reeb-18-trust-accounts",
    title: "REEB 18 trust accounts",
    body: "Chapter 14’s REEB 18 Trust Accounts heading is Wisconsin-scoped practice material. Treat it as a sourced heading name — do not invent rule subsections or penalties.",
    citationSlugs: ["reeb-18-trust-accounts", "trust-accounts-chapter-overview"],
  },
  {
    slug: "ch14-client-vs-nonclient-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "client-funds", b: "non-client-funds" },
    title: "Say client vs non-client funds",
    body: "Explain why Chapter 14 keeps client funds and non-client funds as two labels under Real Estate Funds. One sentence each. Do not invent deposit rules.",
    citationSlugs: ["client-funds", "non-client-funds"],
  },
  {
    slug: "ch14-ibreta-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "ibreta",
    title: "IBRETA in plain language",
    body: "When an item names IBRETA, point to Chapter 14’s IBRETA heading — not Depositing Funds or the broader REEB 18 Trust Accounts heading. Do not invent interest-rate details.",
    citationSlugs: ["ibreta"],
  },
  {
    slug: "ch14-client-nonclient-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "client-funds", b: "non-client-funds" },
    title: "Recall: client or non-client funds?",
    body: "An item contrasts money that belongs with clients versus money that does not. Name the two Chapter 14 labels under Real Estate Funds.",
    citationSlugs: ["client-funds", "non-client-funds"],
  },
  {
    slug: "ch14-reeb18-ibreta-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "reeb-18-trust-accounts", b: "ibreta" },
    title: "Recall: REEB 18 or IBRETA?",
    body: "An item contrasts the trust-account rule chapter with IBRETA. Name the two Chapter 14 headings.",
    citationSlugs: ["reeb-18-trust-accounts", "ibreta"],
  },
  {
    slug: "ch14-depositing-ibreta-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "depositing-funds", b: "ibreta" },
    title: "Recall: depositing or IBRETA?",
    body: "An item contrasts when/how funds are deposited with IBRETA. Which Chapter 14 headings fit?",
    citationSlugs: ["depositing-funds", "ibreta"],
  },
  {
    slug: "ch14-depositing-explanation",
    kind: "explanation",
    informationClass: "course_sourced",
    conceptSlug: "depositing-funds",
    title: "Depositing funds",
    body: "Chapter 14 ends the main sequence with Depositing Funds after client/non-client funds and IBRETA. Stay on that heading — do not invent calendar deadlines.",
    citationSlugs: ["depositing-funds"],
  },
];

export const PHASE4_CH14_SESSION_STEPS: readonly {
  assetSlug: string;
  kind: "learn" | "repair" | "teachback" | "recall";
  reasonCodes: readonly string[];
}[] = [
  { assetSlug: "ch14-trust-overview-explanation", kind: "learn", reasonCodes: ["exam_weight_misc", "chapter_14"] },
  { assetSlug: "ch14-client-vs-nonclient-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch14-reeb18-vs-ibreta-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch14-depositing-vs-ibreta-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch14-client-vs-depositing-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "ch14-reeb18-explanation", kind: "learn", reasonCodes: ["exam_weight_misc", "wisconsin_heading"] },
  { assetSlug: "ch14-client-vs-nonclient-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "ch14-ibreta-simple", kind: "learn", reasonCodes: ["exam_weight_misc", "modality_simple"] },
  { assetSlug: "ch14-depositing-explanation", kind: "learn", reasonCodes: ["exam_weight_misc", "chapter_14"] },
  { assetSlug: "ch14-client-nonclient-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch14-reeb18-ibreta-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "ch14-depositing-ibreta-recall", kind: "recall", reasonCodes: ["retrieval"] },
];
