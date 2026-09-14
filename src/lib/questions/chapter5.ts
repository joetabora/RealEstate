import type { QuestionSeed } from "./catalog";

/**
 * Chapter 5 Fair Housing scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented statutes, fees, or form-line text.
 */
export const PHASE5_CH5_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch5-q-prohibited-vs-permissible-fair-housing",
    stem: "Chapter 5 notes list prohibited and permissible fair housing conduct as separate headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 5,
    examCategoryCodes: ["VIII"],
    pair: { a: "prohibited-under-fair-housing", b: "permissible-under-fair-housing" },
    citationSlugs: ["prohibited-under-fair-housing", "permissible-under-fair-housing"],
    options: [
      {
        key: "A",
        body: "Prohibited and permissible fair housing conduct share one interchangeable Chapter 5 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 5 notes list prohibited and permissible fair housing conduct as separate headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Permissible conduct appears only under Chapter 14 trust-account headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Prohibited conduct is only a Chapter 2 antitrust heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses prohibited and permissible conduct; Chapter 5 keeps them as separate headings.",
    remediationDistinction:
      "Ask which fair-housing conduct heading fits: prohibited or permissible.",
  },
  {
    slug: "ch5-q-fair-housing-law-vs-ada",
    stem: "Chapter 5 has separate Fair Housing Law and ADA headings. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 5,
    examCategoryCodes: ["VIII"],
    pair: { a: "fair-housing-law", b: "americans-with-disabilities-act" },
    citationSlugs: ["fair-housing-law", "americans-with-disabilities-act"],
    options: [
      {
        key: "A",
        body: "Fair Housing Law and the ADA are one interchangeable Chapter 5 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 5 keeps separate Fair Housing Law and ADA headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "The ADA appears only under Chapter 4 radon notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Fair Housing Law is only a Chapter 11 financing heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 5 keeps Fair Housing Law and the ADA as separate headings.",
    remediationDistinction:
      "Name which heading the item fits: Fair Housing Law or the ADA.",
  },
  {
    slug: "ch5-q-advertising-vs-demographic-data",
    stem: "Chapter 5 notes separate Advertising from Use of Demographic Data Relating to Protected Classes. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 5,
    examCategoryCodes: ["VIII"],
    pair: { a: "fair-housing-advertising", b: "demographic-data-protected-classes" },
    citationSlugs: ["fair-housing-advertising", "demographic-data-protected-classes"],
    options: [
      {
        key: "A",
        body: "Treat advertising and demographic-data use as one fair-housing heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which heading fits — Advertising or Use of Demographic Data Relating to Protected Classes — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 3 WB-1 Included Items heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Demographic-data use appears only under Chapter 6 valuation notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 5 notes keep Advertising and demographic-data use as separate headings.",
    remediationDistinction:
      "Ask which heading fits: Advertising or Use of Demographic Data Relating to Protected Classes.",
  },
  {
    slug: "ch5-q-complaints-vs-office-procedures",
    stem: "Chapter 5 separates Handling Complaints from Establishing Office Procedures Regarding Fair Housing. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 5,
    examCategoryCodes: ["VIII"],
    pair: { a: "handling-fair-housing-complaints", b: "fair-housing-office-procedures" },
    citationSlugs: ["handling-fair-housing-complaints", "fair-housing-office-procedures"],
    options: [
      {
        key: "A",
        body: "Name which practice heading fits — Handling Complaints or Establishing Office Procedures Regarding Fair Housing.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat complaints handling and office procedures as one interchangeable heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 14 trust-account headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Office procedures regarding fair housing are not taught in Chapter 5.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 5 keeps Handling Complaints and Establishing Office Procedures as separate headings.",
    remediationDistinction:
      "Ask which practice heading fits: Handling Complaints or Establishing Office Procedures Regarding Fair Housing.",
  },
  {
    slug: "ch5-q-wisconsin-protected-classes-vs-fair-housing-law",
    stem: "Chapter 5 notes place Wisconsin’s 13 Protected Classes under Fair Housing Law as its own heading. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 5,
    examCategoryCodes: ["VIII"],
    pair: { a: "wisconsin-protected-classes", b: "fair-housing-law" },
    citationSlugs: ["wisconsin-protected-classes", "fair-housing-law"],
    options: [
      {
        key: "A",
        body: "Wisconsin’s 13 Protected Classes and Fair Housing Law are one merged notes heading with no separate label.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 5 notes place Wisconsin’s 13 Protected Classes under Fair Housing Law as its own heading.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Wisconsin’s 13 Protected Classes appear only under Chapter 2 price-fixing notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Fair Housing Law is only a Chapter 4 asbestos heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 5 keeps Wisconsin’s 13 Protected Classes as its own heading under Fair Housing Law.",
    remediationDistinction:
      "Name whether the item is testing the Fair Housing Law heading or Wisconsin’s 13 Protected Classes heading.",
  },
];
