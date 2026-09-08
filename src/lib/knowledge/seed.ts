import type { PrismaClient } from "@prisma/client";
import { CHAPTER_1_CONCEPTS, CHAPTER_1_CONFUSION_PAIRS } from "./chapter1";
import { activateConfusionPairs, canonicalPairKey } from "./types";
import type { ConceptCitationSeed } from "./types";

export async function seedPhase3(prisma: PrismaClient, editionId: string) {
  const examCategories = await prisma.examCategory.findMany({
    where: { editionId },
  });
  const categoryByCode = new Map(examCategories.map((row) => [row.code, row.id]));
  const catalogSlugs = CHAPTER_1_CONCEPTS.map((concept) => concept.slug);

  const conceptIds = new Map<string, string>();

  for (const [index, seed] of CHAPTER_1_CONCEPTS.entries()) {
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
      chapterNumber: 1,
      slug: { notIn: catalogSlugs },
    },
  });

  for (const seed of CHAPTER_1_CONCEPTS) {
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
      const sectionId = await resolveSectionId(prisma, citation);
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

  const chapter1Ids = [...conceptIds.values()];
  await prisma.conceptRelationship.deleteMany({
    where: { fromConceptId: { in: chapter1Ids } },
  });

  for (const seed of CHAPTER_1_CONCEPTS) {
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
    CHAPTER_1_CONCEPTS.map((concept) => concept.slug),
    CHAPTER_1_CONFUSION_PAIRS,
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

async function resolveSectionId(
  prisma: PrismaClient,
  citation: ConceptCitationSeed,
): Promise<string | null> {
  const sections = await prisma.sourceSection.findMany({
    where: {
      document: { slug: citation.documentSlug },
      kind: { not: "chapter" },
      chapterNumber: 1,
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
