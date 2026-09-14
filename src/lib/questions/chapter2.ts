import type { QuestionSeed } from "./catalog";

/**
 * Chapter 2 Agency Issues scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented statutes, fees, or form lines.
 */
export const PHASE5_CH2_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch2-q-express-vs-implied-agency",
    stem: "Chapter 2 Important Terminology lists express agency and implied agency as separate creation paths. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 2,
    examCategoryCodes: ["IV"],
    pair: { a: "express-agency", b: "implied-agency" },
    citationSlugs: ["express-agency", "implied-agency"],
    options: [
      {
        key: "A",
        body: "Express agency and implied agency are interchangeable labels for the same creation path.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 2 lists express agency and implied agency as separate creation paths.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Implied agency appears only in Chapter 11 Financing.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Express agency always means an open listing contract.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses express and implied agency; Chapter 2 keeps them as separate creation paths.",
    remediationDistinction:
      "Chapter 2 Important Terminology lists express agency and implied agency as separate creation paths.",
  },
  {
    slug: "ch2-q-exclusive-agency-vs-exclusive-right-to-sell",
    stem: "Chapter 2 notes list exclusive agency and exclusive right to sell as separate listing contract headings. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 2,
    examCategoryCodes: ["IV"],
    pair: { a: "exclusive-agency-listing", b: "exclusive-right-to-sell-listing" },
    citationSlugs: ["exclusive-agency-listing", "exclusive-right-to-sell-listing"],
    options: [
      {
        key: "A",
        body: "Treat exclusive agency and exclusive right to sell as one heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which listing-contract heading the item fits before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the antitrust headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Exclusive right to sell is only a buyer-agency heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 2 notes keep exclusive agency and exclusive right to sell as separate listing headings.",
    remediationDistinction:
      "Ask which listing heading fits: exclusive agency or exclusive right to sell.",
  },
  {
    slug: "ch2-q-open-vs-exclusive-right-to-sell",
    stem: "Chapter 2 notes distinguish an open listing from an exclusive right to sell listing. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 2,
    examCategoryCodes: ["IV"],
    pair: { a: "open-listing-contract", b: "exclusive-right-to-sell-listing" },
    citationSlugs: ["open-listing-contract", "exclusive-right-to-sell-listing"],
    options: [
      {
        key: "A",
        body: "Open listing and exclusive right to sell are the same notes heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 2 notes distinguish an open listing from an exclusive right to sell listing.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Open listing means the same as exclusive agency listing under Chapter 2 notes.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Exclusive right to sell appears only in Chapter 14 Trust Accounts.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges open listing with exclusive right to sell; Chapter 2 keeps them distinct.",
    remediationDistinction:
      "Chapter 2 notes distinguish an open listing from an exclusive right to sell listing.",
  },
  {
    slug: "ch2-q-special-vs-general-agency",
    stem: "Chapter 2 treats special agency and general agency as separate terms. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 2,
    examCategoryCodes: ["IV"],
    pair: { a: "special-agency", b: "general-agency" },
    citationSlugs: ["special-agency", "general-agency"],
    options: [
      {
        key: "A",
        body: "Special agency and general agency are one interchangeable term in Chapter 2.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 2 treats special agency and general agency as separate terms.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "General agency is only a fair-housing heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Special agency always means price fixing.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 2 keeps special agency and general agency as separate terms.",
    remediationDistinction:
      "Name which agency-type term the item is testing: special or general.",
  },
  {
    slug: "ch2-q-listing-vs-buyer-agency",
    stem: "Chapter 2 has separate headings for listing contracts and buyer agency agreements. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 2,
    examCategoryCodes: ["IV"],
    pair: { a: "listing-contracts", b: "buyer-agency-agreements" },
    citationSlugs: ["listing-contracts", "buyer-agency-agreements"],
    options: [
      {
        key: "A",
        body: "Listing contracts and buyer agency agreements share one Chapter 2 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 2 has separate headings for listing contracts and buyer agency agreements.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Buyer agency agreements appear only under antitrust.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Listing contracts always include group boycott rules in the same heading.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses listing contracts and buyer agency agreements; Chapter 2 keeps them separate.",
    remediationDistinction:
      "Chapter 2 has separate headings for listing contracts and buyer agency agreements.",
  },
  {
    slug: "ch2-q-locate-vs-negotiate",
    stem: "Chapter 2 notes split buyer agency into locate vs negotiate authority headings. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 2,
    examCategoryCodes: ["IV"],
    pair: { a: "exclusive-right-to-locate", b: "exclusive-right-to-negotiate" },
    citationSlugs: ["exclusive-right-to-locate", "exclusive-right-to-negotiate"],
    options: [
      {
        key: "A",
        body: "Name which buyer-agency authority heading fits — locate or negotiate.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat locate and negotiate as the same notes heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Answer only from the Chapter 14 trust-account headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Locate authority is not taught in Chapter 2.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 2 notes keep exclusive right to locate and exclusive right to negotiate as separate headings.",
    remediationDistinction:
      "Ask which buyer-agency authority heading the item fits: locate or negotiate.",
  },
  {
    slug: "ch2-q-damages-vs-rescission",
    stem: "Chapter 2 Important Terminology lists damages and rescission as separate remedy terms. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 2,
    examCategoryCodes: ["IV"],
    pair: { a: "damages", b: "rescission" },
    citationSlugs: ["damages", "rescission"],
    options: [
      {
        key: "A",
        body: "Damages and rescission are synonyms under Chapter 2 terminology.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 2 lists damages and rescission as separate remedy terms.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Rescission is only a Chapter 5 fair-housing term.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Damages always means the same as commission in an in-house sale.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges damages and rescission; Chapter 2 keeps them as separate remedy terms.",
    remediationDistinction:
      "Chapter 2 Important Terminology lists damages and rescission as separate remedy terms.",
  },
  {
    slug: "ch2-q-price-fixing-vs-group-boycott",
    stem: "Chapter 2 Important Terminology lists price fixing and group boycott as separate antitrust terms. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 2,
    examCategoryCodes: ["IX"],
    pair: { a: "price-fixing", b: "group-boycott" },
    citationSlugs: ["price-fixing", "group-boycott"],
    options: [
      {
        key: "A",
        body: "Price fixing and group boycott are one interchangeable antitrust label.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 2 lists price fixing and group boycott as separate antitrust terms.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Group boycott is only a listing-contract heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Price fixing appears only under buyer agency agreements.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 2 keeps price fixing and group boycott as separate antitrust terms.",
    remediationDistinction:
      "Name which antitrust term heading the item is testing: price fixing or group boycott.",
  },
  {
    slug: "ch2-q-cooperating-vs-in-house-commission",
    stem: "Chapter 2 has separate headings for cooperating-firm commission and in-house sale commission. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 2,
    examCategoryCodes: ["IV"],
    pair: { a: "commission-cooperating-firms", b: "commission-in-house-sale" },
    citationSlugs: ["commission-cooperating-firms", "commission-in-house-sale"],
    options: [
      {
        key: "A",
        body: "Those two commission topics share one Chapter 2 heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 2 has separate headings for cooperating-firm commission and in-house sale commission.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "In-house sale commission is only an antitrust heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Cooperating-firm commission appears only in Chapter 14.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses the two commission headings; Chapter 2 keeps them separate.",
    remediationDistinction:
      "Ask which commission heading fits: cooperating firms or in-house sale.",
  },
  {
    slug: "ch2-q-payment-listing-vs-buyers-firm",
    stem: "Chapter 2 ends with separate payment headings for the listing firm and the buyer’s firm. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 2,
    examCategoryCodes: ["IV"],
    pair: { a: "payment-of-listing-firm", b: "payment-of-buyers-firm" },
    citationSlugs: ["payment-of-listing-firm", "payment-of-buyers-firm"],
    options: [
      {
        key: "A",
        body: "Payment of the listing firm and payment of the buyer’s firm are one heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 2 keeps separate payment headings for the listing firm and the buyer’s firm.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Payment of a buyer’s firm is only a trust-account depositing heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Payment of a listing firm means the same as group boycott.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 2 keeps listing-firm payment and buyer’s-firm payment as separate headings.",
    remediationDistinction:
      "Name which payment heading the item fits: listing firm or buyer’s firm.",
  },
];
