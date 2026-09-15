import type { QuestionSeed } from "./catalog";

/**
 * Chapter 11 Financing scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented formulas, dollar fees, or statutes.
 */
export const PHASE5_CH11_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch11-q-conventional-vs-nonconforming",
    stem: "Chapter 11 lists Conventional Financing and Nonconforming Loans as separate headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 11,
    examCategoryCodes: ["III"],
    pair: { a: "conventional-financing", b: "nonconforming-loans" },
    citationSlugs: ["conventional-financing", "nonconforming-loans"],
    options: [
      {
        key: "A",
        body: "Conventional Financing and Nonconforming Loans are interchangeable labels for one Chapter 11 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 11 lists Conventional Financing and Nonconforming Loans as separate headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Nonconforming Loans appear only under Chapter 5 fair-housing notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Conventional Financing is only a Chapter 14 trust-account heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses Conventional Financing and Nonconforming Loans; Chapter 11 keeps them separate.",
    remediationDistinction:
      "Ask which financing heading fits: Conventional Financing or Nonconforming Loans.",
  },
  {
    slug: "ch11-q-conventional-vs-government-financing",
    stem: "Chapter 11 separates Conventional Financing from Government Financing. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 11,
    examCategoryCodes: ["III"],
    pair: { a: "conventional-financing", b: "government-financing" },
    citationSlugs: ["conventional-financing", "government-financing"],
    options: [
      {
        key: "A",
        body: "Conventional Financing and Government Financing share one interchangeable Chapter 11 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 11 separates Conventional Financing from Government Financing.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Government Financing appears only under Chapter 6 valuation notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Conventional Financing is only a Chapter 2 antitrust heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 11 keeps Conventional Financing and Government Financing as separate headings.",
    remediationDistinction:
      "Name which financing heading fits: Conventional Financing or Government Financing.",
  },
  {
    slug: "ch11-q-seller-vs-conventional-financing",
    stem: "Chapter 11 keeps Seller Financing and Conventional Financing as separate headings. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 11,
    examCategoryCodes: ["III"],
    pair: { a: "seller-financing", b: "conventional-financing" },
    citationSlugs: ["seller-financing", "conventional-financing"],
    options: [
      {
        key: "A",
        body: "Treat Seller Financing and Conventional Financing as one Chapter 11 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which financing heading fits — Seller Financing or Conventional Financing — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 9 wetlands headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Seller Financing appears only under Chapter 4 radon notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 11 keeps Seller Financing and Conventional Financing as separate headings.",
    remediationDistinction:
      "Ask which financing heading fits: Seller Financing or Conventional Financing.",
  },
  {
    slug: "ch11-q-foreclosure-vs-deed-in-lieu",
    stem: "Chapter 11 notes separate Foreclosure from Deed in Lieu of Foreclosure. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 11,
    examCategoryCodes: ["III"],
    pair: { a: "foreclosure", b: "deed-in-lieu-of-foreclosure" },
    citationSlugs: ["foreclosure", "deed-in-lieu-of-foreclosure"],
    options: [
      {
        key: "A",
        body: "Foreclosure and Deed in Lieu of Foreclosure are one interchangeable Chapter 11 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 11 notes separate Foreclosure from Deed in Lieu of Foreclosure.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Deed in Lieu of Foreclosure appears only under Chapter 3 WB-36 notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Foreclosure is only a Chapter 7 trade-fixtures heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges Foreclosure with Deed in Lieu; Chapter 11 keeps them as separate headings.",
    remediationDistinction:
      "Ask which heading fits: Foreclosure or Deed in Lieu of Foreclosure.",
  },
  {
    slug: "ch11-q-tila-vs-respa",
    stem: "Chapter 11 has separate TILA/Regulation Z and RESPA headings under financing legislation. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 11,
    examCategoryCodes: ["III"],
    pair: { a: "tila-regulation-z", b: "respa" },
    citationSlugs: ["tila-regulation-z", "respa"],
    options: [
      {
        key: "A",
        body: "Name which financing-legislation heading fits — TILA/Regulation Z or RESPA.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat TILA/Regulation Z and RESPA as one interchangeable heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 14 trust-account headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "RESPA is not taught in Chapter 11.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 11 keeps TILA/Regulation Z and RESPA as separate financing-legislation headings.",
    remediationDistinction:
      "Ask which financing-legislation heading fits: TILA/Regulation Z or RESPA.",
  },
  {
    slug: "ch11-q-respa-vs-trid",
    stem: "Chapter 11 separates RESPA from TILA/RESPA Integrated Disclosure (TRID). Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 11,
    examCategoryCodes: ["III"],
    pair: { a: "respa", b: "trid" },
    citationSlugs: ["respa", "trid"],
    options: [
      {
        key: "A",
        body: "RESPA and TRID share one Chapter 11 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 11 separates RESPA from TILA/RESPA Integrated Disclosure (TRID).",
        isCorrect: true,
      },
      {
        key: "C",
        body: "TRID appears only under Chapter 8 quitclaim-deed notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "RESPA is only a Chapter 5 ADA heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 11 keeps RESPA and TRID as separate headings.",
    remediationDistinction:
      "Name which heading the item fits: RESPA or TILA/RESPA Integrated Disclosure (TRID).",
  },
];
