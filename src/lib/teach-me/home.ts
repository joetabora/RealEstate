import {
  COURSE_EDITION_SEED,
  LOCAL_LEARNER_KEY,
  SALESPERSON_EXAM_CATEGORIES,
  SALESPERSON_EXAM_ITEM_TOTAL,
  selectStartingExamCategory,
} from "@/lib/blueprint";
import { prisma } from "@/lib/db/prisma";
import { getLocalLearner } from "@/lib/learner";

export type ExamCategorySummary = {
  code: string;
  name: string;
  weight: number;
};

export type TeachMeHomeData = {
  learnerKey: string;
  edition: {
    slug: string;
    name: string;
    jurisdiction: string;
  };
  examItemTotal: number;
  startingCategory: ExamCategorySummary;
  categories: ExamCategorySummary[];
  hasSession: boolean;
  databaseConnected: boolean;
};

export function buildTeachMeHomeData(input: {
  learnerKey: string;
  edition: TeachMeHomeData["edition"];
  categories: ExamCategorySummary[];
  hasSession: boolean;
  databaseConnected: boolean;
}): TeachMeHomeData {
  const startingCategory = selectStartingExamCategory(input.categories);

  return {
    learnerKey: input.learnerKey,
    edition: input.edition,
    examItemTotal: SALESPERSON_EXAM_ITEM_TOTAL,
    startingCategory: {
      code: startingCategory.code,
      name: startingCategory.name,
      weight: startingCategory.weight,
    },
    categories: input.categories.map((category) => ({
      code: category.code,
      name: category.name,
      weight: category.weight,
    })),
    hasSession: input.hasSession,
    databaseConnected: input.databaseConnected,
  };
}

export function buildTeachMeHomeFallback(): TeachMeHomeData {
  return buildTeachMeHomeData({
    learnerKey: LOCAL_LEARNER_KEY,
    edition: COURSE_EDITION_SEED,
    categories: [...SALESPERSON_EXAM_CATEGORIES],
    hasSession: false,
    databaseConnected: false,
  });
}

export async function getTeachMeHome(): Promise<TeachMeHomeData> {
  try {
    const edition = await prisma.courseEdition.findUnique({
      where: { slug: COURSE_EDITION_SEED.slug },
      include: {
        examCategories: {
          where: { parentId: null },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!edition) {
      throw new Error(
        `Course edition "${COURSE_EDITION_SEED.slug}" is missing. Run: npx prisma db seed`,
      );
    }

    const learner = await getLocalLearner(prisma);
    const sessionCount = await prisma.learningSession.count({
      where: { learnerId: learner.id },
    });

    const categories =
      edition.examCategories.length > 0
        ? edition.examCategories
        : [...SALESPERSON_EXAM_CATEGORIES];

    return buildTeachMeHomeData({
      learnerKey: learner.key,
      edition: {
        slug: edition.slug,
        name: edition.name,
        jurisdiction: edition.jurisdiction,
      },
      categories,
      hasSession: sessionCount > 0,
      databaseConnected: true,
    });
  } catch {
    return buildTeachMeHomeFallback();
  }
}
