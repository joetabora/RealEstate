import type { QuestionSeed } from "./catalog";

/**
 * Chapter 10 Offers to Purchase scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented statutes, fees, or form-line text.
 */
export const PHASE5_CH10_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch10-q-wb11-vs-wb14-offer",
    stem: "Chapter 10 has separate WB-11 Residential and WB-14 Condominium offer headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 10,
    examCategoryCodes: ["VI"],
    pair: { a: "wb-11-residential-offer", b: "wb-14-condominium-offer" },
    citationSlugs: ["wb-11-residential-offer", "wb-14-condominium-offer"],
    options: [
      {
        key: "A",
        body: "WB-11 Residential and WB-14 Condominium offers share one interchangeable Chapter 10 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 10 keeps separate WB-11 Residential and WB-14 Condominium offer headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "WB-14 Condominium offer appears only under Chapter 5 fair-housing notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "WB-11 Residential offer is only a Chapter 14 trust-account heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges WB-11 and WB-14; Chapter 10 keeps them as separate offer headings.",
    remediationDistinction:
      "Ask which offer heading fits: WB-11 Residential or WB-14 Condominium.",
  },
  {
    slug: "ch10-q-wb11-vs-wb13-offer",
    stem: "Chapter 10 separates WB-11 Residential from WB-13 Vacant Land Offer to Purchase. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 10,
    examCategoryCodes: ["VI"],
    pair: { a: "wb-11-residential-offer", b: "wb-13-vacant-land-offer" },
    citationSlugs: ["wb-11-residential-offer", "wb-13-vacant-land-offer"],
    options: [
      {
        key: "A",
        body: "WB-11 Residential and WB-13 Vacant Land are one interchangeable Chapter 10 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 10 separates WB-11 Residential from WB-13 Vacant Land Offer to Purchase.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "WB-13 Vacant Land offer appears only under Chapter 6 valuation notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "WB-11 Residential offer is only a Chapter 2 antitrust heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 10 keeps WB-11 Residential and WB-13 Vacant Land as separate offer headings.",
    remediationDistinction:
      "Name which offer heading fits: WB-11 Residential or WB-13 Vacant Land.",
  },
  {
    slug: "ch10-q-financing-commitment-vs-not-contingent",
    stem: "Chapter 10 notes list Financing Commitment Contingency and Offer Not Contingent on Financing as separate headings. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 10,
    examCategoryCodes: ["VI"],
    pair: { a: "financing-commitment-contingency", b: "offer-not-contingent-on-financing" },
    citationSlugs: ["financing-commitment-contingency", "offer-not-contingent-on-financing"],
    options: [
      {
        key: "A",
        body: "Treat Financing Commitment Contingency and Offer Not Contingent on Financing as one heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which financing heading fits — Financing Commitment Contingency or Offer Not Contingent on Financing — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 9 wetlands headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Offer Not Contingent on Financing appears only under Chapter 4 radon notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 10 notes keep those two financing headings separate.",
    remediationDistinction:
      "Ask which financing heading fits: Financing Commitment Contingency or Offer Not Contingent on Financing.",
  },
  {
    slug: "ch10-q-bump-clause-vs-secondary-offer",
    stem: "Chapter 10 notes keep Bump Clause and Secondary Offer as separate WB-11 headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 10,
    examCategoryCodes: ["VI"],
    pair: { a: "bump-clause", b: "secondary-offer" },
    citationSlugs: ["bump-clause", "secondary-offer"],
    options: [
      {
        key: "A",
        body: "Bump Clause and Secondary Offer are one interchangeable WB-11 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 10 notes keep Bump Clause and Secondary Offer as separate WB-11 headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Secondary Offer appears only under Chapter 3 WB-36 notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Bump Clause is only a Chapter 7 trade-fixtures heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges Bump Clause with Secondary Offer; Chapter 10 keeps them as separate headings.",
    remediationDistinction:
      "Ask which WB-11 heading fits: Bump Clause or Secondary Offer.",
  },
  {
    slug: "ch10-q-inspection-vs-appraisal-contingency",
    stem: "Chapter 10 notes separate Inspection Contingency from Appraisal Contingency. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 10,
    examCategoryCodes: ["VI"],
    pair: { a: "inspection-contingency", b: "appraisal-contingency" },
    citationSlugs: ["inspection-contingency", "appraisal-contingency"],
    options: [
      {
        key: "A",
        body: "Name which contingency heading fits — Inspection Contingency or Appraisal Contingency.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat Inspection Contingency and Appraisal Contingency as one heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 14 trust-account headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Appraisal Contingency is not taught in Chapter 10.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 10 keeps Inspection Contingency and Appraisal Contingency as separate headings.",
    remediationDistinction:
      "Ask which contingency heading fits: Inspection Contingency or Appraisal Contingency.",
  },
  {
    slug: "ch10-q-drafting-vs-presentation-of-offers",
    stem: "Chapter 10 separates Drafting and Submission of Offers from Presentation of Offers. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 10,
    examCategoryCodes: ["IV", "VI"],
    pair: { a: "drafting-and-submission-of-offers", b: "presentation-of-offers" },
    citationSlugs: ["drafting-and-submission-of-offers", "presentation-of-offers"],
    options: [
      {
        key: "A",
        body: "Drafting and Submission of Offers and Presentation of Offers share one Chapter 10 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 10 separates Drafting and Submission of Offers from Presentation of Offers.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Presentation of Offers appears only under Chapter 8 quitclaim-deed notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Drafting and Submission of Offers is only a Chapter 5 ADA heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 10 keeps Drafting and Submission of Offers and Presentation of Offers as separate headings.",
    remediationDistinction:
      "Name which offer-process heading fits: Drafting and Submission of Offers or Presentation of Offers.",
  },
];
