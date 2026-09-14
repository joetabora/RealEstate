import type { ConceptSeed, ConfusionPairSeed } from "./types";

const BOOK = "pub725-course-book" as const;
const NOTES = "chapter-8-title-notes" as const;
const OWNERSHIP = ["I"] as const;
const CALCULATIONS = ["III"] as const;

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

function notes(heading: string, pdfPage: number): ConceptSeed["citations"][number] {
  return {
    documentSlug: NOTES,
    heading,
    pdfPage,
    layer: "chapter_notes",
  };
}

/**
 * Chapter 8 concepts from PUB725 / Chapter 8 notes headings (Title of Real Estate).
 * Pages from local inspection. No invented fees, statutes, or exception lists.
 */
export const CHAPTER_8_CONCEPTS: readonly ConceptSeed[] = [
  {
    slug: "title-chapter-overview",
    name: "Title chapter overview",
    chapterNumber: 8,
    group: "title-transfer",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("Chapter Overview", 129, 133), notes("Chapter Overview", 1)],
  },
  {
    slug: "transfer-of-title",
    name: "Transfer of title",
    chapterNumber: 8,
    group: "title-transfer",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("TRANSFER OF TITLE", 129, 133), notes("Transfer of Title", 1)],
    partOf: ["title-chapter-overview"],
  },
  {
    slug: "deeds",
    name: "Deeds",
    chapterNumber: 8,
    group: "deeds",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("DEEDS", 130, 134), notes("Deeds", 2)],
    prerequisites: ["transfer-of-title"],
  },
  {
    slug: "warranty-deed",
    name: "Warranty deed",
    chapterNumber: 8,
    group: "deeds",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("Warranty Deed", 130, 134), notes("Warranty Deed", 2)],
    partOf: ["deeds"],
  },
  {
    slug: "quitclaim-deed",
    name: "Quitclaim deed",
    chapterNumber: 8,
    group: "deeds",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("Quitclaim Deed", 130, 134), notes("Quitclaim Deed", 2)],
    partOf: ["deeds"],
  },
  {
    slug: "personal-representative-deed",
    name: "Personal representative’s deed",
    chapterNumber: 8,
    group: "deeds",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [
      book("Personal Representative’s Deed", 130, 134),
      notes("Personal Representative’s Deed", 2),
    ],
    partOf: ["deeds"],
  },
  {
    slug: "trustee-deed",
    name: "Trustee’s deed",
    chapterNumber: 8,
    group: "deeds",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("Trustee’s Deed", 130, 134), notes("Trustee’s Deed", 3)],
    partOf: ["deeds"],
  },
  {
    slug: "wisconsin-transfer-fee",
    name: "Wisconsin transfer fee",
    chapterNumber: 8,
    group: "wi-title",
    jurisdictionScope: "wi",
    examCategoryCodes: OWNERSHIP,
    citations: [
      book("WISCONSIN TRANSFER FEE", 131, 135),
      notes("Wisconsin Transfer Fee", 3),
    ],
    prerequisites: ["deeds"],
  },
  {
    slug: "encumbrances-to-title",
    name: "Encumbrances to real estate title",
    chapterNumber: 8,
    group: "encumbrances",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [
      book("ENCUMBRANCES TO REAL ESTATE TITLE", 131, 135),
      notes("Encumbrances to Real Estate Title", 3),
    ],
    prerequisites: ["transfer-of-title"],
  },
  {
    slug: "easements",
    name: "Easements",
    chapterNumber: 8,
    group: "encumbrances",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("Easements", 131, 135), notes("Easements", 4)],
    partOf: ["encumbrances-to-title"],
  },
  {
    slug: "encroachments",
    name: "Encroachments",
    chapterNumber: 8,
    group: "encumbrances",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("Encroachments", 133, 137), notes("Encroachments", 7)],
    partOf: ["encumbrances-to-title"],
  },
  {
    slug: "liens",
    name: "Liens",
    chapterNumber: 8,
    group: "liens",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("Liens", 134, 138), notes("Liens", 8)],
    partOf: ["encumbrances-to-title"],
  },
  {
    slug: "types-of-liens",
    name: "Types of liens",
    chapterNumber: 8,
    group: "liens",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("TYPES OF LIENS", 134, 138), notes("Types of Liens", 9)],
    partOf: ["liens"],
  },
  {
    slug: "tax-calculations",
    name: "Tax calculations",
    chapterNumber: 8,
    group: "title-tax",
    jurisdictionScope: "both",
    examCategoryCodes: CALCULATIONS,
    citations: [book("TAX CALCULATIONS", 137, 141), notes("Tax Calculations", 12)],
    prerequisites: ["types-of-liens"],
  },
  {
    slug: "evidence-of-title",
    name: "Evidence of title",
    chapterNumber: 8,
    group: "title-evidence",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("EVIDENCE OF TITLE", 138, 142), notes("Evidence of Title", 13)],
    prerequisites: ["transfer-of-title"],
  },
  {
    slug: "forms-of-title-evidence",
    name: "Forms of title evidence",
    chapterNumber: 8,
    group: "title-evidence",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [
      book("FORMS OF TITLE EVIDENCE", 138, 142),
      notes("Forms of Title Evidence", 13),
    ],
    partOf: ["evidence-of-title"],
  },
  {
    slug: "standard-title-insurance-exceptions",
    name: "Standard title insurance exceptions",
    chapterNumber: 8,
    group: "title-evidence",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [
      book("STANDARD TITLE INSURANCE EXCEPTIONS", 139, 143),
      notes("Standard Title Insurance Exceptions", 15),
    ],
    prerequisites: ["forms-of-title-evidence"],
  },
];

export const CHAPTER_8_CONFUSION_PAIRS: readonly ConfusionPairSeed[] = [
  {
    a: "warranty-deed",
    b: "quitclaim-deed",
    reason: "Chapter 8 notes list Warranty Deed and Quitclaim Deed as separate deed headings.",
  },
  {
    a: "personal-representative-deed",
    b: "trustee-deed",
    reason:
      "Chapter 8 separates Personal Representative’s Deed from Trustee’s Deed under Deeds.",
  },
  {
    a: "easements",
    b: "encroachments",
    reason: "Chapter 8 keeps Easements and Encroachments as separate encumbrance headings.",
  },
  {
    a: "easements",
    b: "liens",
    reason: "Chapter 8 separates Easements from Liens under encumbrances to title.",
  },
  {
    a: "evidence-of-title",
    b: "forms-of-title-evidence",
    reason: "Chapter 8 has separate Evidence of Title and Forms of Title Evidence headings.",
  },
  {
    a: "forms-of-title-evidence",
    b: "standard-title-insurance-exceptions",
    reason:
      "Chapter 8 separates Forms of Title Evidence from Standard Title Insurance Exceptions.",
  },
];

export const WI_SCOPED_CHAPTER_8_SLUGS = CHAPTER_8_CONCEPTS.filter(
  (concept) => concept.jurisdictionScope === "wi",
).map((concept) => concept.slug);
