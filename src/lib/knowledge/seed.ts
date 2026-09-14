import type { PrismaClient } from "@prisma/client";
import { CHAPTER_1_CONCEPTS, CHAPTER_1_CONFUSION_PAIRS } from "./chapter1";
import { CHAPTER_2_CONCEPTS, CHAPTER_2_CONFUSION_PAIRS } from "./chapter2";
import { CHAPTER_3_CONCEPTS, CHAPTER_3_CONFUSION_PAIRS } from "./chapter3";
import { CHAPTER_4_CONCEPTS, CHAPTER_4_CONFUSION_PAIRS } from "./chapter4";
import { CHAPTER_5_CONCEPTS, CHAPTER_5_CONFUSION_PAIRS } from "./chapter5";
import { CHAPTER_6_CONCEPTS, CHAPTER_6_CONFUSION_PAIRS } from "./chapter6";
import { CHAPTER_7_CONCEPTS, CHAPTER_7_CONFUSION_PAIRS } from "./chapter7";
import { CHAPTER_8_CONCEPTS, CHAPTER_8_CONFUSION_PAIRS } from "./chapter8";
import { CHAPTER_9_CONCEPTS, CHAPTER_9_CONFUSION_PAIRS } from "./chapter9";
import { CHAPTER_10_CONCEPTS, CHAPTER_10_CONFUSION_PAIRS } from "./chapter10";
import { CHAPTER_11_CONCEPTS, CHAPTER_11_CONFUSION_PAIRS } from "./chapter11";
import { CHAPTER_12_CONCEPTS, CHAPTER_12_CONFUSION_PAIRS } from "./chapter12";
import { CHAPTER_13_CONCEPTS, CHAPTER_13_CONFUSION_PAIRS } from "./chapter13";
import { CHAPTER_14_CONCEPTS, CHAPTER_14_CONFUSION_PAIRS } from "./chapter14";
import { activateConfusionPairs, canonicalPairKey } from "./types";
import type { ConceptSeed, ConfusionPairSeed } from "./types";

export const ALL_CONCEPT_CATALOGS: readonly ConceptSeed[] = [
  ...CHAPTER_1_CONCEPTS,
  ...CHAPTER_2_CONCEPTS,
  ...CHAPTER_3_CONCEPTS,
  ...CHAPTER_4_CONCEPTS,
  ...CHAPTER_5_CONCEPTS,
  ...CHAPTER_6_CONCEPTS,
  ...CHAPTER_7_CONCEPTS,
  ...CHAPTER_8_CONCEPTS,
  ...CHAPTER_9_CONCEPTS,
  ...CHAPTER_10_CONCEPTS,
  ...CHAPTER_11_CONCEPTS,
  ...CHAPTER_12_CONCEPTS,
  ...CHAPTER_13_CONCEPTS,
  ...CHAPTER_14_CONCEPTS,
];

export const ALL_CONFUSION_PAIR_CATALOGS: readonly ConfusionPairSeed[] = [
  ...CHAPTER_1_CONFUSION_PAIRS,
  ...CHAPTER_2_CONFUSION_PAIRS,
  ...CHAPTER_3_CONFUSION_PAIRS,
  ...CHAPTER_4_CONFUSION_PAIRS,
  ...CHAPTER_5_CONFUSION_PAIRS,
  ...CHAPTER_6_CONFUSION_PAIRS,
  ...CHAPTER_7_CONFUSION_PAIRS,
  ...CHAPTER_8_CONFUSION_PAIRS,
  ...CHAPTER_9_CONFUSION_PAIRS,
  ...CHAPTER_10_CONFUSION_PAIRS,
  ...CHAPTER_11_CONFUSION_PAIRS,
  ...CHAPTER_12_CONFUSION_PAIRS,
  ...CHAPTER_13_CONFUSION_PAIRS,
  ...CHAPTER_14_CONFUSION_PAIRS,
];

const CHAPTER_CATALOGS: ReadonlyArray<{
  chapterNumber: number;
  concepts: readonly ConceptSeed[];
}> = [
  { chapterNumber: 1, concepts: CHAPTER_1_CONCEPTS },
  { chapterNumber: 2, concepts: CHAPTER_2_CONCEPTS },
  { chapterNumber: 3, concepts: CHAPTER_3_CONCEPTS },
  { chapterNumber: 4, concepts: CHAPTER_4_CONCEPTS },
  { chapterNumber: 5, concepts: CHAPTER_5_CONCEPTS },
  { chapterNumber: 6, concepts: CHAPTER_6_CONCEPTS },
  { chapterNumber: 7, concepts: CHAPTER_7_CONCEPTS },
  { chapterNumber: 8, concepts: CHAPTER_8_CONCEPTS },
  { chapterNumber: 9, concepts: CHAPTER_9_CONCEPTS },
  { chapterNumber: 10, concepts: CHAPTER_10_CONCEPTS },
  { chapterNumber: 11, concepts: CHAPTER_11_CONCEPTS },
  { chapterNumber: 12, concepts: CHAPTER_12_CONCEPTS },
  { chapterNumber: 13, concepts: CHAPTER_13_CONCEPTS },
  { chapterNumber: 14, concepts: CHAPTER_14_CONCEPTS },
];

export async function seedPhase3(prisma: PrismaClient, editionId: string) {
  const examCategories = await prisma.examCategory.findMany({
    where: { editionId },
  });
  const categoryByCode = new Map(examCategories.map((row) => [row.code, row.id]));
  const conceptIds = new Map<string, string>();

  for (const catalog of CHAPTER_CATALOGS) {
    const catalogSlugs = catalog.concepts.map((concept) => concept.slug);

    for (const [index, seed] of catalog.concepts.entries()) {
      const row = await prisma.concept.upsert({
        where: {
          editionId_slug: {
            editionId,
            slug: seed.slug,
          },
        },
        create: {
          editionId,
          slug: seed.slug,
          name: seed.name,
          chapterNumber: seed.chapterNumber,
          group: seed.group,
          jurisdictionScope: seed.jurisdictionScope,
          sortOrder: index + 1,
        },
        update: {
          name: seed.name,
          chapterNumber: seed.chapterNumber,
          group: seed.group,
          jurisdictionScope: seed.jurisdictionScope,
          sortOrder: index + 1,
        },
      });
      conceptIds.set(seed.slug, row.id);
    }

    await prisma.concept.deleteMany({
      where: {
        editionId,
        chapterNumber: catalog.chapterNumber,
        slug: { notIn: catalogSlugs },
      },
    });
  }

  for (const seed of ALL_CONCEPT_CATALOGS) {
    const rowId = conceptIds.get(seed.slug);
    if (!rowId) continue;

    await prisma.conceptCitation.deleteMany({ where: { conceptId: rowId } });
    await prisma.conceptExamCategory.deleteMany({ where: { conceptId: rowId } });

    for (const code of seed.examCategoryCodes) {
      const examCategoryId = categoryByCode.get(code);
      if (!examCategoryId) {
        throw new Error(`Exam category ${code} is missing. Seed the blueprint first.`);
      }
      await prisma.conceptExamCategory.create({
        data: { conceptId: rowId, examCategoryId },
      });
    }

    for (const citation of seed.citations) {
      const sectionId = await resolveCitedSectionId(prisma, {
        ...citation,
        chapterNumber: seed.chapterNumber,
      });
      await prisma.conceptCitation.create({
        data: {
          conceptId: rowId,
          sectionId,
          documentSlug: citation.documentSlug,
          heading: citation.heading,
          pdfPage: citation.pdfPage,
          printedPage: citation.printedPage ?? null,
          layer: citation.layer,
        },
      });
    }
  }

  const allIds = [...conceptIds.values()];
  await prisma.conceptRelationship.deleteMany({
    where: { fromConceptId: { in: allIds } },
  });

  for (const seed of ALL_CONCEPT_CATALOGS) {
    const fromId = conceptIds.get(seed.slug);
    if (!fromId) continue;

    for (const slug of seed.prerequisites ?? []) {
      const toId = conceptIds.get(slug);
      if (!toId) {
        throw new Error(`Prerequisite ${slug} is missing for ${seed.slug}.`);
      }
      await prisma.conceptRelationship.create({
        data: { fromConceptId: fromId, toConceptId: toId, kind: "prerequisite" },
      });
    }

    for (const slug of seed.partOf ?? []) {
      const toId = conceptIds.get(slug);
      if (!toId) {
        throw new Error(`part_of target ${slug} is missing for ${seed.slug}.`);
      }
      await prisma.conceptRelationship.create({
        data: { fromConceptId: fromId, toConceptId: toId, kind: "part_of" },
      });
    }
  }

  await prisma.confusionPair.deleteMany({
    where: { editionId, source: "seed" },
  });

  const activePairs = activateConfusionPairs(
    ALL_CONCEPT_CATALOGS.map((concept) => concept.slug),
    ALL_CONFUSION_PAIR_CATALOGS,
  );

  for (const pair of activePairs) {
    const [first, second] = [pair.a, pair.b].sort((left, right) => left.localeCompare(right));
    const conceptAId = conceptIds.get(first);
    const conceptBId = conceptIds.get(second);
    if (!conceptAId || !conceptBId) continue;

    const created = await prisma.confusionPair.create({
      data: {
        editionId,
        conceptAId,
        conceptBId,
        canonicalKey: canonicalPairKey(pair.a, pair.b),
        reason: pair.reason,
        source: "seed",
        active: true,
      },
    });
    await prisma.confusionEvidence.create({
      data: {
        pairId: created.id,
        kind: "seed",
        note: pair.reason,
      },
    });
  }

  return {
    conceptCount: conceptIds.size,
    pairCount: activePairs.length,
  };
}

export async function resolveCitedSectionId(
  prisma: PrismaClient,
  citation: { documentSlug: string; heading: string; chapterNumber?: number },
): Promise<string | null> {
  const sections = await prisma.sourceSection.findMany({
    where: {
      document: { slug: citation.documentSlug },
      kind: { not: "chapter" },
      ...(citation.chapterNumber != null ? { chapterNumber: citation.chapterNumber } : {}),
      NOT: { heading: { contains: "(cont.)" } },
    },
    select: { id: true, heading: true },
    orderBy: { sortOrder: "asc" },
  });

  const exact = sections.find((section) => section.heading === citation.heading);
  if (exact) {
    return exact.id;
  }

  const target = normalizeHeading(citation.heading);
  const normalized = sections.find(
    (section) => normalizeHeading(section.heading) === target,
  );
  return normalized?.id ?? null;
}

function normalizeHeading(heading: string): string {
  return heading
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
