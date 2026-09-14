import type { ConceptSeed, ConfusionPairSeed } from "./types";

const BOOK = "pub725-course-book" as const;
const NOTES = "chapter-4-disclosure-obligations-notes" as const;
const DISCLOSURES = ["V"] as const;
const DISCLOSURES_AND_FORMS = ["V", "VI"] as const;

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
 * Chapter 4 concepts from PUB725 / Chapter 4 notes headings (Disclosure Obligations).
 * Pages from local inspection. No definitions stored here.
 */
export const CHAPTER_4_CONCEPTS: readonly ConceptSeed[] = [
  {
    slug: "disclosure",
    name: "Disclosure",
    chapterNumber: 4,
    group: "property-disclosure",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [book("DISCLOSURE", 75, 79), notes("Disclosure", 1)],
  },
  {
    slug: "liability",
    name: "Liability",
    chapterNumber: 4,
    group: "property-disclosure",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [book("LIABILITY", 76, 80), notes("Liability", 2)],
    prerequisites: ["disclosure"],
  },
  {
    slug: "advertising-disclosure",
    name: "Advertising",
    chapterNumber: 4,
    group: "property-disclosure",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [book("ADVERTISING", 76, 80), notes("Advertising", 2)],
    prerequisites: ["disclosure"],
  },
  {
    slug: "disclosure-obligations",
    name: "Disclosure obligations",
    chapterNumber: 4,
    group: "property-disclosure",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [book("DISCLOSURE OBLIGATIONS", 76, 80), notes("Disclosure Obligations", 3)],
    prerequisites: ["disclosure"],
  },
  {
    slug: "disclosure-by-owners",
    name: "Disclosure by owners of real estate",
    chapterNumber: 4,
    group: "owner-disclosure",
    jurisdictionScope: "wi",
    examCategoryCodes: DISCLOSURES_AND_FORMS,
    citations: [
      book("DISCLOSURE BY OWNERS OF REAL ESTATE", 77, 81),
      notes("Disclosure by Owners of Real Estate", 3),
    ],
    prerequisites: ["disclosure-obligations"],
  },
  {
    slug: "seller-completion-of-recr",
    name: "Seller completion of an RECR",
    chapterNumber: 4,
    group: "owner-disclosure",
    jurisdictionScope: "wi",
    examCategoryCodes: DISCLOSURES_AND_FORMS,
    citations: [notes("Seller Completion of an RECR", 6)],
    partOf: ["disclosure-by-owners"],
  },
  {
    slug: "amending-an-recr",
    name: "Amending an RECR",
    chapterNumber: 4,
    group: "owner-disclosure",
    jurisdictionScope: "wi",
    examCategoryCodes: DISCLOSURES_AND_FORMS,
    citations: [notes("Amending an RECR", 6)],
    partOf: ["disclosure-by-owners"],
  },
  {
    slug: "buyer-rescission",
    name: "Buyer rescission",
    chapterNumber: 4,
    group: "owner-disclosure",
    jurisdictionScope: "wi",
    examCategoryCodes: DISCLOSURES,
    citations: [notes("Buyer Rescission", 7)],
    partOf: ["disclosure-by-owners"],
  },
  {
    slug: "as-is-sales",
    name: "“As-is” sales",
    chapterNumber: 4,
    group: "owner-disclosure",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [book("“AS-IS” SALES", 79, 83), notes("As-is Sales", 8)],
    prerequisites: ["disclosure-by-owners"],
  },
  {
    slug: "licensee-disclosure-obligations",
    name: "Licensee disclosure obligations",
    chapterNumber: 4,
    group: "licensee-property-disclosure",
    jurisdictionScope: "wi",
    examCategoryCodes: DISCLOSURES,
    citations: [
      book("LICENSEE DISCLOSURE OBLIGATIONS", 80, 84),
      notes("Licensee Disclosure Obligations", 9),
    ],
    prerequisites: ["disclosure-obligations", "licensee"],
  },
  {
    slug: "condominium-disclosure-requirements",
    name: "Condominium disclosure requirements",
    chapterNumber: 4,
    group: "condominium-disclosure",
    jurisdictionScope: "wi",
    examCategoryCodes: DISCLOSURES_AND_FORMS,
    citations: [
      book("CONDOMINIUM DISCLOSURE REQUIREMENTS", 81, 85),
      notes("Condominium Disclosure Requirements", 11),
    ],
    prerequisites: ["disclosure-obligations", "wb-4-condo-listing"],
  },
  {
    slug: "executive-summary",
    name: "Executive summary",
    chapterNumber: 4,
    group: "condominium-disclosure",
    jurisdictionScope: "wi",
    examCategoryCodes: DISCLOSURES_AND_FORMS,
    citations: [notes("Executive Summary", 12)],
    partOf: ["condominium-disclosure-requirements"],
  },
  {
    slug: "condominium-addendum-to-recr",
    name: "Condominium addendum to the RECR",
    chapterNumber: 4,
    group: "condominium-disclosure",
    jurisdictionScope: "wi",
    examCategoryCodes: DISCLOSURES_AND_FORMS,
    citations: [notes("Condominium Addendum to the RECR", 14)],
    partOf: ["condominium-disclosure-requirements"],
    prerequisites: ["seller-completion-of-recr"],
  },
  {
    slug: "condominium-documents",
    name: "Condominium documents",
    chapterNumber: 4,
    group: "condominium-disclosure",
    jurisdictionScope: "wi",
    examCategoryCodes: DISCLOSURES_AND_FORMS,
    citations: [notes("Condominium Documents", 14)],
    partOf: ["condominium-disclosure-requirements"],
  },
  {
    slug: "environmental-concerns",
    name: "Environmental concerns",
    chapterNumber: 4,
    group: "environmental",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [book("ENVIRONMENTAL CONCERNS", 84, 88), notes("Environmental Concerns", 16)],
    prerequisites: ["disclosure-obligations"],
  },
  {
    slug: "lead-based-paint",
    name: "Lead-based paint",
    chapterNumber: 4,
    group: "environmental",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [notes("Lead-Based Paint", 16)],
    partOf: ["environmental-concerns"],
  },
  {
    slug: "underground-storage-tanks",
    name: "Underground storage tanks (UST)",
    chapterNumber: 4,
    group: "environmental",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [notes("Underground Storage Tanks (UST)", 19)],
    partOf: ["environmental-concerns"],
  },
  {
    slug: "asbestos",
    name: "Asbestos",
    chapterNumber: 4,
    group: "environmental",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [notes("Asbestos", 20)],
    partOf: ["environmental-concerns"],
  },
  {
    slug: "vermiculite",
    name: "Vermiculite",
    chapterNumber: 4,
    group: "environmental",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [notes("Vermiculite", 21)],
    partOf: ["environmental-concerns"],
  },
  {
    slug: "radon",
    name: "Radon",
    chapterNumber: 4,
    group: "environmental",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [notes("Radon", 22)],
    partOf: ["environmental-concerns"],
  },
  {
    slug: "mold",
    name: "Mold",
    chapterNumber: 4,
    group: "environmental",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [notes("Mold", 23)],
    partOf: ["environmental-concerns"],
  },
  {
    slug: "water-quality-issues",
    name: "Water quality issues",
    chapterNumber: 4,
    group: "environmental",
    jurisdictionScope: "both",
    examCategoryCodes: DISCLOSURES,
    citations: [notes("Water Quality Issues", 25)],
    partOf: ["environmental-concerns"],
  },
];

export const CHAPTER_4_CONFUSION_PAIRS: readonly ConfusionPairSeed[] = [
  {
    a: "disclosure-by-owners",
    b: "licensee-disclosure-obligations",
    reason: "Chapter 4 separates owner disclosure headings from licensee disclosure obligations.",
  },
  {
    a: "seller-completion-of-recr",
    b: "amending-an-recr",
    reason: "Chapter 4 notes list seller completion of an RECR and amending an RECR as separate headings.",
  },
  {
    a: "as-is-sales",
    b: "disclosure-by-owners",
    reason: "Chapter 4 has a separate “As-is” Sales heading next to Disclosure by Owners of Real Estate.",
  },
  {
    a: "buyer-rescission",
    b: "amending-an-recr",
    reason: "Chapter 4 notes distinguish buyer rescission from amending an RECR.",
  },
  {
    a: "condominium-disclosure-requirements",
    b: "disclosure-by-owners",
    reason: "Chapter 4 lists condominium disclosure requirements separately from owner RECR disclosure.",
  },
  {
    a: "executive-summary",
    b: "condominium-documents",
    reason: "Chapter 4 notes list Executive Summary and Condominium Documents as separate condo disclosure headings.",
  },
  {
    a: "lead-based-paint",
    b: "asbestos",
    reason: "Chapter 4 notes list lead-based paint and asbestos as separate environmental concern headings.",
  },
  {
    a: "radon",
    b: "mold",
    reason: "Chapter 4 notes list radon and mold as separate environmental concern headings.",
  },
];

export const WI_SCOPED_CHAPTER_4_SLUGS = CHAPTER_4_CONCEPTS.filter(
  (concept) => concept.jurisdictionScope === "wi",
).map((concept) => concept.slug);
