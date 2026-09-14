import type { ConceptSeed, ConfusionPairSeed } from "./types";

const BOOK = "pub725-course-book" as const;
const NOTES = "chapter-11-financing-notes" as const;
const FINANCING = ["III"] as const;

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
 * Chapter 11 concepts from PUB725 / Chapter 11 notes headings (Financing).
 * Pages from local inspection. No invented rates, fees, or statute numbers.
 */
export const CHAPTER_11_CONCEPTS: readonly ConceptSeed[] = [
  {
    slug: "financing-chapter-overview",
    name: "Financing chapter overview",
    chapterNumber: 11,
    group: "financing-basics",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [book("Chapter Overview", 195, 199), notes("Chapter Overview", 1)],
  },
  {
    slug: "mortgage-law",
    name: "Mortgage law",
    chapterNumber: 11,
    group: "financing-basics",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [book("MORTGAGE LAW", 195, 199), notes("Mortgage Law", 1)],
    partOf: ["financing-chapter-overview"],
  },
  {
    slug: "foreclosure",
    name: "Foreclosure",
    chapterNumber: 11,
    group: "foreclosure",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [book("FORECLOSURE", 196, 200), notes("Foreclosure", 1)],
    prerequisites: ["mortgage-law"],
  },
  {
    slug: "stages-of-foreclosure-wisconsin",
    name: "Stages of foreclosure in Wisconsin",
    chapterNumber: 11,
    group: "foreclosure",
    jurisdictionScope: "wi",
    examCategoryCodes: FINANCING,
    citations: [notes("Stages of Foreclosure in Wisconsin", 1)],
    partOf: ["foreclosure"],
  },
  {
    slug: "deed-in-lieu-of-foreclosure",
    name: "Deed in lieu of foreclosure",
    chapterNumber: 11,
    group: "foreclosure",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [notes("Deed in Lieu of Foreclosure", 2)],
    partOf: ["foreclosure"],
  },
  {
    slug: "facts-about-mortgages",
    name: "Facts about mortgages",
    chapterNumber: 11,
    group: "financing-basics",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [book("FACTS ABOUT MORTGAGES", 197, 201), notes("Facts About Mortgages", 3)],
    prerequisites: ["mortgage-law"],
  },
  {
    slug: "other-types-of-loans",
    name: "Other types of loans",
    chapterNumber: 11,
    group: "loan-types",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [book("OTHER TYPES OF LOANS", 199, 203), notes("Other Types of Loans", 6)],
    prerequisites: ["facts-about-mortgages"],
  },
  {
    slug: "sources-of-financing",
    name: "Sources of financing",
    chapterNumber: 11,
    group: "loan-types",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [book("SOURCES OF FINANCING", 199, 203), notes("Sources of Financing", 7)],
    prerequisites: ["facts-about-mortgages"],
  },
  {
    slug: "seller-financing",
    name: "Seller financing",
    chapterNumber: 11,
    group: "loan-types",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [book("Seller Financing", 199, 203), notes("Seller Financing", 7)],
    partOf: ["sources-of-financing"],
  },
  {
    slug: "conventional-financing",
    name: "Conventional financing",
    chapterNumber: 11,
    group: "loan-types",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [book("Conventional Financing", 201, 205), notes("Conventional Financing", 9)],
    partOf: ["sources-of-financing"],
  },
  {
    slug: "nonconforming-loans",
    name: "Nonconforming loans",
    chapterNumber: 11,
    group: "loan-types",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [book("Nonconforming Loans", 201, 205), notes("Nonconforming Loans", 10)],
    partOf: ["sources-of-financing"],
  },
  {
    slug: "government-financing",
    name: "Government financing",
    chapterNumber: 11,
    group: "loan-types",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [book("Government Financing", 201, 205), notes("Government Financing", 11)],
    partOf: ["sources-of-financing"],
  },
  {
    slug: "primary-and-secondary-markets",
    name: "Primary and secondary markets",
    chapterNumber: 11,
    group: "mortgage-markets",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [
      book("PRIMARY AND SECONDARY MARKETS", 204, 208),
      notes("Primary and Secondary Markets", 14),
    ],
    prerequisites: ["sources-of-financing"],
  },
  {
    slug: "mortgage-fraud",
    name: "Mortgage fraud",
    chapterNumber: 11,
    group: "mortgage-markets",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [book("Mortgage Fraud", 205, 209), notes("Mortgage Fraud", 17)],
    prerequisites: ["primary-and-secondary-markets"],
  },
  {
    slug: "calculating-buyer-mortgage-payment",
    name: "Calculating a buyer’s mortgage payment",
    chapterNumber: 11,
    group: "mortgage-math",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [
      book("CALCULATING A BUYER’S MORTGAGE PAYMENT", 206, 210),
      notes("Calculating a Buyer's Mortgage Payment", 18),
    ],
    prerequisites: ["facts-about-mortgages"],
  },
  {
    slug: "financing-legislation",
    name: "Financing legislation",
    chapterNumber: 11,
    group: "financing-law",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [book("FINANCING LEGISLATION", 207, 211), notes("Financing Legislation", 19)],
    prerequisites: ["sources-of-financing"],
  },
  {
    slug: "tila-regulation-z",
    name: "Truth in Lending Act and Regulation Z",
    chapterNumber: 11,
    group: "financing-law",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [
      book("The Consumer Credit Protection Act, Truth in Lending Act, and Regulation Z", 207, 211),
      notes("The Consumer Credit Protection Act, Truth in Lending Act, and Regulation Z", 19),
    ],
    partOf: ["financing-legislation"],
  },
  {
    slug: "respa",
    name: "Real Estate Settlement and Procedures Act (RESPA)",
    chapterNumber: 11,
    group: "financing-law",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [
      book("Real Estate Settlement and Procedures Act (RESPA)", 208, 212),
      notes("Real Estate Settlement and Procedures Act (RESPA)", 21),
    ],
    partOf: ["financing-legislation"],
  },
  {
    slug: "trid",
    name: "TILA/RESPA Integrated Disclosure (TRID)",
    chapterNumber: 11,
    group: "financing-law",
    jurisdictionScope: "both",
    examCategoryCodes: FINANCING,
    citations: [
      book("TILA/RESPA Integrated Disclosure (TRID)", 208, 212),
      notes("TILA/RESPA Integrated Disclosure (TRID)", 22),
    ],
    partOf: ["financing-legislation"],
  },
];

export const CHAPTER_11_CONFUSION_PAIRS: readonly ConfusionPairSeed[] = [
  {
    a: "conventional-financing",
    b: "nonconforming-loans",
    reason: "Chapter 11 lists Conventional Financing and Nonconforming Loans as separate headings.",
  },
  {
    a: "conventional-financing",
    b: "government-financing",
    reason: "Chapter 11 separates Conventional Financing from Government Financing.",
  },
  {
    a: "seller-financing",
    b: "conventional-financing",
    reason: "Chapter 11 keeps Seller Financing and Conventional Financing as separate headings.",
  },
  {
    a: "foreclosure",
    b: "deed-in-lieu-of-foreclosure",
    reason: "Chapter 11 notes separate Foreclosure from Deed in Lieu of Foreclosure.",
  },
  {
    a: "tila-regulation-z",
    b: "respa",
    reason: "Chapter 11 has separate TILA/Regulation Z and RESPA headings under financing legislation.",
  },
  {
    a: "respa",
    b: "trid",
    reason: "Chapter 11 separates RESPA from TILA/RESPA Integrated Disclosure (TRID).",
  },
];

export const WI_SCOPED_CHAPTER_11_SLUGS = CHAPTER_11_CONCEPTS.filter(
  (concept) => concept.jurisdictionScope === "wi",
).map((concept) => concept.slug);
