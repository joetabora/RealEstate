import type { ConceptSeed, ConfusionPairSeed } from "./types";

const BOOK = "pub725-course-book" as const;
const FORMS = ["VI"] as const;

function book(
  heading: string,
  printedPage: number,
  pdfPage: number,
): ConceptSeed["citations"][number] {
  return {
    documentSlug: BOOK,
    heading,
    printedPage,
    pdfPage,
    layer: "course_book",
  };
}

/**
 * Chapter 12 concepts from PUB725 headings (Other Approved Forms).
 * Book-only — no chapter-folder notes PDF. No invented form-line text or fees.
 */
export const CHAPTER_12_CONCEPTS: readonly ConceptSeed[] = [
  {
    slug: "other-forms-chapter-overview",
    name: "Other approved forms chapter overview",
    chapterNumber: 12,
    group: "other-forms-basics",
    jurisdictionScope: "both",
    examCategoryCodes: FORMS,
    citations: [book("Chapter Overview", 211, 215)],
  },
  {
    slug: "wb-44-counter-offer",
    name: "WB-44 Counter-Offer",
    chapterNumber: 12,
    group: "counter-forms",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [book("WB-44 COUNTER-OFFER", 211, 215)],
    partOf: ["other-forms-chapter-overview"],
  },
  {
    slug: "wb-46-multiple-counter-proposal",
    name: "WB-46 Multiple Counter-Proposal",
    chapterNumber: 12,
    group: "counter-forms",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [book("WB-46 MULTIPLE COUNTER-PROPOSAL", 213, 217)],
    partOf: ["other-forms-chapter-overview"],
  },
  {
    slug: "wb-42-amendment-to-listing",
    name: "WB-42 Amendment to Listing Contract",
    chapterNumber: 12,
    group: "amendment-forms",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [book("WB-42 AMENDMENT TO LISTING CONTRACT", 215, 219)],
    prerequisites: ["other-forms-chapter-overview"],
  },
  {
    slug: "wb-40-amendment-to-offer",
    name: "WB-40 Amendment to Offer to Purchase",
    chapterNumber: 12,
    group: "amendment-forms",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [book("WB-40 AMENDMENT TO OFFER TO PURCHASE", 217, 221)],
    prerequisites: ["other-forms-chapter-overview"],
  },
  {
    slug: "wb-41-notice-relating-to-offer",
    name: "WB-41 Notice Relating to Offer to Purchase",
    chapterNumber: 12,
    group: "notice-release-forms",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [book("WB-41 NOTICE RELATING TO OFFER TO PURCHASE", 219, 223)],
    prerequisites: ["other-forms-chapter-overview"],
  },
  {
    slug: "wb-45-cancellation-mutual-release",
    name: "WB-45 Cancellation Agreement and Mutual Release",
    chapterNumber: 12,
    group: "notice-release-forms",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [book("WB-45 CANCELLATION AGREEMENT AND MUTUAL RELEASE", 220, 224)],
    prerequisites: ["other-forms-chapter-overview"],
  },
  {
    slug: "wb-24-option-to-purchase",
    name: "WB-24 Option to Purchase",
    chapterNumber: 12,
    group: "option-sale-forms",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [book("WB-24 OPTION TO PURCHASE", 222, 226)],
    prerequisites: ["other-forms-chapter-overview"],
  },
  {
    slug: "wb-25-bill-of-sale",
    name: "WB-25 Bill of Sale",
    chapterNumber: 12,
    group: "option-sale-forms",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [book("WB-25 BILL OF SALE", 225, 229)],
    prerequisites: ["other-forms-chapter-overview"],
  },
];

export const CHAPTER_12_CONFUSION_PAIRS: readonly ConfusionPairSeed[] = [
  {
    a: "wb-44-counter-offer",
    b: "wb-46-multiple-counter-proposal",
    reason:
      "Chapter 12 keeps WB-44 Counter-Offer and WB-46 Multiple Counter-Proposal as separate headings.",
  },
  {
    a: "wb-40-amendment-to-offer",
    b: "wb-41-notice-relating-to-offer",
    reason:
      "Chapter 12 separates WB-40 Amendment to Offer to Purchase from WB-41 Notice Relating to Offer to Purchase.",
  },
  {
    a: "wb-42-amendment-to-listing",
    b: "wb-40-amendment-to-offer",
    reason:
      "Chapter 12 lists WB-42 Amendment to Listing Contract and WB-40 Amendment to Offer to Purchase as separate headings.",
  },
  {
    a: "wb-45-cancellation-mutual-release",
    b: "wb-41-notice-relating-to-offer",
    reason:
      "Chapter 12 keeps WB-45 Cancellation Agreement and Mutual Release distinct from WB-41 Notice Relating to Offer to Purchase.",
  },
  {
    a: "wb-24-option-to-purchase",
    b: "wb-25-bill-of-sale",
    reason: "Chapter 12 separates WB-24 Option to Purchase from WB-25 Bill of Sale.",
  },
];

export const WI_SCOPED_CHAPTER_12_SLUGS = CHAPTER_12_CONCEPTS.filter(
  (concept) => concept.jurisdictionScope === "wi",
).map((concept) => concept.slug);
