import type { ConceptSeed, ConfusionPairSeed } from "./types";

const BOOK = "pub725-course-book" as const;
const NOTES = "chapter-6-valuation-notes" as const;
const VALUING = ["III"] as const;

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
 * Chapter 6 concepts from PUB725 / Chapter 6 notes headings (Valuation).
 * Pages from local inspection. No invented formulas, dollar adjustments, or WI statutes.
 */
export const CHAPTER_6_CONCEPTS: readonly ConceptSeed[] = [
  {
    slug: "valuation-chapter-overview",
    name: "Valuation chapter overview",
    chapterNumber: 6,
    group: "valuation",
    jurisdictionScope: "both",
    examCategoryCodes: VALUING,
    citations: [book("Chapter Overview", 107, 111), notes("Chapter Overview", 1)],
  },
  {
    slug: "market-value-versus-appraised-value",
    name: "Market value versus appraised value",
    chapterNumber: 6,
    group: "valuation",
    jurisdictionScope: "both",
    examCategoryCodes: VALUING,
    citations: [
      book("MARKET VALUE VERSUS", 107, 111),
      book("APPRAISED VALUE", 107, 111),
      notes("Market Value Versus Appraised Value", 1),
    ],
    prerequisites: ["valuation-chapter-overview"],
  },
  {
    slug: "principles-of-value",
    name: "Principles of value",
    chapterNumber: 6,
    group: "valuation",
    jurisdictionScope: "both",
    examCategoryCodes: VALUING,
    citations: [book("PRINCIPLES OF VALUE", 108, 112), notes("Principles of Value", 2)],
    prerequisites: ["valuation-chapter-overview"],
  },
  {
    slug: "market-data-sales-comparison-approach",
    name: "The market data (sales comparison) approach",
    chapterNumber: 6,
    group: "valuation-approach",
    jurisdictionScope: "both",
    examCategoryCodes: VALUING,
    citations: [
      book("THE MARKET DATA (SALES COMPARISON) APPROACH", 109, 113),
      notes("The Market Data (Sales Comparison) Approach", 5),
    ],
    prerequisites: ["market-value-versus-appraised-value", "principles-of-value"],
  },
];

export const CHAPTER_6_CONFUSION_PAIRS: readonly ConfusionPairSeed[] = [
  {
    a: "market-value-versus-appraised-value",
    b: "principles-of-value",
    reason:
      "Chapter 6 notes keep Market Value Versus Appraised Value and Principles of Value as separate headings.",
  },
  {
    a: "market-value-versus-appraised-value",
    b: "market-data-sales-comparison-approach",
    reason:
      "Chapter 6 separates market value vs appraised value from the Market Data (Sales Comparison) Approach heading.",
  },
  {
    a: "principles-of-value",
    b: "market-data-sales-comparison-approach",
    reason:
      "Chapter 6 has separate Principles of Value and Market Data (Sales Comparison) Approach headings.",
  },
];

export const WI_SCOPED_CHAPTER_6_SLUGS = CHAPTER_6_CONCEPTS.filter(
  (concept) => concept.jurisdictionScope === "wi",
).map((concept) => concept.slug);
