import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { INGEST_VERSION, type SourceAuthority, type SourceLayer } from "./types";

/**
 * Structural map of PUB725 from local inspection of the July 2024 PDF.
 * Page numbers are 1-based PDF indices, not reconstructed book text.
 */
export const PUB725_RELATIVE_PATH = "Course/PUB725_July_2024.pdf";
export const CHAPTER_1_NOTES_RELATIVE_PATH =
  "Course/Chapter1/Chapter 1 Agency relationships.pdf";
export const CHAPTER_2_NOTES_RELATIVE_PATH =
  "Course/Chapter2/Chapter 2 Agency Issues.pdf";
export const CHAPTER_3_NOTES_RELATIVE_PATH =
  "Course/Chapter3/Chapter 3 Agency Agreements.pdf";
export const CHAPTER_4_NOTES_RELATIVE_PATH =
  "Course/Chapter4/Chapter 4 Disclosure Obligations.pdf";
export const CHAPTER_5_NOTES_RELATIVE_PATH =
  "Course/Chapter5/Chapter 5 Fair Housing.pdf";
export const CHAPTER_6_NOTES_RELATIVE_PATH =
  "Course/Chapter6/Chapter 6 Valuation.pdf";
export const CHAPTER_7_NOTES_RELATIVE_PATH =
  "Course/Chapter7/Chapter 7 Real Property Ownership.pdf";
export const CHAPTER_8_NOTES_RELATIVE_PATH =
  "Course/Chapter8/Chapter 8 Title of Real Estate.pdf";
export const CHAPTER_9_NOTES_RELATIVE_PATH =
  "Course/Chapter9/Chapter 9 Land Use.pdf";
export const CHAPTER_10_NOTES_RELATIVE_PATH =
  "Course/Chapter10/Chapter 10 Offers to Purchase.pdf";
export const CHAPTER_11_NOTES_RELATIVE_PATH =
  "Course/Chapter11/Chapter 11 Finacing.pdf";

/** Inspected: printed page 1 is PDF page 5; the offset holds through the math appendix. */
export const PUB725_PRINTED_PAGE_OFFSET = 4;

export const COURSE_CHAPTERS = [
  { number: 1, title: "Agency Relationships", pdfStart: 5 },
  { number: 2, title: "Agency Issues", pdfStart: 31 },
  { number: 3, title: "Agency Agreements", pdfStart: 47 },
  { number: 4, title: "Disclosure Obligations", pdfStart: 79 },
  { number: 5, title: "Fair Housing", pdfStart: 99 },
  { number: 6, title: "Valuation", pdfStart: 111 },
  { number: 7, title: "Real Property Ownership", pdfStart: 119 },
  { number: 8, title: "Title of Real Estate", pdfStart: 133 },
  { number: 9, title: "Land Use", pdfStart: 147 },
  { number: 10, title: "Offers to Purchase", pdfStart: 155 },
  { number: 11, title: "Financing", pdfStart: 199 },
  { number: 12, title: "Other Approved Forms", pdfStart: 215 },
  { number: 13, title: "Contract Law", pdfStart: 233 },
  { number: 14, title: "Trust Accounts", pdfStart: 243 },
] as const;

export type CourseChapter = (typeof COURSE_CHAPTERS)[number];

export const PUB725_PARTS = [
  {
    slug: "pub725-front-matter",
    title: "PUB725 front matter",
    layer: "course_book" as SourceLayer,
    pdfStart: 1,
    pdfEnd: 4,
    hideBodyInUi: false,
  },
  {
    slug: "pub725-course-book",
    title: "WRA Real Estate Sales Course Book (PUB725)",
    layer: "course_book" as SourceLayer,
    pdfStart: 5,
    pdfEnd: 248,
    hideBodyInUi: false,
  },
  {
    slug: "pub725-forms-appendix",
    title: "Forms appendix",
    layer: "forms" as SourceLayer,
    pdfStart: 249,
    pdfEnd: 344,
    hideBodyInUi: false,
  },
  {
    slug: "pub725-story-problem",
    title: "Story problem",
    layer: "story_problem" as SourceLayer,
    pdfStart: 345,
    pdfEnd: 390,
    hideBodyInUi: false,
  },
  {
    slug: "pub725-practice-exam",
    title: "Course practice exam",
    layer: "practice_exam" as SourceLayer,
    pdfStart: 391,
    pdfEnd: 422,
    hideBodyInUi: true,
  },
  {
    slug: "pub725-glossary",
    title: "Glossary",
    layer: "glossary" as SourceLayer,
    pdfStart: 423,
    pdfEnd: 447,
    hideBodyInUi: false,
  },
  {
    slug: "pub725-math-appendix",
    title: "Math appendix",
    layer: "math_appendix" as SourceLayer,
    pdfStart: 448,
    pdfEnd: 450,
    hideBodyInUi: false,
  },
] as const;

export const CHAPTER_1_NOTES_PART = {
  slug: "chapter-1-agency-notes",
  title: "Chapter 1 notes — Agency relationships",
  layer: "chapter_notes" as SourceLayer,
  relativePath: CHAPTER_1_NOTES_RELATIVE_PATH,
  hideBodyInUi: false,
  chapterNumber: 1,
  chapterTitle: "Agency Relationships",
} as const;

export const CHAPTER_2_NOTES_PART = {
  slug: "chapter-2-agency-issues-notes",
  title: "Chapter 2 notes — Agency issues",
  layer: "chapter_notes" as SourceLayer,
  relativePath: CHAPTER_2_NOTES_RELATIVE_PATH,
  hideBodyInUi: false,
  chapterNumber: 2,
  chapterTitle: "Agency Issues",
} as const;

export const CHAPTER_3_NOTES_PART = {
  slug: "chapter-3-agency-agreements-notes",
  title: "Chapter 3 notes — Agency agreements",
  layer: "chapter_notes" as SourceLayer,
  relativePath: CHAPTER_3_NOTES_RELATIVE_PATH,
  hideBodyInUi: false,
  chapterNumber: 3,
  chapterTitle: "Agency Agreements",
} as const;

export const CHAPTER_4_NOTES_PART = {
  slug: "chapter-4-disclosure-obligations-notes",
  title: "Chapter 4 notes — Disclosure obligations",
  layer: "chapter_notes" as SourceLayer,
  relativePath: CHAPTER_4_NOTES_RELATIVE_PATH,
  hideBodyInUi: false,
  chapterNumber: 4,
  chapterTitle: "Disclosure Obligations",
} as const;

export const CHAPTER_5_NOTES_PART = {
  slug: "chapter-5-fair-housing-notes",
  title: "Chapter 5 notes — Fair housing",
  layer: "chapter_notes" as SourceLayer,
  relativePath: CHAPTER_5_NOTES_RELATIVE_PATH,
  hideBodyInUi: false,
  chapterNumber: 5,
  chapterTitle: "Fair Housing",
} as const;

export const CHAPTER_6_NOTES_PART = {
  slug: "chapter-6-valuation-notes",
  title: "Chapter 6 notes — Valuation",
  layer: "chapter_notes" as SourceLayer,
  relativePath: CHAPTER_6_NOTES_RELATIVE_PATH,
  hideBodyInUi: false,
  chapterNumber: 6,
  chapterTitle: "Valuation",
} as const;

export const CHAPTER_7_NOTES_PART = {
  slug: "chapter-7-ownership-notes",
  title: "Chapter 7 notes — Real property ownership",
  layer: "chapter_notes" as SourceLayer,
  relativePath: CHAPTER_7_NOTES_RELATIVE_PATH,
  hideBodyInUi: false,
  chapterNumber: 7,
  chapterTitle: "Real Property Ownership",
} as const;

export const CHAPTER_8_NOTES_PART = {
  slug: "chapter-8-title-notes",
  title: "Chapter 8 notes — Title of real estate",
  layer: "chapter_notes" as SourceLayer,
  relativePath: CHAPTER_8_NOTES_RELATIVE_PATH,
  hideBodyInUi: false,
  chapterNumber: 8,
  chapterTitle: "Title of Real Estate",
} as const;

export const CHAPTER_9_NOTES_PART = {
  slug: "chapter-9-land-use-notes",
  title: "Chapter 9 notes — Land use",
  layer: "chapter_notes" as SourceLayer,
  relativePath: CHAPTER_9_NOTES_RELATIVE_PATH,
  hideBodyInUi: false,
  chapterNumber: 9,
  chapterTitle: "Land Use",
} as const;

export const CHAPTER_10_NOTES_PART = {
  slug: "chapter-10-offers-notes",
  title: "Chapter 10 notes — Offers to purchase",
  layer: "chapter_notes" as SourceLayer,
  relativePath: CHAPTER_10_NOTES_RELATIVE_PATH,
  hideBodyInUi: false,
  chapterNumber: 10,
  chapterTitle: "Offers to Purchase",
} as const;

export const CHAPTER_11_NOTES_PART = {
  slug: "chapter-11-financing-notes",
  title: "Chapter 11 notes — Financing",
  layer: "chapter_notes" as SourceLayer,
  relativePath: CHAPTER_11_NOTES_RELATIVE_PATH,
  hideBodyInUi: false,
  chapterNumber: 11,
  chapterTitle: "Financing",
} as const;

export const CHAPTER_NOTES_PARTS = [
  CHAPTER_1_NOTES_PART,
  CHAPTER_2_NOTES_PART,
  CHAPTER_3_NOTES_PART,
  CHAPTER_4_NOTES_PART,
  CHAPTER_5_NOTES_PART,
  CHAPTER_6_NOTES_PART,
  CHAPTER_7_NOTES_PART,
  CHAPTER_8_NOTES_PART,
  CHAPTER_9_NOTES_PART,
  CHAPTER_10_NOTES_PART,
  CHAPTER_11_NOTES_PART,
] as const;

export const BLUEPRINT_SOURCE_PART = {
  slug: "pearson-salesperson-outline",
  title: "Pearson VUE Wisconsin salesperson content outline",
  layer: "exam_blueprint" as SourceLayer,
  hideBodyInUi: false,
} as const;

/** July 2024 from the filename. Day-of-month is not stated on the cover, so the 1st is a month marker. */
export const PUB725_EFFECTIVE_AT = new Date("2024-07-01T00:00:00.000Z");

export const DEFAULT_AUTHORITY: SourceAuthority = "educational";

export function chapterAtPdfPage(pdfPage: number): CourseChapter | null {
  let found: CourseChapter | null = null;
  for (const chapter of COURSE_CHAPTERS) {
    if (pdfPage >= chapter.pdfStart) {
      found = chapter;
    }
  }
  const book = PUB725_PARTS.find((part) => part.slug === "pub725-course-book");
  if (!book || !found) {
    return null;
  }
  if (pdfPage < book.pdfStart || pdfPage > book.pdfEnd) {
    return null;
  }
  return found;
}

export function chapterPdfEnd(chapter: CourseChapter): number {
  const index = COURSE_CHAPTERS.findIndex((row) => row.number === chapter.number);
  const next = COURSE_CHAPTERS[index + 1];
  const book = PUB725_PARTS.find((part) => part.slug === "pub725-course-book");
  if (next) {
    return next.pdfStart - 1;
  }
  return book?.pdfEnd ?? chapter.pdfStart;
}

export function printedPageForPdfPage(pdfPage: number): number | null {
  if (pdfPage <= PUB725_PRINTED_PAGE_OFFSET) {
    return null;
  }
  return pdfPage - PUB725_PRINTED_PAGE_OFFSET;
}

export function editionDefaults() {
  return {
    slug: COURSE_EDITION_SEED.slug,
    jurisdiction: COURSE_EDITION_SEED.jurisdiction,
    ingestVersion: INGEST_VERSION,
    effectiveAt: PUB725_EFFECTIVE_AT,
  };
}

export function requiredSourceFiles(): string[] {
  return [
    PUB725_RELATIVE_PATH,
    CHAPTER_1_NOTES_RELATIVE_PATH,
    CHAPTER_2_NOTES_RELATIVE_PATH,
    CHAPTER_3_NOTES_RELATIVE_PATH,
    CHAPTER_4_NOTES_RELATIVE_PATH,
    CHAPTER_5_NOTES_RELATIVE_PATH,
    CHAPTER_6_NOTES_RELATIVE_PATH,
    CHAPTER_7_NOTES_RELATIVE_PATH,
    CHAPTER_8_NOTES_RELATIVE_PATH,
    CHAPTER_9_NOTES_RELATIVE_PATH,
    CHAPTER_10_NOTES_RELATIVE_PATH,
    CHAPTER_11_NOTES_RELATIVE_PATH,
  ];
}
