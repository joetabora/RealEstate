import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { getLocalLearner } from "@/lib/learner";
import { planAgencySession } from "./planner";
import { PLANNER_VERSION } from "./types";

export async function startOrResumeAgencySession() {
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
      plannerVersion: PLANNER_VERSION,
      completedAt: null,
    },
    orderBy: { startedAt: "desc" },
  });
  if (open) {
    return open;
  }

  const assets = await prisma.learningAsset.findMany({
    where: { editionId: edition.id, lifecycle: "active" },
    select: { id: true, slug: true, conceptId: true, pairId: true },
  });
  const draft = planAgencySession(assets);

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
    },
  });
}

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
    await prisma.learningSession.update({
      where: { id: sessionId },
      data: {
        completedAt: new Date(),
        recommendedNext: "Review Agency concepts on Progress. Sourced questions come in the next phase.",
        stateAfter: {
          plannerVersion: PLANNER_VERSION,
          completed: true,
        },
      },
    });
  }
}
