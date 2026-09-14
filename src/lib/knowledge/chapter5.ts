import type { ConceptSeed, ConfusionPairSeed } from "./types";

const BOOK = "pub725-course-book" as const;
const NOTES = "chapter-5-fair-housing-notes" as const;
const FAIR_HOUSING = ["VIII"] as const;

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
 * Chapter 5 concepts from PUB725 / Chapter 5 notes headings (Fair Housing).
 * Pages from local inspection. No definitions or protected-class lists stored here.
 */
export const CHAPTER_5_CONCEPTS: readonly ConceptSeed[] = [
  {
    slug: "fair-housing-law",
    name: "Fair housing law",
    chapterNumber: 5,
    group: "fair-housing",
    jurisdictionScope: "both",
    examCategoryCodes: FAIR_HOUSING,
    citations: [book("FAIR HOUSING LAW", 95, 99), notes("Fair Housing Law", 1)],
  },
  {
    slug: "wisconsin-protected-classes",
    name: "Wisconsin’s 13 protected classes",
    chapterNumber: 5,
    group: "fair-housing",
    jurisdictionScope: "wi",
    examCategoryCodes: FAIR_HOUSING,
    citations: [notes("Wisconsin’s 13 Protected Classes", 2)],
    partOf: ["fair-housing-law"],
  },
  {
    slug: "prohibited-under-fair-housing",
    name: "Prohibited under fair housing law",
    chapterNumber: 5,
    group: "fair-housing",
    jurisdictionScope: "both",
    examCategoryCodes: FAIR_HOUSING,
    citations: [notes("Prohibited Under Fair Housing Law", 4)],
    partOf: ["fair-housing-law"],
  },
  {
    slug: "permissible-under-fair-housing",
    name: "Permissible under fair housing law",
    chapterNumber: 5,
    group: "fair-housing",
    jurisdictionScope: "both",
    examCategoryCodes: FAIR_HOUSING,
    citations: [notes("Permissible Under Fair Housing Law", 5)],
    partOf: ["fair-housing-law"],
  },
  {
    slug: "fair-housing-advertising",
    name: "Fair housing advertising",
    chapterNumber: 5,
    group: "fair-housing-practice",
    jurisdictionScope: "both",
    examCategoryCodes: FAIR_HOUSING,
    citations: [notes("Advertising", 6)],
    prerequisites: ["fair-housing-law"],
  },
  {
    slug: "demographic-data-protected-classes",
    name: "Use of demographic data relating to protected classes",
    chapterNumber: 5,
    group: "fair-housing-practice",
    jurisdictionScope: "both",
    examCategoryCodes: FAIR_HOUSING,
    citations: [notes("Use of Demographic Data Relating to Protected Classes", 8)],
    prerequisites: ["fair-housing-law", "wisconsin-protected-classes"],
  },
  {
    slug: "americans-with-disabilities-act",
    name: "The Americans with Disabilities Act (ADA)",
    chapterNumber: 5,
    group: "disability-access",
    jurisdictionScope: "both",
    examCategoryCodes: FAIR_HOUSING,
    citations: [
      book("THE AMERICANS WITH DISABILITIES ACT (ADA)", 100, 104),
      notes("The Americans with Disabilities Act (ADA)", 9),
    ],
    prerequisites: ["fair-housing-law"],
  },
  {
    slug: "handling-fair-housing-complaints",
    name: "Handling fair housing complaints",
    chapterNumber: 5,
    group: "fair-housing-practice",
    jurisdictionScope: "both",
    examCategoryCodes: FAIR_HOUSING,
    citations: [book("HANDLING COMPLAINTS", 102, 106), notes("Handling Complaints", 11)],
    prerequisites: ["fair-housing-law"],
  },
  {
    slug: "fair-housing-office-procedures",
    name: "Establishing office procedures regarding fair housing",
    chapterNumber: 5,
    group: "fair-housing-practice",
    jurisdictionScope: "both",
    examCategoryCodes: FAIR_HOUSING,
    citations: [
      book("ESTABLISHING OFFICE PROCEDURES REGARDING FAIR HOUSING", 103, 107),
      notes("Establishing O ffi ce Procedures Regarding Fair Housing Laws", 12),
    ],
    prerequisites: ["fair-housing-law"],
  },
  {
    slug: "fair-housing-laws",
    name: "Fair housing laws",
    chapterNumber: 5,
    group: "fair-housing",
    jurisdictionScope: "both",
    examCategoryCodes: FAIR_HOUSING,
    citations: [book("LAWS", 103, 107)],
    prerequisites: ["fair-housing-law"],
  },
];

export const CHAPTER_5_CONFUSION_PAIRS: readonly ConfusionPairSeed[] = [
  {
    a: "prohibited-under-fair-housing",
    b: "permissible-under-fair-housing",
    reason: "Chapter 5 notes list prohibited and permissible fair housing conduct as separate headings.",
  },
  {
    a: "fair-housing-law",
    b: "americans-with-disabilities-act",
    reason: "Chapter 5 has separate Fair Housing Law and ADA headings.",
  },
  {
    a: "fair-housing-advertising",
    b: "demographic-data-protected-classes",
    reason: "Chapter 5 notes separate Advertising from Use of Demographic Data Relating to Protected Classes.",
  },
  {
    a: "handling-fair-housing-complaints",
    b: "fair-housing-office-procedures",
    reason: "Chapter 5 separates Handling Complaints from Establishing Office Procedures Regarding Fair Housing.",
  },
  {
    a: "wisconsin-protected-classes",
    b: "fair-housing-law",
    reason: "Chapter 5 notes place Wisconsin’s 13 Protected Classes under Fair Housing Law as its own heading.",
  },
];

export const WI_SCOPED_CHAPTER_5_SLUGS = CHAPTER_5_CONCEPTS.filter(
  (concept) => concept.jurisdictionScope === "wi",
).map((concept) => concept.slug);
