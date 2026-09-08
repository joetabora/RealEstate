import { COURSE_EDITION_SEED, SALESPERSON_EXAM_CATEGORIES } from "@/lib/blueprint";
import { getLocalLearner } from "@/lib/learner";
import {
  buildTeachMeHomeData,
  buildTeachMeHomeFallback,
  type TeachMeHomeData,
} from "@/lib/teach-me/home-data";

export type { TeachMeHomeData } from "@/lib/teach-me/home-data";
export { buildTeachMeHomeData, buildTeachMeHomeFallback } from "@/lib/teach-me/home-data";

export async function getTeachMeHome(): Promise<TeachMeHomeData> {
  try {
    const { prisma } = await import("@/lib/db/prisma");
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
