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
  activateConfusionPairs,
  canonicalPairKey,
  seedPhase3,
} from "@/lib/knowledge";
import {
  PHASE4_ASSETS,
  PHASE4_CH2_ASSETS,
  PLANNER_VERSION_CH1,
  PLANNER_VERSION_CH2,
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
        "SourceAsset",
        "VisualAnchor",
        "SourceSupersession",
        "Concept",
        "ConceptCitation",
        "ConceptExamCategory",
        "ConceptRelationship",
        "ConfusionPair",
        "ConfusionEvidence",
        "LearningAsset",
        "AssetCitation",
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
    expect(second.examCategories.map((c) => c.id).sort()).toEqual(
      first.examCategories.map((c) => c.id).sort(),
    );
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

    const count = await prisma.learner.count({
      where: { key: LOCAL_LEARNER_KEY },
    });
    expect(count).toBe(1);
  });

  it("seeds Chapter 1–2 concepts and active confusion pairs idempotently", async ({ skip }) => {
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
    expect(second.pairCount).toBe(first.pairCount);

    const chapter1Count = await prisma.concept.count({
      where: { editionId: edition.id, chapterNumber: 1 },
    });
    const chapter2Count = await prisma.concept.count({
      where: { editionId: edition.id, chapterNumber: 2 },
    });
    expect(chapter1Count).toBe(CHAPTER_1_CONCEPTS.length);
    expect(chapter2Count).toBe(CHAPTER_2_CONCEPTS.length);

    const pairs = await prisma.confusionPair.findMany({
      where: { editionId: edition.id, active: true },
      include: { conceptA: true, conceptB: true },
    });
    const slugs = new Set(ALL_CONCEPT_CATALOGS.map((concept) => concept.slug));
    expect(pairs.every((pair) => slugs.has(pair.conceptA.slug) && slugs.has(pair.conceptB.slug))).toBe(
      true,
    );
    expect(
      pairs.some(
        (pair) => pair.canonicalKey === canonicalPairKey("client", "customer"),
      ),
    ).toBe(true);
    expect(
      pairs.some(
        (pair) =>
          pair.canonicalKey ===
          canonicalPairKey("exclusive-agency-listing", "exclusive-right-to-sell-listing"),
      ),
    ).toBe(true);
  });

  it("seeds Ch1+Ch2 assets and keeps Chapter 2 closed until Chapter 1 completes", async ({
    skip,
  }) => {
    if (!(await databaseIsReachable())) {
      skip();
      return;
    }

    const { edition } = await seedPhase1(prisma);
    await seedPhase3(prisma, edition.id);
    const first = await seedPhase4(prisma, edition.id);
    const second = await seedPhase4(prisma, edition.id);
    expect(first.assetCount).toBe(PHASE4_ASSETS.length + PHASE4_CH2_ASSETS.length);
    expect(second.assetCount).toBe(first.assetCount);

    await prisma.sessionItem.deleteMany({});
    await prisma.learningSession.deleteMany({});

    const created = await startOrResumeTeachMeSession();
    expect(created.plannerVersion).toBe(PLANNER_VERSION_CH1);
    const resumed = await startOrResumeTeachMeSession();
    expect(resumed.id).toBe(created.id);
    const itemCount = await prisma.sessionItem.count({ where: { sessionId: created.id } });
    expect(itemCount).toBe(PHASE4_ASSETS.length);

    await prisma.sessionItem.updateMany({
      where: { sessionId: created.id },
      data: { completedAt: new Date() },
    });
    await prisma.learningSession.update({
      where: { id: created.id },
      data: { completedAt: new Date() },
    });

    const chapter2 = await startOrResumeTeachMeSession();
    expect(chapter2.plannerVersion).toBe(PLANNER_VERSION_CH2);
    expect(chapter2.id).not.toBe(created.id);
    const ch2Items = await prisma.sessionItem.count({ where: { sessionId: chapter2.id } });
    expect(ch2Items).toBe(PHASE4_CH2_ASSETS.length);
  });
});
