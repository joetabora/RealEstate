import type { PrismaClient } from "@prisma/client";
import { resolveCitedSectionId } from "@/lib/knowledge/seed";
import { canonicalPairKey } from "@/lib/knowledge/types";
import { PHASE5_CH1_QUESTIONS } from "./chapter1";
import { PHASE5_CH2_QUESTIONS } from "./chapter2";
import {
  citationsForQuestion,
  pairKeyForQuestion,
  type QuestionSeed,
} from "./catalog";

const ALL_QUESTIONS: readonly QuestionSeed[] = [
  ...PHASE5_CH1_QUESTIONS,
  ...PHASE5_CH2_QUESTIONS,
];

export async function seedPhase5(prisma: PrismaClient, editionId: string) {
  const catalogSlugs = ALL_QUESTIONS.map((question) => question.slug);
  const concepts = await prisma.concept.findMany({
    where: { editionId },
    select: { id: true, slug: true },
  });
  const conceptIds = new Map(concepts.map((row) => [row.slug, row.id]));

  const pairs = await prisma.confusionPair.findMany({
    where: { editionId, active: true },
    select: { id: true, canonicalKey: true },
  });
  const pairIds = new Map(pairs.map((row) => [row.canonicalKey, row.id]));

  const categories = await prisma.examCategory.findMany({
    where: { editionId },
    select: { id: true, code: true },
  });
  const categoryIds = new Map(categories.map((row) => [row.code, row.id]));

  let questionCount = 0;

  for (const [index, seed] of ALL_QUESTIONS.entries()) {
    const conceptId = seed.conceptSlug ? conceptIds.get(seed.conceptSlug) ?? null : null;
    if (seed.conceptSlug && !conceptId) {
      throw new Error(`Concept ${seed.conceptSlug} is missing. Seed knowledge catalogs first.`);
    }

    const pairKey = pairKeyForQuestion(seed);
    const pairId = pairKey ? pairIds.get(pairKey) ?? null : null;
    if (pairKey && !pairId) {
      throw new Error(`Confusion pair ${pairKey} is missing. Seed knowledge catalogs first.`);
    }

    if (seed.options.filter((option) => option.isCorrect).length !== 1) {
      throw new Error(`Question ${seed.slug} must have exactly one correct option.`);
    }

    const row = await prisma.question.upsert({
      where: {
        editionId_slug: {
          editionId,
          slug: seed.slug,
        },
      },
      create: {
        editionId,
        slug: seed.slug,
        kind: "mcq",
        informationClass: seed.informationClass,
        lifecycle: "active",
        chapterNumber: seed.chapterNumber,
        stem: seed.stem,
        remediationWhyMissed: seed.remediationWhyMissed,
        remediationDistinction: seed.remediationDistinction,
        conceptId,
        pairId,
        sortOrder: index + 1,
      },
      update: {
        kind: "mcq",
        informationClass: seed.informationClass,
        lifecycle: "active",
        chapterNumber: seed.chapterNumber,
        stem: seed.stem,
        remediationWhyMissed: seed.remediationWhyMissed,
        remediationDistinction: seed.remediationDistinction,
        conceptId,
        pairId,
        sortOrder: index + 1,
      },
    });
    questionCount += 1;

    await prisma.questionOption.deleteMany({ where: { questionId: row.id } });
    for (const [optionIndex, option] of seed.options.entries()) {
      await prisma.questionOption.create({
        data: {
          questionId: row.id,
          key: option.key,
          body: option.body,
          isCorrect: option.isCorrect,
          sortOrder: optionIndex + 1,
        },
      });
    }

    await prisma.questionCitation.deleteMany({ where: { questionId: row.id } });
    for (const citation of citationsForQuestion(seed)) {
      const sectionId = await resolveCitedSectionId(prisma, citation);
      await prisma.questionCitation.create({
        data: {
          questionId: row.id,
          sectionId,
          documentSlug: citation.documentSlug,
          heading: citation.heading,
          pdfPage: citation.pdfPage,
          printedPage: citation.printedPage ?? null,
          layer: citation.layer,
        },
      });
    }

    await prisma.questionExamCategory.deleteMany({ where: { questionId: row.id } });
    for (const code of seed.examCategoryCodes) {
      const examCategoryId = categoryIds.get(code);
      if (!examCategoryId) {
        throw new Error(`Exam category ${code} is missing for question ${seed.slug}.`);
      }
      await prisma.questionExamCategory.create({
        data: {
          questionId: row.id,
          examCategoryId,
        },
      });
    }
  }

  await prisma.question.deleteMany({
    where: {
      editionId,
      slug: { notIn: catalogSlugs },
    },
  });

  return { questionCount, pairKeySample: canonicalPairKey("client", "customer") };
}

export { PHASE5_CH1_QUESTIONS } from "./chapter1";
export { PHASE5_CH2_QUESTIONS } from "./chapter2";
export {
  citationsForQuestion,
  pairKeyForQuestion,
  type QuestionSeed,
  type QuestionOptionSeed,
  type QuestionCitationSeed,
} from "./catalog";
