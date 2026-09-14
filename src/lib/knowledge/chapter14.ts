import type { ConceptSeed, ConfusionPairSeed } from "./types";

const BOOK = "pub725-course-book" as const;
const MISC = ["X"] as const;

function book(
  heading: string,
  printedPage: number,
  pdfPage: number,
): ConceptSeed["citations"][number] {
  return {
    documentSlug: BOOK,
    heading,
    printedPage,
    pdfPage,
    layer: "course_book",
  };
}

/**
 * Chapter 14 concepts from PUB725 headings (Trust Accounts).
 * Book-only — no chapter-folder notes PDF. No invented deposit deadlines, interest rules, or statute text.
 */
export const CHAPTER_14_CONCEPTS: readonly ConceptSeed[] = [
  {
    slug: "trust-accounts-chapter-overview",
    name: "Trust accounts chapter overview",
    chapterNumber: 14,
    group: "trust-basics",
    jurisdictionScope: "both",
    examCategoryCodes: MISC,
    citations: [book("Chapter Overview", 239, 243)],
  },
  {
    slug: "reeb-18-trust-accounts",
    name: "REEB 18 trust accounts",
    chapterNumber: 14,
    group: "trust-basics",
    jurisdictionScope: "wi",
    examCategoryCodes: MISC,
    citations: [book("REEB 18 TRUST ACCOUNTS", 239, 243)],
    partOf: ["trust-accounts-chapter-overview"],
  },
  {
    slug: "client-funds",
    name: "Client funds",
    chapterNumber: 14,
    group: "trust-funds",
    jurisdictionScope: "wi",
    examCategoryCodes: MISC,
    citations: [book("REAL ESTATE FUNDS: CLIENT FUNDS AND NON-CLIENT FUNDS", 240, 244)],
    prerequisites: ["reeb-18-trust-accounts"],
  },
  {
    slug: "non-client-funds",
    name: "Non-client funds",
    chapterNumber: 14,
    group: "trust-funds",
    jurisdictionScope: "wi",
    examCategoryCodes: MISC,
    citations: [book("REAL ESTATE FUNDS: CLIENT FUNDS AND NON-CLIENT FUNDS", 240, 244)],
    prerequisites: ["reeb-18-trust-accounts"],
  },
  {
    slug: "ibreta",
    name: "IBRETA",
    chapterNumber: 14,
    group: "trust-funds",
    jurisdictionScope: "wi",
    examCategoryCodes: MISC,
    citations: [book("IBRETA", 240, 244)],
    prerequisites: ["client-funds"],
  },
  {
    slug: "depositing-funds",
    name: "Depositing funds",
    chapterNumber: 14,
    group: "trust-depositing",
    jurisdictionScope: "wi",
    examCategoryCodes: MISC,
    citations: [book("DEPOSITING FUNDS", 241, 245)],
    prerequisites: ["client-funds", "non-client-funds"],
  },
];

export const CHAPTER_14_CONFUSION_PAIRS: readonly ConfusionPairSeed[] = [
  {
    a: "client-funds",
    b: "non-client-funds",
    reason:
      "Chapter 14’s Real Estate Funds heading names client funds and non-client funds as distinct labels.",
  },
  {
    a: "reeb-18-trust-accounts",
    b: "ibreta",
    reason: "Chapter 14 keeps REEB 18 Trust Accounts separate from the IBRETA heading.",
  },
  {
    a: "depositing-funds",
    b: "ibreta",
    reason: "Chapter 14 separates Depositing Funds from IBRETA.",
  },
  {
    a: "client-funds",
    b: "depositing-funds",
    reason:
      "Chapter 14 lists Real Estate Funds (client/non-client) separately from Depositing Funds.",
  },
];

export const WI_SCOPED_CHAPTER_14_SLUGS = CHAPTER_14_CONCEPTS.filter(
  (concept) => concept.jurisdictionScope === "wi",
).map((concept) => concept.slug);
