import type { QuestionSeed } from "./catalog";

/**
 * Chapter 3 Agency Agreements scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented statutes, fees, or form-line text.
 */
export const PHASE5_CH3_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch3-q-buyer-vs-seller-in-transaction",
    stem: "Chapter 3 notes list the buyer and the seller as separate transaction parties. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 3,
    examCategoryCodes: ["IV"],
    pair: { a: "buyer-in-transaction", b: "seller-in-transaction" },
    citationSlugs: ["buyer-in-transaction", "seller-in-transaction"],
    options: [
      {
        key: "A",
        body: "Buyer and seller are interchangeable labels for the same transaction party in Chapter 3 notes.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 3 notes list the buyer and the seller as separate transaction parties.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Seller-in-transaction appears only under fair-housing headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Buyer-in-transaction means the same as protected property under WB-36 notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses buyer and seller; Chapter 3 keeps them as separate transaction parties.",
    remediationDistinction:
      "Chapter 3 notes list the buyer and the seller as separate transaction parties.",
  },
  {
    slug: "ch3-q-wb1-included-vs-not-included",
    stem: "WB-1 notes separate Included Items from Not Included in List Price. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 3,
    examCategoryCodes: ["VI"],
    pair: { a: "wb-1-included-items", b: "wb-1-not-included-items" },
    citationSlugs: ["wb-1-included-items", "wb-1-not-included-items"],
    options: [
      {
        key: "A",
        body: "Treat Included Items and Not Included in List Price as one WB-1 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which WB-1 heading fits — Included Items or Not Included in List Price — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the WB-4 association-fee heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Not Included in List Price is only a Chapter 14 trust-account heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "WB-1 notes keep Included Items and Not Included in List Price as separate headings.",
    remediationDistinction:
      "Ask which WB-1 heading fits: Included Items or Not Included in List Price.",
  },
  {
    slug: "ch3-q-protected-buyer-vs-extension-of-listing",
    stem: "WB-1 notes list Protected Buyer and Extension of Listing as separate headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 3,
    examCategoryCodes: ["IV", "VI"],
    pair: { a: "protected-buyer", b: "extension-of-listing" },
    citationSlugs: ["protected-buyer", "extension-of-listing"],
    options: [
      {
        key: "A",
        body: "Protected Buyer and Extension of Listing are interchangeable WB-1 labels.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "WB-1 notes list Protected Buyer and Extension of Listing as separate headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Extension of Listing appears only under WB-36 buyer-agency notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Protected Buyer is only a Chapter 5 fair-housing heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges Protected Buyer with Extension of Listing; WB-1 notes keep them separate.",
    remediationDistinction:
      "WB-1 notes list Protected Buyer and Extension of Listing as separate headings.",
  },
  {
    slug: "ch3-q-wb1-residential-vs-wb4-condo",
    stem: "Chapter 3 has separate WB-1 residential and WB-4 condominium listing contract headings. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 3,
    examCategoryCodes: ["IV", "VI"],
    pair: { a: "wb-1-residential-listing", b: "wb-4-condo-listing" },
    citationSlugs: ["wb-1-residential-listing", "wb-4-condo-listing"],
    options: [
      {
        key: "A",
        body: "WB-1 residential listing and WB-4 condominium listing share one Chapter 3 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 3 keeps separate headings for the WB-1 residential listing and the WB-4 condominium listing.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "WB-4 condominium listing is only an antitrust heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "WB-1 residential listing appears only in Chapter 11 Financing.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 3 keeps WB-1 residential and WB-4 condominium listing as separate headings.",
    remediationDistinction:
      "Name which listing-contract heading fits: WB-1 residential or WB-4 condominium.",
  },
  {
    slug: "ch3-q-wb1-listing-vs-wb36-buyer-agency",
    stem: "Chapter 3 separates the seller-side WB-1 listing from the buyer-side WB-36 agreement. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 3,
    examCategoryCodes: ["IV", "VI"],
    pair: { a: "wb-1-residential-listing", b: "wb-36-buyer-agency" },
    citationSlugs: ["wb-1-residential-listing", "wb-36-buyer-agency"],
    options: [
      {
        key: "A",
        body: "Name which side the item fits — seller-side WB-1 listing or buyer-side WB-36 agreement.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat WB-1 listing and WB-36 buyer agency as one interchangeable heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 14 trust-account headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "WB-36 buyer agency is not taught in Chapter 3.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 3 keeps the WB-1 listing and the WB-36 buyer-agency agreement as separate headings.",
    remediationDistinction:
      "Ask which side fits: seller-side WB-1 listing or buyer-side WB-36 agreement.",
  },
  {
    slug: "ch3-q-protected-buyer-vs-protected-property",
    stem: "Protected buyer is a WB-1 listing heading; protected property is a WB-36 buyer-agency heading. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 3,
    examCategoryCodes: ["IV", "VI"],
    pair: { a: "protected-buyer", b: "protected-property" },
    citationSlugs: ["protected-buyer", "protected-property"],
    options: [
      {
        key: "A",
        body: "Protected buyer and protected property are the same notes heading on both forms.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Protected buyer is a WB-1 listing heading; protected property is a WB-36 buyer-agency heading.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Protected property appears only under WB-1 Included Items.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Protected buyer is only a Chapter 2 antitrust term.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges protected buyer with protected property across forms; Chapter 3 keeps the form-side headings distinct.",
    remediationDistinction:
      "Ask which form heading fits: WB-1 protected buyer or WB-36 protected property.",
  },
  {
    slug: "ch3-q-extension-listing-vs-extension-agreement-term",
    stem: "WB-1 Extension of Listing is not the same heading as WB-36 Extension of Agreement Term. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 3,
    examCategoryCodes: ["VI"],
    pair: { a: "extension-of-listing", b: "extension-of-agreement-term" },
    citationSlugs: ["extension-of-listing", "extension-of-agreement-term"],
    options: [
      {
        key: "A",
        body: "Those two extension headings are interchangeable across WB-1 and WB-36.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "WB-1 Extension of Listing is not the same heading as WB-36 Extension of Agreement Term.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Extension of Agreement Term appears only under WB-4 condominium listing notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Extension of Listing means the same as association fee under Chapter 3 notes.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 3 keeps WB-1 Extension of Listing and WB-36 Extension of Agreement Term as separate headings.",
    remediationDistinction:
      "Name which extension heading fits: WB-1 Extension of Listing or WB-36 Extension of Agreement Term.",
  },
  {
    slug: "ch3-q-limited-common-elements-vs-association-fee",
    stem: "WB-4 notes treat limited common elements and association fee as separate condominium headings. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 3,
    examCategoryCodes: ["VI"],
    pair: { a: "limited-common-elements", b: "association-fee" },
    citationSlugs: ["limited-common-elements", "association-fee"],
    options: [
      {
        key: "A",
        body: "Limited common elements and association fee share one WB-4 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "WB-4 notes treat limited common elements and association fee as separate condominium headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Association fee is only a WB-36 buyer-agency heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Limited common elements appear only under WB-1 Not Included in List Price.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses the two WB-4 condominium headings; Chapter 3 keeps them separate.",
    remediationDistinction:
      "Ask which WB-4 heading fits: limited common elements or association fee.",
  },
];
