export const CONCEPT_GROUPS = [
  "roles",
  "broker-definition",
  "models",
  "duties",
  "disclosure",
  "office",
] as const;

export type ConceptGroup = (typeof CONCEPT_GROUPS)[number];

export const JURISDICTION_SCOPES = ["wi", "general", "both"] as const;
export type JurisdictionScope = (typeof JURISDICTION_SCOPES)[number];

export const RELATIONSHIP_KINDS = ["prerequisite", "part_of", "related"] as const;
export type RelationshipKind = (typeof RELATIONSHIP_KINDS)[number];

export type ConceptCitationSeed = {
  documentSlug: "pub725-course-book" | "chapter-1-agency-notes";
  heading: string;
  pdfPage: number;
  printedPage?: number;
  layer: "course_book" | "chapter_notes";
};

export type ConceptSeed = {
  slug: string;
  name: string;
  chapterNumber: 1;
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
};
