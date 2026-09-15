import type { QuestionSeed } from "./catalog";

/**
 * Chapter 8 Title of Real Estate scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented statutes, fees, tax formulas, or form-line text.
 */
export const PHASE5_CH8_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch8-q-warranty-vs-quitclaim-deed",
    stem: "Chapter 8 notes list Warranty Deed and Quitclaim Deed as separate deed headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 8,
    examCategoryCodes: ["I"],
    pair: { a: "warranty-deed", b: "quitclaim-deed" },
    citationSlugs: ["warranty-deed", "quitclaim-deed"],
    options: [
      {
        key: "A",
        body: "Warranty Deed and Quitclaim Deed are interchangeable labels for one Chapter 8 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 8 notes list Warranty Deed and Quitclaim Deed as separate deed headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Quitclaim Deed appears only under Chapter 5 fair-housing notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Warranty Deed is only a Chapter 14 trust-account heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses Warranty Deed and Quitclaim Deed; Chapter 8 keeps them as separate headings.",
    remediationDistinction:
      "Ask which deed heading fits: Warranty Deed or Quitclaim Deed.",
  },
  {
    slug: "ch8-q-personal-representative-vs-trustee-deed",
    stem: "Chapter 8 separates Personal Representative’s Deed from Trustee’s Deed under Deeds. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 8,
    examCategoryCodes: ["I"],
    pair: { a: "personal-representative-deed", b: "trustee-deed" },
    citationSlugs: ["personal-representative-deed", "trustee-deed"],
    options: [
      {
        key: "A",
        body: "Personal Representative’s Deed and Trustee’s Deed share one interchangeable Chapter 8 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 8 separates Personal Representative’s Deed from Trustee’s Deed under Deeds.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Trustee’s Deed appears only under Chapter 6 valuation notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Personal Representative’s Deed is only a Chapter 2 antitrust heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 8 keeps Personal Representative’s Deed and Trustee’s Deed as separate headings.",
    remediationDistinction:
      "Name which deed heading fits: Personal Representative’s Deed or Trustee’s Deed.",
  },
  {
    slug: "ch8-q-easements-vs-encroachments",
    stem: "Chapter 8 keeps Easements and Encroachments as separate encumbrance headings. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 8,
    examCategoryCodes: ["I"],
    pair: { a: "easements", b: "encroachments" },
    citationSlugs: ["easements", "encroachments"],
    options: [
      {
        key: "A",
        body: "Treat Easements and Encroachments as one Chapter 8 encumbrance heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which encumbrance heading fits — Easements or Encroachments — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 11 financing headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Encroachments appear only under Chapter 4 radon notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 8 keeps Easements and Encroachments as separate encumbrance headings.",
    remediationDistinction:
      "Ask which encumbrance heading fits: Easements or Encroachments.",
  },
  {
    slug: "ch8-q-easements-vs-liens",
    stem: "Chapter 8 separates Easements from Liens under encumbrances to title. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 8,
    examCategoryCodes: ["I"],
    pair: { a: "easements", b: "liens" },
    citationSlugs: ["easements", "liens"],
    options: [
      {
        key: "A",
        body: "Easements and Liens are one interchangeable Chapter 8 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 8 separates Easements from Liens under encumbrances to title.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Liens appear only under Chapter 3 WB-36 notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Easements are only a Chapter 7 trade-fixtures heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges Easements with Liens; Chapter 8 keeps them as separate encumbrance headings.",
    remediationDistinction:
      "Ask which encumbrance heading fits: Easements or Liens.",
  },
  {
    slug: "ch8-q-evidence-of-title-vs-forms",
    stem: "Chapter 8 has separate Evidence of Title and Forms of Title Evidence headings. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 8,
    examCategoryCodes: ["I"],
    pair: { a: "evidence-of-title", b: "forms-of-title-evidence" },
    citationSlugs: ["evidence-of-title", "forms-of-title-evidence"],
    options: [
      {
        key: "A",
        body: "Name which title-evidence heading fits — Evidence of Title or Forms of Title Evidence.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat Evidence of Title and Forms of Title Evidence as one heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 14 trust-account headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Forms of Title Evidence is not taught in Chapter 8.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 8 keeps Evidence of Title and Forms of Title Evidence as separate headings.",
    remediationDistinction:
      "Ask which title-evidence heading fits: Evidence of Title or Forms of Title Evidence.",
  },
  {
    slug: "ch8-q-forms-vs-standard-title-insurance-exceptions",
    stem: "Chapter 8 separates Forms of Title Evidence from Standard Title Insurance Exceptions. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 8,
    examCategoryCodes: ["I"],
    pair: { a: "forms-of-title-evidence", b: "standard-title-insurance-exceptions" },
    citationSlugs: ["forms-of-title-evidence", "standard-title-insurance-exceptions"],
    options: [
      {
        key: "A",
        body: "Forms of Title Evidence and Standard Title Insurance Exceptions share one Chapter 8 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 8 separates Forms of Title Evidence from Standard Title Insurance Exceptions.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Standard Title Insurance Exceptions appear only under Quitclaim Deed.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Forms of Title Evidence is only a Chapter 5 ADA heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 8 keeps Forms of Title Evidence and Standard Title Insurance Exceptions as separate headings.",
    remediationDistinction:
      "Name which heading the item fits: Forms of Title Evidence or Standard Title Insurance Exceptions.",
  },
];
