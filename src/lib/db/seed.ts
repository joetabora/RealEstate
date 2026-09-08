import type { PrismaClient } from "@prisma/client";
import {
  COURSE_EDITION_SEED,
  LOCAL_LEARNER_KEY,
  SALESPERSON_EXAM_CATEGORIES,
} from "../blueprint";

export async function seedCourseEdition(prisma: PrismaClient) {
  return prisma.courseEdition.upsert({
    where: { slug: COURSE_EDITION_SEED.slug },
    create: { ...COURSE_EDITION_SEED },
    update: {
      name: COURSE_EDITION_SEED.name,
      jurisdiction: COURSE_EDITION_SEED.jurisdiction,
    },
  });
}

export async function seedExamBlueprint(prisma: PrismaClient, editionId: string) {
  const categories = [];

  for (const category of SALESPERSON_EXAM_CATEGORIES) {
    const row = await prisma.examCategory.upsert({
      where: {
        editionId_code: {
          editionId,
          code: category.code,
        },
      },
      create: {
        editionId,
        code: category.code,
        name: category.name,
        weight: category.weight,
        sortOrder: category.sortOrder,
      },
      update: {
        name: category.name,
        weight: category.weight,
        sortOrder: category.sortOrder,
      },
    });
    categories.push(row);
  }

  return categories;
}

export async function ensureLocalLearner(prisma: PrismaClient) {
  return prisma.learner.upsert({
    where: { key: LOCAL_LEARNER_KEY },
    create: { key: LOCAL_LEARNER_KEY },
    update: {},
  });
}

export async function seedPhase1(prisma: PrismaClient) {
  const edition = await seedCourseEdition(prisma);
  const examCategories = await seedExamBlueprint(prisma, edition.id);
  const learner = await ensureLocalLearner(prisma);

  return { edition, examCategories, learner };
}
