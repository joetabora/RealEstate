import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { getLocalLearner } from "@/lib/learner";
import { planTeachMeSitting } from "./planner";
import {
  PLANNER_VERSION_CH1,
  TEACH_ME_PLANNER_VERSIONS,
  recommendedNextForPlanner,
  sittingLabelForPlanner,
} from "./types";

/**
 * Resume any open Teach Me sitting. Otherwise advance through ordered
 * chapter sittings only after each prior sitting is complete.
 */
export async function startOrResumeTeachMeSession() {
  const edition = await prisma.courseEdition.findUnique({
    where: { slug: COURSE_EDITION_SEED.slug },
  });
  if (!edition) {
    throw new Error(`Course edition "${COURSE_EDITION_SEED.slug}" is missing. Run: npx prisma db seed`);
  }

  const learner = await getLocalLearner(prisma);
  const open = await prisma.learningSession.findFirst({
    where: {
      learnerId: learner.id,
      editionId: edition.id,
      plannerVersion: { in: [...TEACH_ME_PLANNER_VERSIONS] },
      completedAt: null,
    },
    orderBy: { startedAt: "desc" },
  });
  if (open) {
    return open;
  }

  const completed = await prisma.learningSession.findMany({
    where: {
      learnerId: learner.id,
      editionId: edition.id,
      plannerVersion: { in: [...TEACH_ME_PLANNER_VERSIONS] },
      completedAt: { not: null },
    },
    select: { plannerVersion: true },
    distinct: ["plannerVersion"],
  });
  const completedPlannerVersions = new Set(
    completed
      .map((row) => row.plannerVersion)
      .filter((version): version is string => Boolean(version)),
  );

  const assets = await prisma.learningAsset.findMany({
    where: { editionId: edition.id, lifecycle: "active" },
    select: { id: true, slug: true, conceptId: true, pairId: true },
  });

  const draft = planTeachMeSitting(assets, { completedPlannerVersions });

  return prisma.learningSession.create({
    data: {
      learnerId: learner.id,
      editionId: edition.id,
      objective: draft.objective,
      targetMinutes: draft.targetMinutes,
      plannerVersion: draft.plannerVersion,
      stateBefore: {
        plannerVersion: draft.plannerVersion,
        assetCount: draft.items.length,
        sitting: sittingLabelForPlanner(draft.plannerVersion),
      },
      items: {
        create: draft.items.map((item) => ({
          sortOrder: item.sortOrder,
          kind: item.kind,
          reasonCodes: item.reasonCodes,
          conceptId: item.conceptId ?? null,
          assetId: item.assetId ?? null,
        })),
      },
      recommendedNext: recommendedNextForPlanner(draft.plannerVersion),
    },
  });
}

/** @deprecated Prefer startOrResumeTeachMeSession. */
export const startOrResumeAgencySession = startOrResumeTeachMeSession;

export async function completeSessionItem(sessionId: string, itemId: string) {
  const item = await prisma.sessionItem.findFirst({
    where: { id: itemId, sessionId },
  });
  if (!item) {
    throw new Error("Session item not found.");
  }
  if (!item.completedAt) {
    await prisma.sessionItem.update({
      where: { id: itemId },
      data: { completedAt: new Date() },
    });
  }

  const remaining = await prisma.sessionItem.count({
    where: { sessionId, completedAt: null },
  });
  if (remaining === 0) {
    const session = await prisma.learningSession.findUnique({ where: { id: sessionId } });
    await prisma.learningSession.update({
      where: { id: sessionId },
      data: {
        completedAt: new Date(),
        recommendedNext: recommendedNextForPlanner(session?.plannerVersion),
        stateAfter: {
          plannerVersion: session?.plannerVersion ?? PLANNER_VERSION_CH1,
          completed: true,
        },
      },
    });
  }
}
