export const CONCEPT_GROUPS = [
  "roles",
  "broker-definition",
  "models",
  "duties",
  "disclosure",
  "office",
  "agency-creation",
  "agency-contracts",
  "termination",
  "remedies",
  "compensation",
  "antitrust",
  "transaction",
  "agency-agreements",
  "listing-forms",
  "buyer-agency-forms",
  "property-disclosure",
  "owner-disclosure",
  "licensee-property-disclosure",
  "condominium-disclosure",
  "environmental",
  "fair-housing",
  "fair-housing-practice",
  "disability-access",
  "valuation",
  "valuation-approach",
  "ownership-basics",
  "property-classification",
  "estates",
  "co-ownership",
  "wi-ownership",
  "special-ownership",
  "title-transfer",
  "deeds",
  "wi-title",
  "encumbrances",
  "liens",
  "title-tax",
  "title-evidence",
  "land-use-basics",
  "zoning",
  "water-land-use",
  "private-controls",
] as const;

export type ConceptGroup = (typeof CONCEPT_GROUPS)[number];

export const JURISDICTION_SCOPES = ["wi", "general", "both"] as const;
export type JurisdictionScope = (typeof JURISDICTION_SCOPES)[number];

export const RELATIONSHIP_KINDS = ["prerequisite", "part_of", "related"] as const;
export type RelationshipKind = (typeof RELATIONSHIP_KINDS)[number];

export type ConceptCitationSeed = {
  documentSlug:
    | "pub725-course-book"
    | "chapter-1-agency-notes"
    | "chapter-2-agency-issues-notes"
    | "chapter-3-agency-agreements-notes"
    | "chapter-4-disclosure-obligations-notes"
    | "chapter-5-fair-housing-notes"
    | "chapter-6-valuation-notes"
    | "chapter-7-ownership-notes"
    | "chapter-8-title-notes"
    | "chapter-9-land-use-notes";
  heading: string;
  pdfPage: number;
  printedPage?: number;
  layer: "course_book" | "chapter_notes";
};

export type ConceptSeed = {
  slug: string;
  name: string;
  chapterNumber: number;
  group: ConceptGroup;
  jurisdictionScope: JurisdictionScope;
  examCategoryCodes: readonly string[];
  citations: readonly ConceptCitationSeed[];
  prerequisites?: readonly string[];
  partOf?: readonly string[];
};

export type ConfusionPairSeed = {
  a: string;
  b: string;
  reason: string;
};

export function canonicalPairKey(slugA: string, slugB: string): string {
  return [slugA, slugB].sort((left, right) => left.localeCompare(right)).join("|");
}

export function activateConfusionPairs(
  conceptSlugs: readonly string[],
  pairs: readonly ConfusionPairSeed[],
): ConfusionPairSeed[] {
  const present = new Set(conceptSlugs);
  return pairs.filter((pair) => present.has(pair.a) && present.has(pair.b) && pair.a !== pair.b);
}

export const CONCEPT_GROUP_LABELS: Record<ConceptGroup, string> = {
  roles: "People and firms",
  "broker-definition": "Who must be licensed",
  models: "Agency models",
  duties: "Duties",
  disclosure: "Agency disclosure",
  office: "The real estate office",
  "agency-creation": "How agency is created",
  "agency-contracts": "Agency contracts",
  termination: "Ending agency",
  remedies: "Breach and remedies",
  compensation: "Commission and payment",
  antitrust: "Antitrust",
  transaction: "The real estate transaction",
  "agency-agreements": "Agency agreements (approved forms)",
  "listing-forms": "Listing form provisions",
  "buyer-agency-forms": "Buyer agency form provisions",
  "property-disclosure": "Disclosure basics",
  "owner-disclosure": "Owner disclosure / RECR",
  "licensee-property-disclosure": "Licensee property disclosure",
  "condominium-disclosure": "Condominium disclosure",
  environmental: "Environmental concerns",
  "fair-housing": "Fair housing law",
  "fair-housing-practice": "Fair housing practice",
  "disability-access": "ADA / disability access",
  valuation: "Valuation",
  "valuation-approach": "Approaches to value",
  "ownership-basics": "Ownership basics",
  "property-classification": "Real vs personal property",
  estates: "Estates in land",
  "co-ownership": "Forms of ownership",
  "wi-ownership": "Wisconsin marital property",
  "special-ownership": "Condo, coop, and time-share",
  "title-transfer": "Transfer of title",
  deeds: "Deeds",
  "wi-title": "Wisconsin title transfer",
  encumbrances: "Encumbrances",
  liens: "Liens",
  "title-tax": "Tax calculations",
  "title-evidence": "Evidence of title",
  "land-use-basics": "Land use basics",
  zoning: "Zoning",
  "water-land-use": "Water rights and wetlands",
  "private-controls": "Private land use controls",
};

export const COURSE_CHAPTER_TITLES: Record<number, string> = {
  1: "Agency Relationships",
  2: "Agency Issues",
  3: "Agency Agreements",
  4: "Disclosure Obligations",
  5: "Fair Housing",
  6: "Valuation",
  7: "Real Property Ownership",
  8: "Title of Real Estate",
  9: "Land Use",
  10: "Offers to Purchase",
  11: "Financing",
  12: "Other Approved Forms",
  13: "Contract Law",
  14: "Trust Accounts",
};
