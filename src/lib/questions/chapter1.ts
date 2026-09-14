import type { QuestionSeed } from "./catalog";
export {
  citationsForQuestion,
  pairKeyForQuestion,
  type QuestionCitationSeed,
  type QuestionOptionSeed,
  type QuestionSeed,
} from "./catalog";

/**
 * Chapter 1 Agency scored items from seeded confusion pairs / headings.
 * Tests heading distinctions only — no invented statutes, fees, or form lines.
 */
export const PHASE5_CH1_QUESTIONS: readonly QuestionSeed[] = [
  {
    slug: "ch1-q-client-vs-customer",
    stem: "Chapter 1 lists Client and Customer as separate headings. Which statement matches those headings?",
    informationClass: "course_sourced",
    chapterNumber: 1,
    examCategoryCodes: ["IV"],
    pair: { a: "client", b: "customer" },
    citationSlugs: ["client", "customer"],
    options: [
      { key: "A", body: "Client and customer are interchangeable labels for the same person.", isCorrect: false },
      {
        key: "B",
        body: "Client and customer are separate terms; they are not interchangeable.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Customer always means someone who has already signed a buyer agency agreement.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Client means only the listing firm, never a buyer.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses Client and Customer into one idea, but Chapter 1 keeps them as separate headings.",
    remediationDistinction:
      "Chapter 1 lists Client and Customer as separate terms; they are not interchangeable.",
  },
  {
    slug: "ch1-q-multiple-vs-designated",
    stem: "Chapter 1 covers Multiple Representation and Multiple Representation with Designated Agency. How should you treat those headings?",
    informationClass: "course_sourced",
    chapterNumber: 1,
    examCategoryCodes: ["IV"],
    pair: { a: "multiple-representation", b: "multiple-representation-with-designated-agency" },
    citationSlugs: [
      "multiple-representation",
      "multiple-representation-with-designated-agency",
    ],
    options: [
      {
        key: "A",
        body: "Designated agency is an entirely different agency model unrelated to multiple representation.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Designated agency is a form of multiple representation under the chapter headings, not a separate model from multiple representation.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Multiple representation always requires designated agency.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "The chapter uses only one heading for both ideas.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice treats designated agency as unrelated (or mandatory) instead of following the chapter’s heading structure.",
    remediationDistinction:
      "Designated agency is a form of multiple representation under Chapter 1 headings, not a separate agency model from multiple representation.",
  },
  {
    slug: "ch1-q-designated-vs-without",
    stem: "Chapter 1 notes split multiple representation into with vs without designated agency. What is the repair cue?",
    informationClass: "course_sourced",
    chapterNumber: 1,
    examCategoryCodes: ["IV"],
    pair: {
      a: "multiple-representation-without-designated-agency",
      b: "multiple-representation-with-designated-agency",
    },
    citationSlugs: [
      "multiple-representation-without-designated-agency",
      "multiple-representation-with-designated-agency",
    ],
    options: [
      {
        key: "A",
        body: "Name which of the two multiple-representation headings the item fits — with or without designated agency.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Treat with and without designated agency as the same heading.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Ignore designated agency and answer only from the firm-name headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Assume without designated agency is never taught in Chapter 1.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 1 notes keep with vs without designated agency as separate headings under multiple representation.",
    remediationDistinction:
      "Repair by naming which heading fits: multiple representation with designated agency, or without.",
  },
  {
    slug: "ch1-q-listing-vs-selling-firm",
    stem: "Chapter 1 distinguishes Listing Firm from Selling Firm. Which statement matches those headings?",
    informationClass: "course_sourced",
    chapterNumber: 1,
    examCategoryCodes: ["IV"],
    pair: { a: "listing-firm", b: "selling-firm" },
    citationSlugs: ["listing-firm", "selling-firm"],
    options: [
      {
        key: "A",
        body: "Listing firm and selling firm are two names for the same firm in every transaction.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 1 headings distinguish the listing firm from the selling firm.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Selling firm always means the buyer’s firm under Chapter 1 headings.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Listing firm is only used in Chapter 2, not Chapter 1.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges listing firm and selling firm, but Chapter 1 keeps them as separate headings.",
    remediationDistinction:
      "Chapter 1 headings distinguish the listing firm from the selling firm.",
  },
  {
    slug: "ch1-q-listing-vs-selling-licensee",
    stem: "Chapter 1 headings distinguish listing licensee/agent from selling licensee/agent. What should you do on an item that mixes those roles?",
    informationClass: "course_sourced",
    chapterNumber: 1,
    examCategoryCodes: ["IV"],
    pair: { a: "listing-licensee", b: "selling-licensee" },
    citationSlugs: ["listing-licensee", "selling-licensee"],
    options: [
      {
        key: "A",
        body: "Pick either label; Chapter 1 treats them as synonyms.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which heading fits — listing licensee or selling licensee — before answering.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Answer only from the DSPS notification heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Treat selling licensee as the same heading as buyer’s licensee.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 1 keeps listing licensee and selling licensee as separate headings.",
    remediationDistinction:
      "Name which role heading the item is testing: listing licensee or selling licensee.",
  },
  {
    slug: "ch1-q-listing-vs-buyers-licensee",
    stem: "Chapter 1 distinguishes the listing licensee from the buyer’s licensee. Which statement is correct?",
    informationClass: "course_sourced",
    chapterNumber: 1,
    examCategoryCodes: ["IV"],
    pair: { a: "listing-licensee", b: "buyers-licensee" },
    citationSlugs: ["listing-licensee", "buyers-licensee"],
    options: [
      {
        key: "A",
        body: "Those two headings describe the same person on every deal.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 1 headings distinguish the listing licensee from the buyer’s licensee.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Buyer’s licensee is not a Chapter 1 heading.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Listing licensee always means an unlicensed personal assistant.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice collapses listing licensee and buyer’s licensee; Chapter 1 keeps them separate.",
    remediationDistinction:
      "Chapter 1 headings distinguish the listing licensee from the buyer’s licensee.",
  },
  {
    slug: "ch1-q-selling-vs-buyers-firm",
    stem: "Chapter 1 distinguishes a selling firm from a buyer’s firm. What is the sourced distinction?",
    informationClass: "course_sourced",
    chapterNumber: 1,
    examCategoryCodes: ["IV"],
    pair: { a: "selling-firm", b: "buyers-firm" },
    citationSlugs: ["selling-firm", "buyers-firm"],
    options: [
      {
        key: "A",
        body: "Chapter 1 headings distinguish a selling firm from a buyer’s firm.",
        isCorrect: true,
      },
      {
        key: "B",
        body: "Selling firm and buyer’s firm are one heading in Chapter 1.",
        isCorrect: false,
      },
      {
        key: "C",
        body: "Buyer’s firm is only a Chapter 14 trust-account term.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Selling firm always equals listing firm under Chapter 1 headings.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 1 keeps selling firm and buyer’s firm as separate headings.",
    remediationDistinction:
      "Chapter 1 headings distinguish a selling firm from a buyer’s firm.",
  },
  {
    slug: "ch1-q-duties-all-vs-client",
    stem: "Chapter 1 separates duties owed to all persons from duties owed to a client. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 1,
    examCategoryCodes: ["IV"],
    pair: { a: "duties-to-all-persons", b: "duties-owed-to-a-client" },
    citationSlugs: ["duties-to-all-persons", "duties-owed-to-a-client"],
    options: [
      {
        key: "A",
        body: "Duties to all persons and duties owed to a client are the same heading.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 1 separates duties owed to all persons from extra duties owed to a client.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Duties owed to a client replace duties to all persons entirely.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Duties to all persons appear only in the fair-housing chapter.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "That choice merges or replaces the two duty headings; Chapter 1 keeps them separate.",
    remediationDistinction:
      "Chapter 1 separates duties owed to all persons from extra duties owed to a client.",
  },
  {
    slug: "ch1-q-customer-vs-client-disclosure",
    stem: "Chapter 1 has separate customer and client agency disclosure headings. What should you do?",
    informationClass: "course_sourced",
    chapterNumber: 1,
    examCategoryCodes: ["IV"],
    pair: { a: "customer-agency-disclosure", b: "client-agency-disclosure" },
    citationSlugs: ["customer-agency-disclosure", "client-agency-disclosure"],
    options: [
      {
        key: "A",
        body: "Use one disclosure heading for both customers and clients.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Name which heading the item fits — customer agency disclosure or client agency disclosure.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Agency disclosure headings start in Chapter 11 Financing.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Client agency disclosure is only for unlicensed assistants.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 1 keeps customer and client agency disclosure as separate headings.",
    remediationDistinction:
      "Ask which disclosure heading applies: customer agency disclosure or client agency disclosure.",
  },
  {
    slug: "ch1-q-licensed-vs-unlicensed-assistant",
    stem: "Chapter 1 notes split personal assistants into licensed vs unlicensed. Which statement matches?",
    informationClass: "course_sourced",
    chapterNumber: 1,
    examCategoryCodes: ["IV"],
    pair: { a: "unlicensed-personal-assistant", b: "licensed-personal-assistant" },
    citationSlugs: ["unlicensed-personal-assistant", "licensed-personal-assistant"],
    options: [
      {
        key: "A",
        body: "Licensed and unlicensed personal assistants share one notes heading with no split.",
        isCorrect: false,
      },
      {
        key: "B",
        body: "Chapter 1 notes split personal assistants into licensed vs unlicensed headings.",
        isCorrect: true,
      },
      {
        key: "C",
        body: "Unlicensed personal assistant means the same as listing firm.",
        isCorrect: false,
      },
      {
        key: "D",
        body: "Licensed personal assistant is only a Chapter 5 fair-housing term.",
        isCorrect: false,
      },
    ],
    remediationWhyMissed:
      "Chapter 1 notes keep licensed and unlicensed personal assistants as separate headings.",
    remediationDistinction:
      "Name which assistant heading fits: licensed personal assistant or unlicensed personal assistant.",
  },
];
