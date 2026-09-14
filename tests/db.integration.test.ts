import { PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";
import {
  COURSE_EDITION_SEED,
  LOCAL_LEARNER_KEY,
  examCategoryWeightTotal,
} from "@/lib/blueprint";
import { ensureLocalLearner, seedPhase1 } from "@/lib/db/seed";
import { prisma as appPrisma } from "@/lib/db/prisma";
import {
  ALL_CONCEPT_CATALOGS,
  ALL_CONFUSION_PAIR_CATALOGS,
  CHAPTER_1_CONCEPTS,
  CHAPTER_2_CONCEPTS,
  CHAPTER_3_CONCEPTS,
  CHAPTER_4_CONCEPTS,
  activateConfusionPairs,
  canonicalPairKey,
  seedPhase3,
} from "@/lib/knowledge";
import {
  PHASE4_ASSETS,
  PHASE4_CH2_ASSETS,
  PHASE4_CH3_ASSETS,
  PHASE4_CH4_ASSETS,
  PLANNER_VERSION_CH1,
  PLANNER_VERSION_CH2,
  PLANNER_VERSION_CH3,
  PLANNER_VERSION_CH4,
  seedPhase4,
} from "@/lib/teach-me";
import { startOrResumeTeachMeSession } from "@/lib/teach-me/session";

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
  await appPrisma.$disconnect();
});

async function databaseIsReachable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

async function completeSession(sessionId: string) {
  await prisma.sessionItem.updateMany({
    where: { sessionId },
    data: { completedAt: new Date() },
  });
  await prisma.learningSession.update({
    where: { id: sessionId },
    data: { completedAt: new Date() },
  });
}

describe("database seed (integration)", () => {
  it("applies migrations (schema is queryable)", async ({ skip }) => {
    if (!(await databaseIsReachable())) {
      skip();
      return;
    }

    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;
    const names = tables.map((row) => row.tablename);
    expect(names).toEqual(
      expect.arrayContaining([
        "CourseEdition",
        "ExamCategory",
        "Learner",
        "LearningSession",
        "SessionItem",
        "SourceDocument",
        "SourceSection",
        "Concept",
        "LearningAsset",
      ]),
    );
  });

  it("seeds a deterministic CourseEdition and 140-weight blueprint", async ({ skip }) => {
    if (!(await databaseIsReachable())) {
      skip();
      return;
    }

    const first = await seedPhase1(prisma);
    const second = await seedPhase1(prisma);

    expect(first.edition.slug).toBe(COURSE_EDITION_SEED.slug);
    expect(first.edition.jurisdiction).toBe("WI");
    expect(second.edition.id).toBe(first.edition.id);
    expect(examCategoryWeightTotal(first.examCategories)).toBe(140);
    expect(first.examCategories).toHaveLength(10);
  });

  it("keeps the local learner a singleton", async ({ skip }) => {
    if (!(await databaseIsReachable())) {
      skip();
      return;
    }

    const a = await ensureLocalLearner(prisma);
    const b = await ensureLocalLearner(prisma);
    expect(a.key).toBe(LOCAL_LEARNER_KEY);
    expect(b.id).toBe(a.id);
  });

  it("seeds Chapter 1–4 concepts and active confusion pairs idempotently", async ({ skip }) => {
    if (!(await databaseIsReachable())) {
      skip();
      return;
    }

    const { edition } = await seedPhase1(prisma);
    const first = await seedPhase3(prisma, edition.id);
    const second = await seedPhase3(prisma, edition.id);
    const expectedPairs = activateConfusionPairs(
      ALL_CONCEPT_CATALOGS.map((concept) => concept.slug),
      ALL_CONFUSION_PAIR_CATALOGS,
    );

    expect(first.conceptCount).toBe(ALL_CONCEPT_CATALOGS.length);
    expect(second.conceptCount).toBe(first.conceptCount);
    expect(first.pairCount).toBe(expectedPairs.length);

    expect(
      await prisma.concept.count({ where: { editionId: edition.id, chapterNumber: 1 } }),
    ).toBe(CHAPTER_1_CONCEPTS.length);
    expect(
      await prisma.concept.count({ where: { editionId: edition.id, chapterNumber: 2 } }),
    ).toBe(CHAPTER_2_CONCEPTS.length);
    expect(
      await prisma.concept.count({ where: { editionId: edition.id, chapterNumber: 3 } }),
    ).toBe(CHAPTER_3_CONCEPTS.length);
    expect(
      await prisma.concept.count({ where: { editionId: edition.id, chapterNumber: 4 } }),
    ).toBe(CHAPTER_4_CONCEPTS.length);

    const pairs = await prisma.confusionPair.findMany({
      where: { editionId: edition.id, active: true },
    });
    expect(
      pairs.some(
        (pair) =>
          pair.canonicalKey ===
          canonicalPairKey("disclosure-by-owners", "licensee-disclosure-obligations"),
      ),
    ).toBe(true);
  });

  it("seeds Ch1–Ch4 assets and advances sittings only after prior chapters complete", async ({
    skip,
  }) => {
    if (!(await databaseIsReachable())) {
      skip();
      return;
    }

    const { edition } = await seedPhase1(prisma);
    await seedPhase3(prisma, edition.id);
    const first = await seedPhase4(prisma, edition.id);
    expect(first.assetCount).toBe(
      PHASE4_ASSETS.length +
        PHASE4_CH2_ASSETS.length +
        PHASE4_CH3_ASSETS.length +
        PHASE4_CH4_ASSETS.length,
    );

    await prisma.sessionItem.deleteMany({});
    await prisma.learningSession.deleteMany({});

    const chapter1 = await startOrResumeTeachMeSession();
    expect(chapter1.plannerVersion).toBe(PLANNER_VERSION_CH1);
    await completeSession(chapter1.id);

    const chapter2 = await startOrResumeTeachMeSession();
    expect(chapter2.plannerVersion).toBe(PLANNER_VERSION_CH2);
    await completeSession(chapter2.id);

    const chapter3 = await startOrResumeTeachMeSession();
    expect(chapter3.plannerVersion).toBe(PLANNER_VERSION_CH3);
    await completeSession(chapter3.id);

    const chapter4 = await startOrResumeTeachMeSession();
    expect(chapter4.plannerVersion).toBe(PLANNER_VERSION_CH4);
    expect(await prisma.sessionItem.count({ where: { sessionId: chapter4.id } })).toBe(
      PHASE4_CH4_ASSETS.length,
    );
  });
});
