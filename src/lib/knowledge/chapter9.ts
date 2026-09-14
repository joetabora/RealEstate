import type { ConceptSeed, ConfusionPairSeed } from "./types";

const BOOK = "pub725-course-book" as const;
const NOTES = "chapter-9-land-use-notes" as const;
const LAND_USE = ["II"] as const;

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
 * Chapter 9 concepts from PUB725 / Chapter 9 notes headings (Land Use).
 * Pages from local inspection. No invented ordinances, fee amounts, or statute lists.
 */
export const CHAPTER_9_CONCEPTS: readonly ConceptSeed[] = [
  {
    slug: "land-use-chapter-overview",
    name: "Land use chapter overview",
    chapterNumber: 9,
    group: "land-use-basics",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [book("Chapter Overview", 143, 147), notes("Chapter Overview", 1)],
  },
  {
    slug: "wisconsin-zoning-law-basics",
    name: "Wisconsin zoning law basics",
    chapterNumber: 9,
    group: "land-use-basics",
    jurisdictionScope: "wi",
    examCategoryCodes: LAND_USE,
    citations: [
      book("WISCONSIN ZONING LAW BASICS", 143, 147),
      notes("Wisconsin Zoning Law Basics", 1),
    ],
    partOf: ["land-use-chapter-overview"],
  },
  {
    slug: "zoning",
    name: "Zoning",
    chapterNumber: 9,
    group: "zoning",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [book("ZONING", 144, 148), notes("Zoning", 2)],
    prerequisites: ["wisconsin-zoning-law-basics"],
  },
  {
    slug: "permitted-uses",
    name: "Permitted uses",
    chapterNumber: 9,
    group: "zoning",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [book("Permitted Uses", 144, 148), notes("Permitted Uses", 2)],
    partOf: ["zoning"],
  },
  {
    slug: "conditional-uses",
    name: "Conditional uses",
    chapterNumber: 9,
    group: "zoning",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [book("Conditional Uses", 144, 148), notes("Conditional Uses", 3)],
    partOf: ["zoning"],
  },
  {
    slug: "prohibited-use",
    name: "Prohibited use",
    chapterNumber: 9,
    group: "zoning",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [book("Prohibited Use", 145, 149), notes("Prohibited Use", 3)],
    partOf: ["zoning"],
  },
  {
    slug: "spot-zoning",
    name: "Spot zoning",
    chapterNumber: 9,
    group: "zoning",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [book("Spot Zoning", 145, 149), notes("Spot Zoning", 3)],
    partOf: ["zoning"],
  },
  {
    slug: "variances",
    name: "Variances",
    chapterNumber: 9,
    group: "zoning",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [book("Variances", 145, 149), notes("Variances", 4)],
    partOf: ["zoning"],
  },
  {
    slug: "downzoning",
    name: "Downzoning",
    chapterNumber: 9,
    group: "zoning",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [book("Downzoning", 145, 149), notes("Downzoning", 5)],
    partOf: ["zoning"],
  },
  {
    slug: "nonconforming-use",
    name: "Nonconforming use",
    chapterNumber: 9,
    group: "zoning",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [book("Nonconforming Use", 146, 150), notes("Nonconforming Use", 5)],
    partOf: ["zoning"],
  },
  {
    slug: "planned-unit-developments",
    name: "Planned unit developments (PUD)",
    chapterNumber: 9,
    group: "zoning",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [
      book("Planned Unit Developments (PUD)", 146, 150),
      notes("Planned Unit Developments (PUD)", 5),
    ],
    partOf: ["zoning"],
  },
  {
    slug: "water-rights",
    name: "Water rights",
    chapterNumber: 9,
    group: "water-land-use",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [book("WATER RIGHTS", 146, 150), notes("Water Rights", 6)],
    prerequisites: ["zoning"],
  },
  {
    slug: "shoreland-zoning",
    name: "Shoreland zoning",
    chapterNumber: 9,
    group: "water-land-use",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [book("Shoreland Zoning", 147, 151), notes("Shoreland Zoning", 7)],
    partOf: ["water-rights"],
  },
  {
    slug: "wetlands",
    name: "Wetlands",
    chapterNumber: 9,
    group: "water-land-use",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [book("Wetlands", 147, 151), notes("Wetlands", 8)],
    partOf: ["water-rights"],
  },
  {
    slug: "private-land-use-controls",
    name: "Private land use controls",
    chapterNumber: 9,
    group: "private-controls",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [
      book("PRIVATE LAND USE CONTROLS", 148, 152),
      notes("Private Land Use Controls", 8),
    ],
    prerequisites: ["zoning"],
  },
  {
    slug: "deed-conditions",
    name: "Deed conditions",
    chapterNumber: 9,
    group: "private-controls",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [notes("Deed Conditions", 8)],
    partOf: ["private-land-use-controls"],
  },
  {
    slug: "deed-restrictions",
    name: "Deed restrictions",
    chapterNumber: 9,
    group: "private-controls",
    jurisdictionScope: "both",
    examCategoryCodes: LAND_USE,
    citations: [notes("Deed Restrictions (Deed Covenants, Subdivision Restrictions)", 8)],
    partOf: ["private-land-use-controls"],
  },
];

export const CHAPTER_9_CONFUSION_PAIRS: readonly ConfusionPairSeed[] = [
  {
    a: "permitted-uses",
    b: "conditional-uses",
    reason: "Chapter 9 notes list Permitted Uses and Conditional Uses as separate zoning headings.",
  },
  {
    a: "variances",
    b: "nonconforming-use",
    reason: "Chapter 9 separates Variances from Nonconforming Use.",
  },
  {
    a: "spot-zoning",
    b: "downzoning",
    reason: "Chapter 9 keeps Spot Zoning and Downzoning as separate headings.",
  },
  {
    a: "shoreland-zoning",
    b: "wetlands",
    reason: "Chapter 9 separates Shoreland Zoning from Wetlands under water-related land use.",
  },
  {
    a: "deed-conditions",
    b: "deed-restrictions",
    reason:
      "Chapter 9 notes list Deed Conditions and Deed Restrictions as separate private control headings.",
  },
  {
    a: "wisconsin-zoning-law-basics",
    b: "zoning",
    reason: "Chapter 9 has separate Wisconsin Zoning Law Basics and Zoning headings.",
  },
];

export const WI_SCOPED_CHAPTER_9_SLUGS = CHAPTER_9_CONCEPTS.filter(
  (concept) => concept.jurisdictionScope === "wi",
).map((concept) => concept.slug);
