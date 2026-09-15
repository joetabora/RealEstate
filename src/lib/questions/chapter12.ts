import type { QuestionSeed } from "./catalog";

/**
 * Chapter 12 Other Approved Forms scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented statutes, fees, or form-line text.
 */
export const PHASE5_CH12_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch12-q-wb44-vs-wb46",
    stem: "Chapter 12 keeps WB-44 Counter-Offer and WB-46 Multiple Counter-Proposal as separate headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 12,
    examCategoryCodes: ["VI"],
    pair: { a: "wb-44-counter-offer", b: "wb-46-multiple-counter-proposal" },
    citationSlugs: ["wb-44-counter-offer", "wb-46-multiple-counter-proposal"],
    options: [
      {
        key: "A",
        body: "WB-44 Counter-Offer and WB-46 Multiple Counter-Proposal are interchangeable labels for one Chapter 12 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 12 keeps WB-44 Counter-Offer and WB-46 Multiple Counter-Proposal as separate headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "WB-46 Multiple Counter-Proposal appears only under Chapter 5 fair-housing notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "WB-44 Counter-Offer is only a Chapter 14 trust-account heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges WB-44 and WB-46; Chapter 12 keeps them as separate headings.",
    remediationDistinction:
      "Ask which form heading fits: WB-44 Counter-Offer or WB-46 Multiple Counter-Proposal.",
  },
  {
    slug: "ch12-q-wb40-amendment-vs-wb41-notice",
    stem: "Chapter 12 separates WB-40 Amendment to Offer to Purchase from WB-41 Notice Relating to Offer to Purchase. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 12,
    examCategoryCodes: ["VI"],
    pair: { a: "wb-40-amendment-to-offer", b: "wb-41-notice-relating-to-offer" },
    citationSlugs: ["wb-40-amendment-to-offer", "wb-41-notice-relating-to-offer"],
    options: [
      {
        key: "A",
        body: "WB-40 Amendment to Offer and WB-41 Notice Relating to Offer share one interchangeable heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 12 separates WB-40 Amendment to Offer to Purchase from WB-41 Notice Relating to Offer to Purchase.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "WB-41 Notice appears only under Chapter 6 valuation notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "WB-40 Amendment to Offer is only a Chapter 2 antitrust heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 12 keeps WB-40 Amendment to Offer and WB-41 Notice Relating to Offer as separate headings.",
    remediationDistinction:
      "Name which form heading fits: WB-40 Amendment to Offer to Purchase or WB-41 Notice Relating to Offer to Purchase.",
  },
  {
    slug: "ch12-q-wb42-listing-amendment-vs-wb40-offer-amendment",
    stem: "Chapter 12 lists WB-42 Amendment to Listing Contract and WB-40 Amendment to Offer to Purchase as separate headings. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 12,
    examCategoryCodes: ["VI"],
    pair: { a: "wb-42-amendment-to-listing", b: "wb-40-amendment-to-offer" },
    citationSlugs: ["wb-42-amendment-to-listing", "wb-40-amendment-to-offer"],
    options: [
      {
        key: "A",
        body: "Treat WB-42 listing amendment and WB-40 offer amendment as one Chapter 12 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which amendment heading fits — WB-42 Amendment to Listing Contract or WB-40 Amendment to Offer to Purchase — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 9 wetlands headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "WB-42 Amendment to Listing Contract appears only under Chapter 4 radon notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 12 keeps WB-42 listing amendment and WB-40 offer amendment as separate headings.",
    remediationDistinction:
      "Ask which amendment heading fits: WB-42 Amendment to Listing Contract or WB-40 Amendment to Offer to Purchase.",
  },
  {
    slug: "ch12-q-wb45-cancellation-vs-wb41-notice",
    stem: "Chapter 12 keeps WB-45 Cancellation Agreement and Mutual Release distinct from WB-41 Notice Relating to Offer to Purchase. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 12,
    examCategoryCodes: ["VI"],
    pair: { a: "wb-45-cancellation-mutual-release", b: "wb-41-notice-relating-to-offer" },
    citationSlugs: ["wb-45-cancellation-mutual-release", "wb-41-notice-relating-to-offer"],
    options: [
      {
        key: "A",
        body: "WB-45 Cancellation Agreement and Mutual Release and WB-41 Notice are one interchangeable heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 12 keeps WB-45 Cancellation Agreement and Mutual Release distinct from WB-41 Notice Relating to Offer to Purchase.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "WB-45 Cancellation Agreement appears only under Chapter 3 WB-36 notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "WB-41 Notice is only a Chapter 7 trade-fixtures heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges WB-45 with WB-41; Chapter 12 keeps them as separate headings.",
    remediationDistinction:
      "Ask which form heading fits: WB-45 Cancellation Agreement and Mutual Release or WB-41 Notice Relating to Offer to Purchase.",
  },
  {
    slug: "ch12-q-wb24-option-vs-wb25-bill-of-sale",
    stem: "Chapter 12 separates WB-24 Option to Purchase from WB-25 Bill of Sale. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 12,
    examCategoryCodes: ["VI"],
    pair: { a: "wb-24-option-to-purchase", b: "wb-25-bill-of-sale" },
    citationSlugs: ["wb-24-option-to-purchase", "wb-25-bill-of-sale"],
    options: [
      {
        key: "A",
        body: "Name which form heading fits — WB-24 Option to Purchase or WB-25 Bill of Sale.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat WB-24 Option to Purchase and WB-25 Bill of Sale as one heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 14 trust-account headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "WB-25 Bill of Sale is not taught in Chapter 12.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 12 keeps WB-24 Option to Purchase and WB-25 Bill of Sale as separate headings.",
    remediationDistinction:
      "Ask which form heading fits: WB-24 Option to Purchase or WB-25 Bill of Sale.",
  },
];
