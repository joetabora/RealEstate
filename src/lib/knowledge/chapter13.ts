import type { ConceptSeed, ConfusionPairSeed } from "./types";

const BOOK = "pub725-course-book" as const;
const FORMS = ["VI"] as const;

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
 * Chapter 13 concepts from PUB725 headings (Contract Law).
 * Book-only — no chapter-folder notes PDF. No invented statute text or form-line language.
 * "RULES OF CONTRACT" / "CONSTRUCTION" are split PDF headings for one topic (same pattern as Ch6).
 */
export const CHAPTER_13_CONCEPTS: readonly ConceptSeed[] = [
  {
    slug: "contract-law-chapter-overview",
    name: "Contract law chapter overview",
    chapterNumber: 13,
    group: "contract-law-basics",
    jurisdictionScope: "both",
    examCategoryCodes: FORMS,
    citations: [book("Chapter Overview", 229, 233)],
  },
  {
    slug: "rules-of-contract-construction",
    name: "Rules of contract construction",
    chapterNumber: 13,
    group: "contract-law-basics",
    jurisdictionScope: "both",
    examCategoryCodes: FORMS,
    citations: [
      book("RULES OF CONTRACT", 229, 233),
      book("CONSTRUCTION", 229, 233),
    ],
    partOf: ["contract-law-chapter-overview"],
  },
  {
    slug: "reeb-15-copies-and-records",
    name: "REEB 15 — obligation to furnish copies and maintain records",
    chapterNumber: 13,
    group: "wi-contract-practice",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [book("REEB 15 - OBLIGATION TO FURNISH COPIES AND MAINTAIN RECORDS", 230, 234)],
    prerequisites: ["contract-law-chapter-overview"],
  },
  {
    slug: "approved-forms-and-legal-advice",
    name: "Approved forms and legal advice",
    chapterNumber: 13,
    group: "wi-contract-practice",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [book("APPROVED FORMS AND LEGAL ADVICE", 230, 234)],
    prerequisites: ["contract-law-chapter-overview"],
  },
  {
    slug: "validity-of-contracts",
    name: "Validity of contracts",
    chapterNumber: 13,
    group: "contract-validity",
    jurisdictionScope: "both",
    examCategoryCodes: FORMS,
    citations: [book("VALIDITY OF CONTRACTS", 231, 235)],
    prerequisites: ["rules-of-contract-construction"],
  },
  {
    slug: "conveyance-of-real-property",
    name: "Conveyance of real property",
    chapterNumber: 13,
    group: "contract-validity",
    jurisdictionScope: "both",
    examCategoryCodes: FORMS,
    citations: [book("CONVEYANCE OF REAL PROPERTY", 232, 236)],
    prerequisites: ["validity-of-contracts"],
  },
  {
    slug: "status-of-contracts",
    name: "Status of contracts",
    chapterNumber: 13,
    group: "contract-status",
    jurisdictionScope: "both",
    examCategoryCodes: FORMS,
    citations: [book("STATUS OF CONTRACTS", 232, 236)],
    prerequisites: ["validity-of-contracts"],
  },
  {
    slug: "wra-contract-drafting-tools",
    name: "WRA contract drafting tools for licensees",
    chapterNumber: 13,
    group: "wi-contract-practice",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [book("WRA CONTRACT DRAFTING TOOLS FOR LICENSEES", 234, 238)],
    prerequisites: ["approved-forms-and-legal-advice"],
  },
  {
    slug: "creation-and-termination-of-contracts",
    name: "Creation and termination of contracts",
    chapterNumber: 13,
    group: "contract-status",
    jurisdictionScope: "both",
    examCategoryCodes: FORMS,
    citations: [book("CREATION AND TERMINATION OF CONTRACTS", 234, 238)],
    prerequisites: ["status-of-contracts"],
  },
];

export const CHAPTER_13_CONFUSION_PAIRS: readonly ConfusionPairSeed[] = [
  {
    a: "validity-of-contracts",
    b: "status-of-contracts",
    reason: "Chapter 13 keeps Validity of Contracts and Status of Contracts as separate headings.",
  },
  {
    a: "creation-and-termination-of-contracts",
    b: "status-of-contracts",
    reason:
      "Chapter 13 separates Creation and Termination of Contracts from Status of Contracts.",
  },
  {
    a: "approved-forms-and-legal-advice",
    b: "wra-contract-drafting-tools",
    reason:
      "Chapter 13 lists Approved Forms and Legal Advice separately from WRA Contract Drafting Tools for Licensees.",
  },
  {
    a: "conveyance-of-real-property",
    b: "validity-of-contracts",
    reason: "Chapter 13 keeps Conveyance of Real Property distinct from Validity of Contracts.",
  },
  {
    a: "reeb-15-copies-and-records",
    b: "approved-forms-and-legal-advice",
    reason:
      "Chapter 13 has separate headings for REEB 15 copies/records and Approved Forms and Legal Advice.",
  },
];

export const WI_SCOPED_CHAPTER_13_SLUGS = CHAPTER_13_CONCEPTS.filter(
  (concept) => concept.jurisdictionScope === "wi",
).map((concept) => concept.slug);
