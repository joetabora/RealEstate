import type { QuestionSeed } from "./catalog";

/**
 * Chapter 9 Land Use scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented statutes, fees, or form-line text.
 */
export const PHASE5_CH9_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch9-q-permitted-vs-conditional-uses",
    stem: "Chapter 9 notes list Permitted Uses and Conditional Uses as separate zoning headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 9,
    examCategoryCodes: ["II"],
    pair: { a: "permitted-uses", b: "conditional-uses" },
    citationSlugs: ["permitted-uses", "conditional-uses"],
    options: [
      {
        key: "A",
        body: "Permitted Uses and Conditional Uses are interchangeable labels for one Chapter 9 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 9 notes list Permitted Uses and Conditional Uses as separate zoning headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Conditional Uses appear only under Chapter 5 fair-housing notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Permitted Uses are only a Chapter 14 trust-account heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses Permitted Uses and Conditional Uses; Chapter 9 keeps them as separate headings.",
    remediationDistinction:
      "Ask which zoning heading fits: Permitted Uses or Conditional Uses.",
  },
  {
    slug: "ch9-q-variances-vs-nonconforming-use",
    stem: "Chapter 9 separates Variances from Nonconforming Use. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 9,
    examCategoryCodes: ["II"],
    pair: { a: "variances", b: "nonconforming-use" },
    citationSlugs: ["variances", "nonconforming-use"],
    options: [
      {
        key: "A",
        body: "Variances and Nonconforming Use share one interchangeable Chapter 9 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 9 separates Variances from Nonconforming Use.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Nonconforming Use appears only under Chapter 6 valuation notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Variances are only a Chapter 2 antitrust heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 9 keeps Variances and Nonconforming Use as separate headings.",
    remediationDistinction:
      "Name which heading fits: Variances or Nonconforming Use.",
  },
  {
    slug: "ch9-q-spot-zoning-vs-downzoning",
    stem: "Chapter 9 keeps Spot Zoning and Downzoning as separate headings. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 9,
    examCategoryCodes: ["II"],
    pair: { a: "spot-zoning", b: "downzoning" },
    citationSlugs: ["spot-zoning", "downzoning"],
    options: [
      {
        key: "A",
        body: "Treat Spot Zoning and Downzoning as one Chapter 9 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which zoning heading fits — Spot Zoning or Downzoning — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 11 financing headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Downzoning appears only under Chapter 4 radon notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 9 keeps Spot Zoning and Downzoning as separate headings.",
    remediationDistinction:
      "Ask which zoning heading fits: Spot Zoning or Downzoning.",
  },
  {
    slug: "ch9-q-shoreland-zoning-vs-wetlands",
    stem: "Chapter 9 separates Shoreland Zoning from Wetlands under water-related land use. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 9,
    examCategoryCodes: ["II"],
    pair: { a: "shoreland-zoning", b: "wetlands" },
    citationSlugs: ["shoreland-zoning", "wetlands"],
    options: [
      {
        key: "A",
        body: "Shoreland Zoning and Wetlands are one interchangeable Chapter 9 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 9 separates Shoreland Zoning from Wetlands under water-related land use.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Wetlands appear only under Chapter 3 WB-36 notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Shoreland Zoning is only a Chapter 7 trade-fixtures heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges Shoreland Zoning with Wetlands; Chapter 9 keeps them as separate headings.",
    remediationDistinction:
      "Ask which water-related land-use heading fits: Shoreland Zoning or Wetlands.",
  },
  {
    slug: "ch9-q-deed-conditions-vs-deed-restrictions",
    stem: "Chapter 9 notes list Deed Conditions and Deed Restrictions as separate private control headings. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 9,
    examCategoryCodes: ["II"],
    pair: { a: "deed-conditions", b: "deed-restrictions" },
    citationSlugs: ["deed-conditions", "deed-restrictions"],
    options: [
      {
        key: "A",
        body: "Name which private-control heading fits — Deed Conditions or Deed Restrictions.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat Deed Conditions and Deed Restrictions as one heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 14 trust-account headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Deed Restrictions are not taught in Chapter 9.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 9 keeps Deed Conditions and Deed Restrictions as separate private control headings.",
    remediationDistinction:
      "Ask which private-control heading fits: Deed Conditions or Deed Restrictions.",
  },
  {
    slug: "ch9-q-wisconsin-zoning-basics-vs-zoning",
    stem: "Chapter 9 has separate Wisconsin Zoning Law Basics and Zoning headings. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 9,
    examCategoryCodes: ["II"],
    pair: { a: "wisconsin-zoning-law-basics", b: "zoning" },
    citationSlugs: ["wisconsin-zoning-law-basics", "zoning"],
    options: [
      {
        key: "A",
        body: "Wisconsin Zoning Law Basics and Zoning share one Chapter 9 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 9 keeps separate Wisconsin Zoning Law Basics and Zoning headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Zoning appears only under Chapter 8 quitclaim-deed notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Wisconsin Zoning Law Basics is only a Chapter 5 ADA heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 9 keeps Wisconsin Zoning Law Basics and Zoning as separate headings.",
    remediationDistinction:
      "Name which heading the item fits: Wisconsin Zoning Law Basics or Zoning.",
  },
];
