import { PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";
import {
  COURSE_EDITION_SEED,
  LOCAL_LEARNER_KEY,
  examCategoryWeightTotal,
} from "@/lib/blueprint";
import { ensureLocalLearner, seedPhase1 } from "@/lib/db/seed";

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
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
});
