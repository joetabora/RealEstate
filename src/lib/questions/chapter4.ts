import type { QuestionSeed } from "./catalog";

/**
 * Chapter 4 Disclosure Obligations scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented statutes, fees, or form-line text.
 */
export const PHASE5_CH4_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch4-q-owner-vs-licensee-disclosure",
    stem: "Chapter 4 separates owner disclosure headings from licensee disclosure obligations. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 4,
    examCategoryCodes: ["V", "VI"],
    pair: { a: "disclosure-by-owners", b: "licensee-disclosure-obligations" },
    citationSlugs: ["disclosure-by-owners", "licensee-disclosure-obligations"],
    options: [
      {
        key: "A",
        body: "Owner disclosure and licensee disclosure obligations are one interchangeable Chapter 4 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 4 separates owner disclosure headings from licensee disclosure obligations.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Licensee disclosure obligations appear only under fair-housing headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Owner disclosure is only a Chapter 14 trust-account heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses owner disclosure with licensee obligations; Chapter 4 keeps them separate.",
    remediationDistinction:
      "Ask which disclosure heading fits: owner disclosure or licensee disclosure obligations.",
  },
  {
    slug: "ch4-q-seller-completion-vs-amending-recr",
    stem: "Chapter 4 notes list seller completion of an RECR and amending an RECR as separate headings. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 4,
    examCategoryCodes: ["V", "VI"],
    pair: { a: "seller-completion-of-recr", b: "amending-an-recr" },
    citationSlugs: ["seller-completion-of-recr", "amending-an-recr"],
    options: [
      {
        key: "A",
        body: "Treat seller completion of an RECR and amending an RECR as one notes heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which RECR heading fits — seller completion or amending — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the radon environmental heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Amending an RECR appears only in Chapter 11 Financing.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 4 notes keep seller completion of an RECR and amending an RECR as separate headings.",
    remediationDistinction:
      "Ask which RECR heading fits: seller completion or amending.",
  },
  {
    slug: "ch4-q-as-is-sales-vs-disclosure-by-owners",
    stem: "Chapter 4 has a separate “As-is” Sales heading next to Disclosure by Owners of Real Estate. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 4,
    examCategoryCodes: ["V", "VI"],
    pair: { a: "as-is-sales", b: "disclosure-by-owners" },
    citationSlugs: ["as-is-sales", "disclosure-by-owners"],
    options: [
      {
        key: "A",
        body: "“As-is” Sales and Disclosure by Owners share one Chapter 4 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 4 keeps a separate “As-is” Sales heading next to Disclosure by Owners of Real Estate.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "“As-is” Sales is only a condominium-documents heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Disclosure by Owners appears only under Chapter 2 antitrust notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges “As-is” Sales with Disclosure by Owners; Chapter 4 keeps them as separate headings.",
    remediationDistinction:
      "Chapter 4 has a separate “As-is” Sales heading next to Disclosure by Owners of Real Estate.",
  },
  {
    slug: "ch4-q-buyer-rescission-vs-amending-recr",
    stem: "Chapter 4 notes distinguish buyer rescission from amending an RECR. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 4,
    examCategoryCodes: ["V", "VI"],
    pair: { a: "buyer-rescission", b: "amending-an-recr" },
    citationSlugs: ["buyer-rescission", "amending-an-recr"],
    options: [
      {
        key: "A",
        body: "Buyer rescission and amending an RECR are interchangeable Chapter 4 labels.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 4 notes distinguish buyer rescission from amending an RECR.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Buyer rescission is only a lead-based-paint heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Amending an RECR means the same as licensee disclosure obligations.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 4 keeps buyer rescission and amending an RECR as separate headings.",
    remediationDistinction:
      "Name which heading the item fits: buyer rescission or amending an RECR.",
  },
  {
    slug: "ch4-q-condo-disclosure-vs-owner-disclosure",
    stem: "Chapter 4 lists condominium disclosure requirements separately from owner RECR disclosure. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 4,
    examCategoryCodes: ["V", "VI"],
    pair: { a: "condominium-disclosure-requirements", b: "disclosure-by-owners" },
    citationSlugs: ["condominium-disclosure-requirements", "disclosure-by-owners"],
    options: [
      {
        key: "A",
        body: "Name which disclosure track fits — condominium disclosure requirements or owner RECR disclosure.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat condominium disclosure and owner RECR disclosure as one heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 14 trust-account headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Condominium disclosure requirements are not taught in Chapter 4.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 4 keeps condominium disclosure requirements separate from owner RECR disclosure.",
    remediationDistinction:
      "Ask which disclosure track fits: condominium disclosure requirements or owner RECR disclosure.",
  },
  {
    slug: "ch4-q-executive-summary-vs-condo-documents",
    stem: "Chapter 4 notes list Executive Summary and Condominium Documents as separate condo disclosure headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 4,
    examCategoryCodes: ["V", "VI"],
    pair: { a: "executive-summary", b: "condominium-documents" },
    citationSlugs: ["executive-summary", "condominium-documents"],
    options: [
      {
        key: "A",
        body: "Executive Summary and Condominium Documents are one interchangeable condo heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 4 notes list Executive Summary and Condominium Documents as separate condo disclosure headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Executive Summary appears only under asbestos environmental notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Condominium Documents are only a Chapter 3 WB-1 Included Items heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges Executive Summary with Condominium Documents; Chapter 4 keeps them separate.",
    remediationDistinction:
      "Ask which condo disclosure heading fits: Executive Summary or Condominium Documents.",
  },
  {
    slug: "ch4-q-lead-based-paint-vs-asbestos",
    stem: "Chapter 4 notes list lead-based paint and asbestos as separate environmental concern headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 4,
    examCategoryCodes: ["V"],
    pair: { a: "lead-based-paint", b: "asbestos" },
    citationSlugs: ["lead-based-paint", "asbestos"],
    options: [
      {
        key: "A",
        body: "Lead-based paint and asbestos share one Chapter 4 environmental heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 4 notes list lead-based paint and asbestos as separate environmental concern headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Asbestos is only an amending-an-RECR heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Lead-based paint appears only under Chapter 5 fair housing.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 4 keeps lead-based paint and asbestos as separate environmental concern headings.",
    remediationDistinction:
      "Name which environmental heading the item fits: lead-based paint or asbestos.",
  },
  {
    slug: "ch4-q-radon-vs-mold",
    stem: "Chapter 4 notes list radon and mold as separate environmental concern headings. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 4,
    examCategoryCodes: ["V"],
    pair: { a: "radon", b: "mold" },
    citationSlugs: ["radon", "mold"],
    options: [
      {
        key: "A",
        body: "Radon and mold are interchangeable labels under one Chapter 4 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 4 notes list radon and mold as separate environmental concern headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Mold is only a condominium Executive Summary heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Radon appears only under licensee disclosure obligations.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses radon and mold; Chapter 4 keeps them as separate environmental headings.",
    remediationDistinction:
      "Chapter 4 notes list radon and mold as separate environmental concern headings.",
  },
];
