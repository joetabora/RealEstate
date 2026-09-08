import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { formatPageCitation } from "@/lib/ingest/citation";
import { CONCEPT_GROUP_LABELS, type ConceptGroup, type JurisdictionScope } from "./types";

export type ConceptListItem = {
  slug: string;
  name: string;
  group: ConceptGroup;
  groupLabel: string;
  jurisdictionScope: JurisdictionScope;
  examCategoryCodes: string[];
  chapterNumber: number;
  citation: string;
  state: "not_started";
};

export type ProgressData = {
  databaseConnected: boolean;
  seeded: boolean;
  conceptCount: number;
  pairCount: number;
  groups: Array<{
    id: ConceptGroup;
    label: string;
    concepts: ConceptListItem[];
  }>;
};

export type ConceptDetailData = {
  slug: string;
  name: string;
  groupLabel: string;
  jurisdictionScope: JurisdictionScope;
  examCategoryCodes: string[];
  chapterNumber: number;
  state: "not_started";
  citations: Array<{
    documentSlug: string;
    heading: string;
    citation: string;
    sectionId: string | null;
    libraryHref: string | null;
  }>;
  prerequisites: Array<{ slug: string; name: string }>;
  requiredBy: Array<{ slug: string; name: string }>;
  partOf: Array<{ slug: string; name: string }>;
  confusionPairs: Array<{
    otherSlug: string;
    otherName: string;
    reason: string;
  }>;
};

export async function getProgressData(): Promise<ProgressData> {
  try {
    const concepts = await prisma.concept.findMany({
      where: { edition: { slug: COURSE_EDITION_SEED.slug } },
      include: {
        examCategories: { include: { examCategory: true } },
        citations: { orderBy: { createdAt: "asc" }, take: 1 },
      },
      orderBy: [{ chapterNumber: "asc" }, { sortOrder: "asc" }],
    });
    const pairCount = await prisma.confusionPair.count({
      where: { edition: { slug: COURSE_EDITION_SEED.slug }, active: true },
    });

    const items: ConceptListItem[] = concepts.map((concept) => {
      const citation = concept.citations[0];
      return {
        slug: concept.slug,
        name: concept.name,
        group: concept.group as ConceptGroup,
        groupLabel: CONCEPT_GROUP_LABELS[concept.group as ConceptGroup] ?? concept.group,
        jurisdictionScope: concept.jurisdictionScope as JurisdictionScope,
        examCategoryCodes: concept.examCategories.map((join) => join.examCategory.code),
        chapterNumber: concept.chapterNumber,
        citation: citation
          ? formatPageCitation({
              printedPageStart: citation.printedPage,
              printedPageEnd: citation.printedPage,
              pdfPageStart: citation.pdfPage,
              pdfPageEnd: citation.pdfPage,
            })
          : "Uncited",
        state: "not_started",
      };
    });

    const groupOrder: ConceptGroup[] = [
      "roles",
      "broker-definition",
      "models",
      "duties",
      "disclosure",
      "office",
    ];

    return {
      databaseConnected: true,
      seeded: items.length > 0,
      conceptCount: items.length,
      pairCount,
      groups: groupOrder
        .map((id) => ({
          id,
          label: CONCEPT_GROUP_LABELS[id],
          concepts: items.filter((item) => item.group === id),
        }))
        .filter((group) => group.concepts.length > 0),
    };
  } catch {
    return {
      databaseConnected: false,
      seeded: false,
      conceptCount: 0,
      pairCount: 0,
      groups: [],
    };
  }
}

export async function getConceptDetail(slug: string): Promise<ConceptDetailData | null> {
  try {
    const concept = await prisma.concept.findFirst({
      where: { slug, edition: { slug: COURSE_EDITION_SEED.slug } },
      include: {
        examCategories: { include: { examCategory: true } },
        citations: { orderBy: { createdAt: "asc" } },
        outgoing: { include: { toConcept: true } },
        incoming: { include: { fromConcept: true } },
        confusionA: { where: { active: true }, include: { conceptB: true } },
        confusionB: { where: { active: true }, include: { conceptA: true } },
      },
    });
    if (!concept) {
      return null;
    }

    const confusionPairs = [
      ...concept.confusionA.map((pair) => ({
        otherSlug: pair.conceptB.slug,
        otherName: pair.conceptB.name,
        reason: pair.reason,
      })),
      ...concept.confusionB.map((pair) => ({
        otherSlug: pair.conceptA.slug,
        otherName: pair.conceptA.name,
        reason: pair.reason,
      })),
    ];

    return {
      slug: concept.slug,
      name: concept.name,
      groupLabel: CONCEPT_GROUP_LABELS[concept.group as ConceptGroup] ?? concept.group,
      jurisdictionScope: concept.jurisdictionScope as JurisdictionScope,
      examCategoryCodes: concept.examCategories.map((join) => join.examCategory.code),
      chapterNumber: concept.chapterNumber,
      state: "not_started",
      citations: concept.citations.map((citation) => ({
        documentSlug: citation.documentSlug,
        heading: citation.heading,
        citation: formatPageCitation({
          printedPageStart: citation.printedPage,
          printedPageEnd: citation.printedPage,
          pdfPageStart: citation.pdfPage,
          pdfPageEnd: citation.pdfPage,
        }),
        sectionId: citation.sectionId,
        libraryHref: citation.sectionId
          ? `/library/${citation.documentSlug}/${citation.sectionId}`
          : `/library/${citation.documentSlug}`,
      })),
      prerequisites: concept.outgoing
        .filter((rel) => rel.kind === "prerequisite")
        .map((rel) => ({ slug: rel.toConcept.slug, name: rel.toConcept.name })),
      requiredBy: concept.incoming
        .filter((rel) => rel.kind === "prerequisite")
        .map((rel) => ({ slug: rel.fromConcept.slug, name: rel.fromConcept.name })),
      partOf: concept.outgoing
        .filter((rel) => rel.kind === "part_of")
        .map((rel) => ({ slug: rel.toConcept.slug, name: rel.toConcept.name })),
      confusionPairs,
    };
  } catch {
    return null;
  }
}
