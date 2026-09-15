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
  CHAPTER_14_CONCEPTS,
  activateConfusionPairs,
  canonicalPairKey,
  seedPhase3,
} from "@/lib/knowledge";
import {
  PHASE4_ASSETS,
  PHASE4_CH2_ASSETS,
  PHASE4_CH3_ASSETS,
  PHASE4_CH4_ASSETS,
  PHASE4_CH5_ASSETS,
  PHASE4_CH6_ASSETS,
  PHASE4_CH7_ASSETS,
  PHASE4_CH8_ASSETS,
  PHASE4_CH9_ASSETS,
  PHASE4_CH10_ASSETS,
  PHASE4_CH11_ASSETS,
  PHASE4_CH12_ASSETS,
  PHASE4_CH13_ASSETS,
  PHASE4_CH14_ASSETS,
  PLANNER_VERSION_CH1,
  PLANNER_VERSION_CH2,
  PLANNER_VERSION_CH3,
  PLANNER_VERSION_CH4,
  PLANNER_VERSION_CH5,
  PLANNER_VERSION_CH6,
  PLANNER_VERSION_CH7,
  PLANNER_VERSION_CH8,
  PLANNER_VERSION_CH9,
  PLANNER_VERSION_CH10,
  PLANNER_VERSION_CH11,
  PLANNER_VERSION_CH12,
  PLANNER_VERSION_CH13,
  PLANNER_VERSION_CH14,
  TEACH_ME_PLANNER_VERSIONS,
  seedPhase4,
} from "@/lib/teach-me";
import { startOrResumeTeachMeSession, completeSessionItem } from "@/lib/teach-me/session";
import {
  PHASE5_CH1_QUESTIONS,
  PHASE5_CH2_QUESTIONS,
  PHASE5_CH3_QUESTIONS,
  PHASE5_CH4_QUESTIONS,
  PHASE5_CH5_QUESTIONS,
  PHASE5_CH6_QUESTIONS,
  PHASE5_CH7_QUESTIONS,
  PHASE5_CH8_QUESTIONS,
  PHASE5_CH9_QUESTIONS,
  PHASE5_CH10_QUESTIONS,
  PHASE5_CH11_QUESTIONS,
  PHASE5_CH12_QUESTIONS,
  PHASE5_CH13_QUESTIONS,
  PHASE5_CH14_QUESTIONS,
  seedPhase5,
  startOrResumeChapterPractice,
} from "@/lib/questions";
import { submitPracticeAnswer } from "@/lib/questions/session";
import { TEACH_ME_REVIEW_QUALITY } from "@/lib/mastery";

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
    expect(tables.map((row) => row.tablename)).toEqual(
      expect.arrayContaining(["CourseEdition", "Concept", "LearningAsset", "LearningSession"]),
    );
  });

  it("seeds a deterministic CourseEdition and 140-weight blueprint", async ({ skip }) => {
    if (!(await databaseIsReachable())) {
      skip();
      return;
    }
    const first = await seedPhase1(prisma);
    expect(first.edition.slug).toBe(COURSE_EDITION_SEED.slug);
    expect(examCategoryWeightTotal(first.examCategories)).toBe(140);
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

  it("seeds Chapter 1–14 concepts and active confusion pairs idempotently", async ({ skip }) => {
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
      await prisma.concept.count({ where: { editionId: edition.id, chapterNumber: 14 } }),
    ).toBe(CHAPTER_14_CONCEPTS.length);
    const pairs = await prisma.confusionPair.findMany({
      where: { editionId: edition.id, active: true },
    });
    expect(
      pairs.some(
        (pair) =>
          pair.canonicalKey === canonicalPairKey("client-funds", "non-client-funds"),
      ),
    ).toBe(true);
  });

  it("seeds Ch1–Ch14 assets and advances sittings only after prior chapters complete", async ({
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
        PHASE4_CH4_ASSETS.length +
        PHASE4_CH5_ASSETS.length +
        PHASE4_CH6_ASSETS.length +
        PHASE4_CH7_ASSETS.length +
        PHASE4_CH8_ASSETS.length +
        PHASE4_CH9_ASSETS.length +
        PHASE4_CH10_ASSETS.length +
        PHASE4_CH11_ASSETS.length +
        PHASE4_CH12_ASSETS.length +
        PHASE4_CH13_ASSETS.length +
        PHASE4_CH14_ASSETS.length,
    );

    await prisma.sessionItem.deleteMany({});
    await prisma.learningSession.deleteMany({});

    const expected = [
      PLANNER_VERSION_CH1,
      PLANNER_VERSION_CH2,
      PLANNER_VERSION_CH3,
      PLANNER_VERSION_CH4,
      PLANNER_VERSION_CH5,
      PLANNER_VERSION_CH6,
      PLANNER_VERSION_CH7,
      PLANNER_VERSION_CH8,
      PLANNER_VERSION_CH9,
      PLANNER_VERSION_CH10,
      PLANNER_VERSION_CH11,
      PLANNER_VERSION_CH12,
      PLANNER_VERSION_CH13,
      PLANNER_VERSION_CH14,
    ];
    expect(TEACH_ME_PLANNER_VERSIONS).toEqual(expected);

    for (const [index, version] of expected.entries()) {
      const session = await startOrResumeTeachMeSession();
      expect(session.plannerVersion).toBe(version);
      if (index < expected.length - 1) {
        await completeSession(session.id);
      } else {
        expect(await prisma.sessionItem.count({ where: { sessionId: session.id } })).toBe(
          PHASE4_CH14_ASSETS.length,
        );
      }
    }
  });

  it("seeds Chapter 1–14 practice questions and records attempts with knowledge vs performance", async ({
    skip,
  }) => {
    if (!(await databaseIsReachable())) {
      skip();
      return;
    }
    const { edition } = await seedPhase1(prisma);
    await seedPhase3(prisma, edition.id);
    await seedPhase4(prisma, edition.id);
    const seeded = await seedPhase5(prisma, edition.id);
    expect(seeded.questionCount).toBe(
      PHASE5_CH1_QUESTIONS.length +
        PHASE5_CH2_QUESTIONS.length +
        PHASE5_CH3_QUESTIONS.length +
        PHASE5_CH4_QUESTIONS.length +
        PHASE5_CH5_QUESTIONS.length +
        PHASE5_CH6_QUESTIONS.length +
        PHASE5_CH7_QUESTIONS.length +
        PHASE5_CH8_QUESTIONS.length +
        PHASE5_CH9_QUESTIONS.length +
        PHASE5_CH10_QUESTIONS.length +
        PHASE5_CH11_QUESTIONS.length +
        PHASE5_CH12_QUESTIONS.length +
        PHASE5_CH13_QUESTIONS.length +
        PHASE5_CH14_QUESTIONS.length,
    );
    expect(
      await prisma.question.count({
        where: { editionId: edition.id, chapterNumber: 14, lifecycle: "active" },
      }),
    ).toBe(PHASE5_CH14_QUESTIONS.length);

    await prisma.sessionItem.deleteMany({});
    await prisma.learningSession.deleteMany({});
    await prisma.mistake.deleteMany({});
    await prisma.questionAttempt.deleteMany({});
    await prisma.knowledgeState.deleteMany({});
    await prisma.performanceState.deleteMany({});
    await prisma.reviewSchedule.deleteMany({});

    const session = await startOrResumeChapterPractice(14);
    const item = await prisma.sessionItem.findFirst({
      where: { sessionId: session.id, completedAt: null },
      include: { question: { include: { options: true } } },
      orderBy: { sortOrder: "asc" },
    });
    expect(item?.question).toBeTruthy();
    const wrong = item!.question!.options.find((option) => !option.isCorrect);
    const right = item!.question!.options.find((option) => option.isCorrect);
    expect(wrong && right).toBeTruthy();

    const miss = await submitPracticeAnswer({
      sessionId: session.id,
      itemId: item!.id,
      optionId: wrong!.id,
      confidence: 5,
    });
    expect(miss.correct).toBe(false);
    expect(await prisma.mistake.count({ where: { resolvedAt: null } })).toBeGreaterThan(0);
    expect(await prisma.questionAttempt.count()).toBe(1);
    expect(await prisma.reviewSchedule.count()).toBeGreaterThan(0);

    const retest = await prisma.sessionItem.findFirst({
      where: {
        sessionId: session.id,
        questionId: item!.questionId!,
        completedAt: null,
      },
      include: { question: { include: { options: true } } },
      orderBy: { sortOrder: "asc" },
    });
    expect(retest).toBeTruthy();
    const hit = await submitPracticeAnswer({
      sessionId: session.id,
      itemId: retest!.id,
      optionId: retest!.question!.options.find((option) => option.isCorrect)!.id,
      confidence: 3,
    });
    expect(hit.correct).toBe(true);
    expect(await prisma.performanceState.count()).toBeGreaterThan(0);
    expect(await prisma.knowledgeState.count()).toBeGreaterThan(0);
    expect(await prisma.reviewSchedule.count()).toBeGreaterThan(0);

    const learner = await prisma.learner.findFirstOrThrow({
      where: { key: LOCAL_LEARNER_KEY },
    });
    const schedules = await prisma.reviewSchedule.findMany({
      where: { learnerId: learner.id },
    });
    expect(schedules.length).toBeGreaterThan(0);
    await prisma.reviewSchedule.updateMany({
      where: { id: { in: schedules.map((row) => row.id) } },
      data: { dueAt: new Date("2000-01-01T00:00:00.000Z") },
    });
    const { getReviewQueueSummary } = await import("@/lib/mastery");
    const summary = await getReviewQueueSummary({
      prisma,
      learnerId: learner.id,
      now: new Date("2026-09-15T12:00:00.000Z"),
    });
    expect(summary.overdueCount).toBeGreaterThan(0);
    expect(summary.scheduledCount).toBeGreaterThan(0);
    expect(summary.overdueConcepts.length).toBeGreaterThan(0);
  });

  it("advances ReviewSchedule when a Teach Me repair item is completed", async ({ skip }) => {
    if (!(await databaseIsReachable())) {
      skip();
      return;
    }

    const { edition } = await seedPhase1(prisma);
    await ensureLocalLearner(prisma);
    await seedPhase3(prisma, edition.id);
    await seedPhase4(prisma, edition.id);

    const learner = await prisma.learner.findFirstOrThrow({
      where: { key: LOCAL_LEARNER_KEY },
    });
    const asset = await prisma.learningAsset.findFirstOrThrow({
      where: {
        editionId: edition.id,
        lifecycle: "active",
        conceptId: { not: null },
      },
    });
    const conceptId = asset.conceptId!;

    await prisma.reviewSchedule.deleteMany({ where: { learnerId: learner.id } });
    await prisma.reviewSchedule.create({
      data: {
        learnerId: learner.id,
        conceptId,
        dueAt: new Date("2000-01-01T00:00:00.000Z"),
        intervalDays: 1,
        easeFactor: 2.5,
        repetitions: 0,
        lapses: 1,
        lastQuality: 1,
      },
    });

    await prisma.sessionItem.deleteMany({});
    await prisma.learningSession.deleteMany({});

    const session = await prisma.learningSession.create({
      data: {
        learnerId: learner.id,
        editionId: edition.id,
        objective: "Phase 6 repair schedule test",
        targetMinutes: 5,
        plannerVersion: PLANNER_VERSION_CH1,
        items: {
          create: [
            {
              sortOrder: 0,
              kind: "repair",
              reasonCodes: ["adaptive_mistake", "repair"],
              conceptId,
              assetId: asset.id,
            },
          ],
        },
      },
      include: { items: true },
    });

    const before = new Date("2026-09-15T12:00:00.000Z");
    await completeSessionItem(session.id, session.items[0]!.id);

    const schedule = await prisma.reviewSchedule.findUniqueOrThrow({
      where: {
        learnerId_conceptId: { learnerId: learner.id, conceptId },
      },
    });
    expect(schedule.lastQuality).toBe(TEACH_ME_REVIEW_QUALITY);
    expect(schedule.dueAt.getTime()).toBeGreaterThan(before.getTime());
    expect(schedule.repetitions).toBeGreaterThan(0);
  });
});
