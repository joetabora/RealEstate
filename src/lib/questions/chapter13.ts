import type { QuestionSeed } from "./catalog";

/**
 * Chapter 13 Contract Law scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented statutes, fees, or form-line text.
 */
export const PHASE5_CH13_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch13-q-validity-vs-status-of-contracts",
    stem: "Chapter 13 keeps Validity of Contracts and Status of Contracts as separate headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 13,
    examCategoryCodes: ["VI"],
    pair: { a: "validity-of-contracts", b: "status-of-contracts" },
    citationSlugs: ["validity-of-contracts", "status-of-contracts"],
    options: [
      {
        key: "A",
        body: "Validity of Contracts and Status of Contracts are interchangeable labels for one Chapter 13 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 13 keeps Validity of Contracts and Status of Contracts as separate headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Status of Contracts appears only under Chapter 5 fair-housing notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Validity of Contracts is only a Chapter 14 trust-account heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses Validity and Status of Contracts; Chapter 13 keeps them as separate headings.",
    remediationDistinction:
      "Ask which heading fits: Validity of Contracts or Status of Contracts.",
  },
  {
    slug: "ch13-q-creation-termination-vs-status",
    stem: "Chapter 13 separates Creation and Termination of Contracts from Status of Contracts. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 13,
    examCategoryCodes: ["VI"],
    pair: { a: "creation-and-termination-of-contracts", b: "status-of-contracts" },
    citationSlugs: ["creation-and-termination-of-contracts", "status-of-contracts"],
    options: [
      {
        key: "A",
        body: "Creation and Termination of Contracts and Status of Contracts share one interchangeable heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 13 separates Creation and Termination of Contracts from Status of Contracts.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Creation and Termination of Contracts appears only under Chapter 6 valuation notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Status of Contracts is only a Chapter 2 antitrust heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 13 keeps Creation and Termination of Contracts and Status of Contracts as separate headings.",
    remediationDistinction:
      "Name which heading fits: Creation and Termination of Contracts or Status of Contracts.",
  },
  {
    slug: "ch13-q-approved-forms-vs-wra-drafting-tools",
    stem: "Chapter 13 lists Approved Forms and Legal Advice separately from WRA Contract Drafting Tools for Licensees. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 13,
    examCategoryCodes: ["VI"],
    pair: { a: "approved-forms-and-legal-advice", b: "wra-contract-drafting-tools" },
    citationSlugs: ["approved-forms-and-legal-advice", "wra-contract-drafting-tools"],
    options: [
      {
        key: "A",
        body: "Treat Approved Forms and Legal Advice and WRA Contract Drafting Tools as one Chapter 13 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which heading fits — Approved Forms and Legal Advice or WRA Contract Drafting Tools for Licensees — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 9 wetlands headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "WRA Contract Drafting Tools appear only under Chapter 4 radon notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 13 keeps Approved Forms and Legal Advice and WRA Contract Drafting Tools as separate headings.",
    remediationDistinction:
      "Ask which heading fits: Approved Forms and Legal Advice or WRA Contract Drafting Tools for Licensees.",
  },
  {
    slug: "ch13-q-conveyance-vs-validity",
    stem: "Chapter 13 keeps Conveyance of Real Property distinct from Validity of Contracts. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 13,
    examCategoryCodes: ["VI"],
    pair: { a: "conveyance-of-real-property", b: "validity-of-contracts" },
    citationSlugs: ["conveyance-of-real-property", "validity-of-contracts"],
    options: [
      {
        key: "A",
        body: "Conveyance of Real Property and Validity of Contracts are one interchangeable Chapter 13 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 13 keeps Conveyance of Real Property distinct from Validity of Contracts.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Conveyance of Real Property appears only under Chapter 3 WB-36 notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Validity of Contracts is only a Chapter 7 trade-fixtures heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges Conveyance of Real Property with Validity of Contracts; Chapter 13 keeps them separate.",
    remediationDistinction:
      "Ask which heading fits: Conveyance of Real Property or Validity of Contracts.",
  },
  {
    slug: "ch13-q-reeb-15-vs-approved-forms",
    stem: "Chapter 13 has separate headings for REEB 15 copies/records and Approved Forms and Legal Advice. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 13,
    examCategoryCodes: ["VI"],
    pair: { a: "reeb-15-copies-and-records", b: "approved-forms-and-legal-advice" },
    citationSlugs: ["reeb-15-copies-and-records", "approved-forms-and-legal-advice"],
    options: [
      {
        key: "A",
        body: "Name which Chapter 13 heading fits — REEB 15 copies/records or Approved Forms and Legal Advice.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat REEB 15 copies/records and Approved Forms and Legal Advice as one heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 14 trust-account headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Approved Forms and Legal Advice is not taught in Chapter 13.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 13 keeps REEB 15 copies/records and Approved Forms and Legal Advice as separate headings.",
    remediationDistinction:
      "Ask which heading fits: REEB 15 copies/records or Approved Forms and Legal Advice.",
  },
];
