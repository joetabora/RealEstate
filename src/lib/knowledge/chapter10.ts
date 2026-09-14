import type { ConceptSeed, ConfusionPairSeed } from "./types";

const BOOK = "pub725-course-book" as const;
const NOTES = "chapter-10-offers-notes" as const;
const FORMS = ["VI"] as const;
const AGENCY_AND_FORMS = ["IV", "VI"] as const;

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

function notes(heading: string, pdfPage: number): ConceptSeed["citations"][number] {
  return {
    documentSlug: NOTES,
    heading,
    pdfPage,
    layer: "chapter_notes",
  };
}

/**
 * Chapter 10 concepts from PUB725 / Chapter 10 notes headings (Offers to Purchase).
 * Major structural headings plus key WB-11 contingency headings. No invented form-line text or fees.
 */
export const CHAPTER_10_CONCEPTS: readonly ConceptSeed[] = [
  {
    slug: "offers-chapter-overview",
    name: "Offers chapter overview",
    chapterNumber: 10,
    group: "offers-basics",
    jurisdictionScope: "both",
    examCategoryCodes: FORMS,
    citations: [book("Chapter Overview", 151, 155), notes("Chapter Overview", 1)],
  },
  {
    slug: "preparing-contracts",
    name: "Preparing contracts",
    chapterNumber: 10,
    group: "offers-basics",
    jurisdictionScope: "both",
    examCategoryCodes: FORMS,
    citations: [book("PREPARING CONTRACTS", 151, 155), notes("Preparing Contracts", 1)],
    partOf: ["offers-chapter-overview"],
  },
  {
    slug: "acceptance-and-binding-acceptance",
    name: "Acceptance and binding acceptance",
    chapterNumber: 10,
    group: "offers-basics",
    jurisdictionScope: "both",
    examCategoryCodes: FORMS,
    citations: [
      book("ACCEPTANCE AND BINDING ACCEPTANCE", 151, 155),
      notes("Acceptance and Binding Acceptance", 1),
    ],
    prerequisites: ["preparing-contracts"],
  },
  {
    slug: "equitable-title",
    name: "Equitable title",
    chapterNumber: 10,
    group: "offers-basics",
    jurisdictionScope: "both",
    examCategoryCodes: FORMS,
    citations: [book("EQUITABLE TITLE", 151, 155), notes("Equitable Title", 1)],
    prerequisites: ["acceptance-and-binding-acceptance"],
  },
  {
    slug: "offer-confidentiality-issues",
    name: "Working with offers: confidentiality issues",
    chapterNumber: 10,
    group: "offer-process",
    jurisdictionScope: "both",
    examCategoryCodes: AGENCY_AND_FORMS,
    citations: [
      book("WORKING WITH OFFERS: CONFIDENTIALITY ISSUES", 152, 156),
      notes("Con fi dentiality Issues", 2),
    ],
    prerequisites: ["preparing-contracts"],
  },
  {
    slug: "drafting-and-submission-of-offers",
    name: "Drafting and submission of offers",
    chapterNumber: 10,
    group: "offer-process",
    jurisdictionScope: "both",
    examCategoryCodes: AGENCY_AND_FORMS,
    citations: [
      book("DRAFTING AND SUBMISSION OF OFFERS", 152, 156),
      notes("Drafting and Submission of Offers", 3),
    ],
    prerequisites: ["preparing-contracts"],
  },
  {
    slug: "cooperating-with-other-firms",
    name: "Cooperating with other firms",
    chapterNumber: 10,
    group: "offer-process",
    jurisdictionScope: "both",
    examCategoryCodes: AGENCY_AND_FORMS,
    citations: [
      book("COOPERATING WITH OTHER FIRM S", 152, 156),
      notes("Cooperating with Other Firms", 3),
    ],
    prerequisites: ["drafting-and-submission-of-offers"],
  },
  {
    slug: "presentation-of-offers",
    name: "Presentation of offers",
    chapterNumber: 10,
    group: "offer-process",
    jurisdictionScope: "both",
    examCategoryCodes: AGENCY_AND_FORMS,
    citations: [
      book("PRESENTATION OF OFFERS", 152, 156),
      notes("Presentation of Offers", 3),
    ],
    prerequisites: ["drafting-and-submission-of-offers"],
  },
  {
    slug: "guaranteed-sales",
    name: "Guaranteed sales",
    chapterNumber: 10,
    group: "offer-process",
    jurisdictionScope: "both",
    examCategoryCodes: FORMS,
    citations: [book("GUARANTEED SALES", 153, 157), notes("Guaranteed Sales", 4)],
    prerequisites: ["presentation-of-offers"],
  },
  {
    slug: "wb-11-residential-offer",
    name: "WB-11 Residential Offer to Purchase",
    chapterNumber: 10,
    group: "approved-offers",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [
      book("WB-11 RESIDENTIAL OFFER TO PURCHASE", 153, 157),
      notes("WB-11 Residential Offer to Purchase", 4),
    ],
    prerequisites: ["acceptance-and-binding-acceptance"],
  },
  {
    slug: "offer-earnest-money",
    name: "Earnest money (WB-11)",
    chapterNumber: 10,
    group: "wb11-provisions",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [notes("Lines 55-66 Earnest Money — Part 1", 9)],
    partOf: ["wb-11-residential-offer"],
  },
  {
    slug: "inspection-contingency",
    name: "Inspection contingency (WB-11)",
    chapterNumber: 10,
    group: "wb11-provisions",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [notes("Lines 193-226 Inspection Contingency", 15)],
    partOf: ["wb-11-residential-offer"],
  },
  {
    slug: "financing-commitment-contingency",
    name: "Financing commitment contingency (WB-11)",
    chapterNumber: 10,
    group: "wb11-provisions",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [notes("Lines 247-259 Financing Commitment Contingency — Part 1", 18)],
    partOf: ["wb-11-residential-offer"],
  },
  {
    slug: "offer-not-contingent-on-financing",
    name: "Offer not contingent on financing (WB-11)",
    chapterNumber: 10,
    group: "wb11-provisions",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [notes("Lines 296-307 Offer Not Contingent on Financing", 22)],
    partOf: ["wb-11-residential-offer"],
  },
  {
    slug: "appraisal-contingency",
    name: "Appraisal contingency (WB-11)",
    chapterNumber: 10,
    group: "wb11-provisions",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [notes("Lines 308-327 Appraisal Contingency", 23)],
    partOf: ["wb-11-residential-offer"],
  },
  {
    slug: "bump-clause",
    name: "Bump clause (WB-11)",
    chapterNumber: 10,
    group: "wb11-provisions",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [notes("Lines 335-347 Bump Clause", 24)],
    partOf: ["wb-11-residential-offer"],
  },
  {
    slug: "secondary-offer",
    name: "Secondary offer (WB-11)",
    chapterNumber: 10,
    group: "wb11-provisions",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [notes("Lines 348-354 Secondary Offer", 25)],
    partOf: ["wb-11-residential-offer"],
  },
  {
    slug: "wb-14-condominium-offer",
    name: "WB-14 Residential Condominium Offer to Purchase",
    chapterNumber: 10,
    group: "approved-offers",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [
      book("WB-14 RESIDENTIAL CONDOMINIUM OFFER TO PURCHASE", 179, 183),
      notes("WB-14 Condominium Offer to Purchase", 40),
    ],
    prerequisites: ["wb-11-residential-offer"],
  },
  {
    slug: "wb-13-vacant-land-offer",
    name: "WB-13 Vacant Land Offer to Purchase",
    chapterNumber: 10,
    group: "approved-offers",
    jurisdictionScope: "wi",
    examCategoryCodes: FORMS,
    citations: [
      book("WB-13 VACANT LAND OFFER TO PURCHASE", 187, 191),
      notes("WB-13 Vacant Land Offer to Purchase", 49),
    ],
    prerequisites: ["wb-11-residential-offer"],
  },
];

export const CHAPTER_10_CONFUSION_PAIRS: readonly ConfusionPairSeed[] = [
  {
    a: "wb-11-residential-offer",
    b: "wb-14-condominium-offer",
    reason: "Chapter 10 has separate WB-11 Residential and WB-14 Condominium offer headings.",
  },
  {
    a: "wb-11-residential-offer",
    b: "wb-13-vacant-land-offer",
    reason: "Chapter 10 separates WB-11 Residential from WB-13 Vacant Land Offer to Purchase.",
  },
  {
    a: "financing-commitment-contingency",
    b: "offer-not-contingent-on-financing",
    reason:
      "Chapter 10 notes list Financing Commitment Contingency and Offer Not Contingent on Financing as separate headings.",
  },
  {
    a: "bump-clause",
    b: "secondary-offer",
    reason: "Chapter 10 notes keep Bump Clause and Secondary Offer as separate WB-11 headings.",
  },
  {
    a: "inspection-contingency",
    b: "appraisal-contingency",
    reason: "Chapter 10 notes separate Inspection Contingency from Appraisal Contingency.",
  },
  {
    a: "drafting-and-submission-of-offers",
    b: "presentation-of-offers",
    reason: "Chapter 10 separates Drafting and Submission of Offers from Presentation of Offers.",
  },
];

export const WI_SCOPED_CHAPTER_10_SLUGS = CHAPTER_10_CONCEPTS.filter(
  (concept) => concept.jurisdictionScope === "wi",
).map((concept) => concept.slug);
