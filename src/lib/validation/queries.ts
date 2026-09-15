import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";

export type ValidationQueueItem = {
  id: string;
  kind: "question" | "learning_asset";
  slug: string;
  title: string;
  lifecycle: string;
  informationClass: string;
  chapterNumber: number | null;
};

export type ValidationHomeData = {
  databaseConnected: boolean;
  queue: ValidationQueueItem[];
  recentEvents: Array<{
    id: string;
    targetKind: string;
    targetId: string;
    gate: string;
    passed: boolean;
    fromLifecycle: string;
    toLifecycle: string;
    reasons: string[];
    createdAt: string;
  }>;
  counts: {
    inPipeline: number;
    validated: number;
    rejected: number;
    active: number;
  };
};

export async function getValidationHomeData(): Promise<ValidationHomeData> {
  try {
    const edition = await prisma.courseEdition.findUnique({
      where: { slug: COURSE_EDITION_SEED.slug },
    });
    if (!edition) {
      return emptyValidationHome(true);
    }

    const pipeline = [
      "generated",
      "source_check",
      "structural_check",
      "answer_check",
      "ambiguity_check",
      "wi_fact_check",
      "validated",
      "rejected",
    ];

    const [questions, assets, recentEvents, activeQ, activeA] = await Promise.all([
      prisma.question.findMany({
        where: { editionId: edition.id, lifecycle: { in: pipeline } },
        orderBy: { updatedAt: "desc" },
        take: 50,
        select: {
          id: true,
          slug: true,
          stem: true,
          lifecycle: true,
          informationClass: true,
          chapterNumber: true,
        },
      }),
      prisma.learningAsset.findMany({
        where: { editionId: edition.id, lifecycle: { in: pipeline } },
        orderBy: { updatedAt: "desc" },
        take: 50,
        select: {
          id: true,
          slug: true,
          title: true,
          lifecycle: true,
          informationClass: true,
        },
      }),
      prisma.contentGateEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.question.count({ where: { editionId: edition.id, lifecycle: "active" } }),
      prisma.learningAsset.count({ where: { editionId: edition.id, lifecycle: "active" } }),
    ]);

    const queue: ValidationQueueItem[] = [
      ...questions.map((q) => ({
        id: q.id,
        kind: "question" as const,
        slug: q.slug,
        title: q.stem.slice(0, 120),
        lifecycle: q.lifecycle,
        informationClass: q.informationClass,
        chapterNumber: q.chapterNumber,
      })),
      ...assets.map((a) => ({
        id: a.id,
        kind: "learning_asset" as const,
        slug: a.slug,
        title: a.title,
        lifecycle: a.lifecycle,
        informationClass: a.informationClass,
        chapterNumber: null,
      })),
    ].sort((a, b) => a.lifecycle.localeCompare(b.lifecycle));

    return {
      databaseConnected: true,
      queue,
      recentEvents: recentEvents.map((e) => ({
        id: e.id,
        targetKind: e.targetKind,
        targetId: e.targetId,
        gate: e.gate,
        passed: e.passed,
        fromLifecycle: e.fromLifecycle,
        toLifecycle: e.toLifecycle,
        reasons: e.reasons,
        createdAt: e.createdAt.toISOString(),
      })),
      counts: {
        inPipeline: queue.filter((q) => q.lifecycle !== "rejected" && q.lifecycle !== "validated")
          .length,
        validated: queue.filter((q) => q.lifecycle === "validated").length,
        rejected: queue.filter((q) => q.lifecycle === "rejected").length,
        active: activeQ + activeA,
      },
    };
  } catch {
    return emptyValidationHome(false);
  }
}

function emptyValidationHome(databaseConnected: boolean): ValidationHomeData {
  return {
    databaseConnected,
    queue: [],
    recentEvents: [],
    counts: { inPipeline: 0, validated: 0, rejected: 0, active: 0 },
  };
}
