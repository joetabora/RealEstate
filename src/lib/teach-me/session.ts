import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { getLocalLearner } from "@/lib/learner";
import {
  advanceReviewSchedulesForConcepts,
  buildAdaptiveTeachMeDraft,
  TEACH_ME_REVIEW_QUALITY,
} from "@/lib/mastery";
import { planTeachMeSitting } from "./planner";
import {
  PLANNER_VERSION_CH1,
  TEACH_ME_PLANNER_VERSIONS,
  recommendedNextForPlanner,
  sittingByPlannerVersion,
  sittingLabelForPlanner,
} from "./types";

function chapterNumberFromPlannerVersion(plannerVersion: string): number {
  const sitting = sittingByPlannerVersion(plannerVersion);
  const match = /^chapter(\d+)$/.exec(sitting.id);
  if (!match) {
    throw new Error(`Cannot map Teach Me sitting ${sitting.id} to a chapter number.`);
  }
  return Number(match[1]);
}

/**
 * Resume any open Teach Me sitting. Otherwise advance through ordered
 * chapter sittings only after each prior sitting is complete.
 * New sittings prepend a deterministic adaptive repair prefix when signals exist.
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
    select: { id: true, slug: true, kind: true, conceptId: true, pairId: true },
  });

  const baseDraft = planTeachMeSitting(assets, { completedPlannerVersions });
  const chapterNumber = chapterNumberFromPlannerVersion(baseDraft.plannerVersion);
  const draft = await buildAdaptiveTeachMeDraft({
    prisma,
    learnerId: learner.id,
    chapterNumber,
    draft: baseDraft,
    assets,
  });

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
        chapterNumber,
        adaptivePrefix: draft.items.length - baseDraft.items.length,
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
    include: {
      asset: {
        select: {
          conceptId: true,
          pair: { select: { conceptAId: true, conceptBId: true } },
        },
      },
      session: { select: { learnerId: true } },
    },
  });
  if (!item) {
    throw new Error("Session item not found.");
  }

  const firstCompletion = !item.completedAt;
  if (firstCompletion) {
    await prisma.sessionItem.update({
      where: { id: itemId },
      data: { completedAt: new Date() },
    });

    if (item.kind === "review" || item.kind === "repair") {
      const conceptIds = new Set<string>();
      if (item.conceptId) conceptIds.add(item.conceptId);
      if (item.asset?.conceptId) conceptIds.add(item.asset.conceptId);
      if (item.asset?.pair?.conceptAId) conceptIds.add(item.asset.pair.conceptAId);
      if (item.asset?.pair?.conceptBId) conceptIds.add(item.asset.pair.conceptBId);

      if (conceptIds.size > 0) {
        await advanceReviewSchedulesForConcepts({
          prisma,
          learnerId: item.session.learnerId,
          conceptIds,
          quality: TEACH_ME_REVIEW_QUALITY,
        });
      }
    }
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
