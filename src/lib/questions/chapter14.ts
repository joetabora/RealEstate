import type { QuestionSeed } from "./catalog";

/**
 * Chapter 14 Trust Accounts scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented deposit deadlines, interest rules, or statute text.
 */
export const PHASE5_CH14_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch14-q-client-vs-non-client-funds",
    stem: "Chapter 14’s Real Estate Funds heading names client funds and non-client funds as distinct labels. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 14,
    examCategoryCodes: ["X"],
    pair: { a: "client-funds", b: "non-client-funds" },
    citationSlugs: ["client-funds", "non-client-funds"],
    options: [
      {
        key: "A",
        body: "Client funds and non-client funds are interchangeable labels under one Chapter 14 funds heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 14’s Real Estate Funds heading names client funds and non-client funds as distinct labels.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Non-client funds appear only under Chapter 5 fair-housing notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Client funds are only a Chapter 11 financing heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses client funds and non-client funds; Chapter 14 keeps them as distinct labels.",
    remediationDistinction:
      "Ask which funds label fits: client funds or non-client funds.",
  },
  {
    slug: "ch14-q-reeb-18-vs-ibreta",
    stem: "Chapter 14 keeps REEB 18 Trust Accounts separate from the IBRETA heading. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 14,
    examCategoryCodes: ["X"],
    pair: { a: "reeb-18-trust-accounts", b: "ibreta" },
    citationSlugs: ["reeb-18-trust-accounts", "ibreta"],
    options: [
      {
        key: "A",
        body: "REEB 18 Trust Accounts and IBRETA share one interchangeable Chapter 14 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 14 keeps REEB 18 Trust Accounts separate from the IBRETA heading.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "IBRETA appears only under Chapter 6 valuation notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "REEB 18 Trust Accounts is only a Chapter 2 antitrust heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 14 keeps REEB 18 Trust Accounts and IBRETA as separate headings.",
    remediationDistinction:
      "Name which heading fits: REEB 18 Trust Accounts or IBRETA.",
  },
  {
    slug: "ch14-q-depositing-funds-vs-ibreta",
    stem: "Chapter 14 separates Depositing Funds from IBRETA. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 14,
    examCategoryCodes: ["X"],
    pair: { a: "depositing-funds", b: "ibreta" },
    citationSlugs: ["depositing-funds", "ibreta"],
    options: [
      {
        key: "A",
        body: "Treat Depositing Funds and IBRETA as one Chapter 14 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which heading fits — Depositing Funds or IBRETA — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 9 wetlands headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Depositing Funds appears only under Chapter 4 radon notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 14 keeps Depositing Funds and IBRETA as separate headings.",
    remediationDistinction:
      "Ask which heading fits: Depositing Funds or IBRETA.",
  },
  {
    slug: "ch14-q-client-funds-vs-depositing-funds",
    stem: "Chapter 14 lists Real Estate Funds (client/non-client) separately from Depositing Funds. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 14,
    examCategoryCodes: ["X"],
    pair: { a: "client-funds", b: "depositing-funds" },
    citationSlugs: ["client-funds", "depositing-funds"],
    options: [
      {
        key: "A",
        body: "Name which heading track fits — Real Estate Funds (client/non-client) or Depositing Funds.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat Real Estate Funds and Depositing Funds as one interchangeable heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 13 REEB 15 heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Depositing Funds is not taught in Chapter 14.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 14 keeps Real Estate Funds separate from Depositing Funds.",
    remediationDistinction:
      "Ask which heading track fits: Real Estate Funds (client/non-client) or Depositing Funds.",
  },
];
