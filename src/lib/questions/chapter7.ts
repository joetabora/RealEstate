import type { QuestionSeed } from "./catalog";

/**
 * Chapter 7 Real Property Ownership scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented statutes, fees, or form-line text.
 */
export const PHASE5_CH7_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch7-q-fixtures-vs-trade-fixtures",
    stem: "Chapter 7 notes list Fixtures and Trade Fixtures as separate headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 7,
    examCategoryCodes: ["I"],
    pair: { a: "property-fixtures", b: "trade-fixtures" },
    citationSlugs: ["property-fixtures", "trade-fixtures"],
    options: [
      {
        key: "A",
        body: "Fixtures and Trade Fixtures are interchangeable labels for one Chapter 7 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 7 notes list Fixtures and Trade Fixtures as separate headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Trade Fixtures appear only under Chapter 5 fair-housing notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Fixtures are only a Chapter 14 trust-account heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses Fixtures and Trade Fixtures; Chapter 7 keeps them as separate headings.",
    remediationDistinction:
      "Ask which heading fits: Fixtures or Trade Fixtures.",
  },
  {
    slug: "ch7-q-freehold-vs-leasehold-estates",
    stem: "Chapter 7 separates Freehold Estates from Leasehold Estates under Estates in Land. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 7,
    examCategoryCodes: ["I"],
    pair: { a: "freehold-estates", b: "leasehold-estates" },
    citationSlugs: ["freehold-estates", "leasehold-estates"],
    options: [
      {
        key: "A",
        body: "Freehold Estates and Leasehold Estates share one interchangeable Chapter 7 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 7 separates Freehold Estates from Leasehold Estates under Estates in Land.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Leasehold Estates appear only under Chapter 11 financing notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Freehold Estates are only a Chapter 2 antitrust heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 7 keeps Freehold Estates and Leasehold Estates as separate headings.",
    remediationDistinction:
      "Name which estates-in-land heading fits: Freehold Estates or Leasehold Estates.",
  },
  {
    slug: "ch7-q-condo-vs-cooperative-ownership",
    stem: "Chapter 7 has separate Condominium Ownership and Cooperative Ownership headings. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 7,
    examCategoryCodes: ["I"],
    pair: { a: "condominium-ownership", b: "cooperative-ownership" },
    citationSlugs: ["condominium-ownership", "cooperative-ownership"],
    options: [
      {
        key: "A",
        body: "Treat condominium ownership and cooperative ownership as one Chapter 7 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which ownership heading fits — Condominium Ownership or Cooperative Ownership — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 6 valuation headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Cooperative Ownership appears only under Chapter 4 radon notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 7 keeps Condominium Ownership and Cooperative Ownership as separate headings.",
    remediationDistinction:
      "Ask which ownership heading fits: Condominium Ownership or Cooperative Ownership.",
  },
  {
    slug: "ch7-q-condo-vs-time-share-ownership",
    stem: "Chapter 7 separates Condominium Ownership from Time-Share Ownership. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 7,
    examCategoryCodes: ["I"],
    pair: { a: "condominium-ownership", b: "time-share-ownership" },
    citationSlugs: ["condominium-ownership", "time-share-ownership"],
    options: [
      {
        key: "A",
        body: "Condominium Ownership and Time-Share Ownership are one interchangeable heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 7 separates Condominium Ownership from Time-Share Ownership.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Time-Share Ownership appears only under Wisconsin Marital Property.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Condominium Ownership is only a Chapter 3 WB-1 Included Items heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges condominium and time-share ownership; Chapter 7 keeps them separate.",
    remediationDistinction:
      "Ask which ownership heading fits: Condominium Ownership or Time-Share Ownership.",
  },
  {
    slug: "ch7-q-marital-property-vs-management-and-control",
    stem: "Chapter 7 notes place Wisconsin Marital Property and Management and Control as separate headings. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 7,
    examCategoryCodes: ["I"],
    pair: { a: "wisconsin-marital-property", b: "management-and-control" },
    citationSlugs: ["wisconsin-marital-property", "management-and-control"],
    options: [
      {
        key: "A",
        body: "Name which Wisconsin ownership heading fits — Wisconsin Marital Property or Management and Control.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat Wisconsin Marital Property and Management and Control as one heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 14 trust-account headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Management and Control is not taught in Chapter 7.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 7 keeps Wisconsin Marital Property and Management and Control as separate headings.",
    remediationDistinction:
      "Ask which Wisconsin ownership heading fits: Wisconsin Marital Property or Management and Control.",
  },
  {
    slug: "ch7-q-real-vs-personal-property-vs-fixtures",
    stem: "Chapter 7 separates Real Versus Personal Property from the Fixtures heading. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 7,
    examCategoryCodes: ["I"],
    pair: { a: "real-versus-personal-property", b: "property-fixtures" },
    citationSlugs: ["real-versus-personal-property", "property-fixtures"],
    options: [
      {
        key: "A",
        body: "Real Versus Personal Property and Fixtures share one Chapter 7 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 7 separates Real Versus Personal Property from the Fixtures heading.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Fixtures appear only under Time-Share Ownership.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Real Versus Personal Property is only a Chapter 5 ADA heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 7 keeps Real Versus Personal Property and Fixtures as separate headings.",
    remediationDistinction:
      "Name which heading the item fits: Real Versus Personal Property or Fixtures.",
  },
];
