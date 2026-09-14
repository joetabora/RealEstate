import type { QuestionSeed } from "./catalog";

/**
 * Chapter 6 Valuation scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented formulas, dollar adjustments, or statutes.
 */
export const PHASE5_CH6_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch6-q-market-vs-appraised-value-vs-principles",
    stem: "Chapter 6 notes keep Market Value Versus Appraised Value and Principles of Value as separate headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 6,
    examCategoryCodes: ["III"],
    pair: { a: "market-value-versus-appraised-value", b: "principles-of-value" },
    citationSlugs: ["market-value-versus-appraised-value", "principles-of-value"],
    options: [
      {
        key: "A",
        body: "Market Value Versus Appraised Value and Principles of Value are one interchangeable Chapter 6 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 6 notes keep Market Value Versus Appraised Value and Principles of Value as separate headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Principles of Value appear only under Chapter 5 fair-housing notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Market Value Versus Appraised Value is only a Chapter 14 trust-account heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges those two valuation headings; Chapter 6 keeps them separate.",
    remediationDistinction:
      "Ask which heading fits: Market Value Versus Appraised Value or Principles of Value.",
  },
  {
    slug: "ch6-q-market-vs-appraised-value-vs-sales-comparison",
    stem: "Chapter 6 separates market value vs appraised value from the Market Data (Sales Comparison) Approach heading. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 6,
    examCategoryCodes: ["III"],
    pair: {
      a: "market-value-versus-appraised-value",
      b: "market-data-sales-comparison-approach",
    },
    citationSlugs: [
      "market-value-versus-appraised-value",
      "market-data-sales-comparison-approach",
    ],
    options: [
      {
        key: "A",
        body: "Treat market value vs appraised value and the sales comparison approach as one heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which heading fits — Market Value Versus Appraised Value or the Market Data (Sales Comparison) Approach — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 2 antitrust headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "The Market Data (Sales Comparison) Approach appears only in Chapter 11 Financing.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 6 keeps market value vs appraised value separate from the Market Data (Sales Comparison) Approach heading.",
    remediationDistinction:
      "Ask which heading fits: Market Value Versus Appraised Value or the Market Data (Sales Comparison) Approach.",
  },
  {
    slug: "ch6-q-principles-vs-sales-comparison",
    stem: "Chapter 6 has separate Principles of Value and Market Data (Sales Comparison) Approach headings. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 6,
    examCategoryCodes: ["III"],
    pair: { a: "principles-of-value", b: "market-data-sales-comparison-approach" },
    citationSlugs: ["principles-of-value", "market-data-sales-comparison-approach"],
    options: [
      {
        key: "A",
        body: "Principles of Value and the Market Data (Sales Comparison) Approach share one Chapter 6 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 6 keeps separate Principles of Value and Market Data (Sales Comparison) Approach headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "The sales comparison approach is only a Chapter 4 disclosure heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Principles of Value appear only under Chapter 3 WB-36 notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses Principles of Value with the sales comparison approach; Chapter 6 keeps them separate.",
    remediationDistinction:
      "Name which heading the item fits: Principles of Value or the Market Data (Sales Comparison) Approach.",
  },
];
