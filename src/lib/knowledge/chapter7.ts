import type { ConceptSeed, ConfusionPairSeed } from "./types";

const BOOK = "pub725-course-book" as const;
const NOTES = "chapter-7-ownership-notes" as const;
const OWNERSHIP = ["I"] as const;

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
 * Chapter 7 concepts from PUB725 / Chapter 7 notes headings (Real Property Ownership).
 * Pages from local inspection. No invented statutes, fees, or ownership-rule lists.
 */
export const CHAPTER_7_CONCEPTS: readonly ConceptSeed[] = [
  {
    slug: "ownership-chapter-overview",
    name: "Ownership chapter overview",
    chapterNumber: 7,
    group: "ownership-basics",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [notes("Chapter Overview", 1)],
  },
  {
    slug: "real-property-ownership",
    name: "Real property ownership",
    chapterNumber: 7,
    group: "ownership-basics",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [
      book("REAL PROPERTY OWNERSHIP", 115, 119),
      notes("Real Property Ownership", 1),
    ],
    partOf: ["ownership-chapter-overview"],
  },
  {
    slug: "real-versus-personal-property",
    name: "Real versus personal property",
    chapterNumber: 7,
    group: "property-classification",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [
      book("REAL VERSUS PERSONAL PROPERTY", 116, 120),
      notes("Real Versus Personal Property", 1),
    ],
    prerequisites: ["real-property-ownership"],
  },
  {
    slug: "property-fixtures",
    name: "Fixtures",
    chapterNumber: 7,
    group: "property-classification",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("Fixtures", 116, 120), notes("Fixtures", 2)],
    partOf: ["real-versus-personal-property"],
  },
  {
    slug: "trade-fixtures",
    name: "Trade fixtures",
    chapterNumber: 7,
    group: "property-classification",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("Trade Fixtures", 117, 121), notes("Trade Fixtures", 3)],
    partOf: ["real-versus-personal-property"],
  },
  {
    slug: "mobile-homes",
    name: "Mobile homes",
    chapterNumber: 7,
    group: "property-classification",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("Mobile Homes", 117, 121), notes("Mobile Homes", 3)],
    prerequisites: ["real-versus-personal-property"],
  },
  {
    slug: "estates-in-land",
    name: "Estates in land",
    chapterNumber: 7,
    group: "estates",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("ESTATES IN LAND", 117, 121), notes("Estates in Land", 4)],
    prerequisites: ["real-property-ownership"],
  },
  {
    slug: "freehold-estates",
    name: "Freehold estates",
    chapterNumber: 7,
    group: "estates",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("Freehold Estates", 118, 122), notes("Freehold Estates", 4)],
    partOf: ["estates-in-land"],
  },
  {
    slug: "leasehold-estates",
    name: "Leasehold estates",
    chapterNumber: 7,
    group: "estates",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("Leasehold Estates", 119, 123), notes("Leasehold Estates", 6)],
    partOf: ["estates-in-land"],
  },
  {
    slug: "forms-of-ownership",
    name: "Forms of ownership",
    chapterNumber: 7,
    group: "co-ownership",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [book("FORMS OF OWNERSHIP", 121, 125), notes("Forms of Ownership", 10)],
    prerequisites: ["estates-in-land"],
  },
  {
    slug: "wisconsin-marital-property",
    name: "Wisconsin marital property",
    chapterNumber: 7,
    group: "wi-ownership",
    jurisdictionScope: "wi",
    examCategoryCodes: OWNERSHIP,
    citations: [
      book("WISCONSIN MARITAL PROPERTY", 123, 127),
      notes("Wisconsin Marital Property", 13),
    ],
    prerequisites: ["forms-of-ownership"],
  },
  {
    slug: "management-and-control",
    name: "Management and control",
    chapterNumber: 7,
    group: "wi-ownership",
    jurisdictionScope: "wi",
    examCategoryCodes: OWNERSHIP,
    citations: [
      book("MANAGEMENT AND CONTROL", 124, 128),
      notes("Management and Control", 14),
    ],
    prerequisites: ["wisconsin-marital-property"],
  },
  {
    slug: "condominium-ownership",
    name: "Condominium ownership",
    chapterNumber: 7,
    group: "special-ownership",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [
      book("CONDOMINIUM OWNERSHIP", 124, 128),
      notes("Condominium Ownership", 15),
    ],
    prerequisites: ["forms-of-ownership"],
  },
  {
    slug: "cooperative-ownership",
    name: "Cooperative ownership",
    chapterNumber: 7,
    group: "special-ownership",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [
      book("COOPERATIVE OWNERSHIP", 126, 130),
      notes("Cooperative Ownership", 17),
    ],
    prerequisites: ["forms-of-ownership"],
  },
  {
    slug: "time-share-ownership",
    name: "Time-share ownership",
    chapterNumber: 7,
    group: "special-ownership",
    jurisdictionScope: "both",
    examCategoryCodes: OWNERSHIP,
    citations: [
      book("TIME-SHARE OWNERSHIP", 126, 130),
      notes("Time-Share Ownership", 18),
    ],
    prerequisites: ["forms-of-ownership"],
  },
];

export const CHAPTER_7_CONFUSION_PAIRS: readonly ConfusionPairSeed[] = [
  {
    a: "property-fixtures",
    b: "trade-fixtures",
    reason: "Chapter 7 notes list Fixtures and Trade Fixtures as separate headings.",
  },
  {
    a: "freehold-estates",
    b: "leasehold-estates",
    reason: "Chapter 7 separates Freehold Estates from Leasehold Estates under Estates in Land.",
  },
  {
    a: "condominium-ownership",
    b: "cooperative-ownership",
    reason: "Chapter 7 has separate Condominium Ownership and Cooperative Ownership headings.",
  },
  {
    a: "condominium-ownership",
    b: "time-share-ownership",
    reason: "Chapter 7 separates Condominium Ownership from Time-Share Ownership.",
  },
  {
    a: "wisconsin-marital-property",
    b: "management-and-control",
    reason:
      "Chapter 7 notes place Wisconsin Marital Property and Management and Control as separate headings.",
  },
  {
    a: "real-versus-personal-property",
    b: "property-fixtures",
    reason: "Chapter 7 separates Real Versus Personal Property from the Fixtures heading.",
  },
];

export const WI_SCOPED_CHAPTER_7_SLUGS = CHAPTER_7_CONCEPTS.filter(
  (concept) => concept.jurisdictionScope === "wi",
).map((concept) => concept.slug);
