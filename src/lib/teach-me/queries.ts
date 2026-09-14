import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { formatPageCitation } from "@/lib/ingest/citation";
import { getLocalLearner } from "@/lib/learner";
import { PLANNER_VERSION, type ConceptStudyState } from "./types";

export type TeachMeLiveStatus = {
  databaseConnected: boolean;
  canStart: boolean;
  openSessionId: string | null;
  completedSessionCount: number;
  assetCount: number;
};

export type SessionView = {
  id: string;
  objective: string;
  targetMinutes: number;
  plannerVersion: string;
  completed: boolean;
  recommendedNext: string | null;
  currentIndex: number;
  total: number;
  item: SessionItemView | null;
};

export type SessionItemView = {
  id: string;
  kind: string;
  reasonCodes: string[];
  title: string;
  body: string;
  informationClass: string;
  assetKind: string;
  conceptName: string | null;
  conceptSlug: string | null;
  citations: Array<{
    heading: string;
    citation: string;
    href: string | null;
  }>;
};

export async function getTeachMeLiveStatus(): Promise<TeachMeLiveStatus> {
  try {
    const edition = await prisma.courseEdition.findUnique({
      where: { slug: COURSE_EDITION_SEED.slug },
    });
    if (!edition) {
      return emptyStatus(true);
    }
    const learner = await getLocalLearner(prisma);
    const assetCount = await prisma.learningAsset.count({
      where: { editionId: edition.id, lifecycle: "active" },
    });
    const open = await prisma.learningSession.findFirst({
      where: {
        learnerId: learner.id,
        editionId: edition.id,
        plannerVersion: PLANNER_VERSION,
        completedAt: null,
      },
      orderBy: { startedAt: "desc" },
    });
    const completedSessionCount = await prisma.learningSession.count({
      where: {
        learnerId: learner.id,
        editionId: edition.id,
        completedAt: { not: null },
      },
    });
    return {
      databaseConnected: true,
      canStart: assetCount > 0,
      openSessionId: open?.id ?? null,
      completedSessionCount,
      assetCount,
    };
  } catch {
    return emptyStatus(false);
  }
}

export async function getSessionView(sessionId: string): Promise<SessionView | null> {
  try {
    const session = await prisma.learningSession.findUnique({
      where: { id: sessionId },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
          include: {
            concept: true,
            asset: {
              include: { citations: { orderBy: { createdAt: "asc" } } },
            },
          },
        },
      },
    });
    if (!session) {
      return null;
    }

    const current = session.items.find((item) => !item.completedAt) ?? null;
    const currentIndex = current
      ? session.items.findIndex((item) => item.id === current.id)
      : session.items.length;

    return {
      id: session.id,
      objective: session.objective ?? "Agency session",
      targetMinutes: session.targetMinutes ?? 20,
      plannerVersion: session.plannerVersion ?? PLANNER_VERSION,
      completed: session.completedAt != null,
      recommendedNext: session.recommendedNext,
      currentIndex,
      total: session.items.length,
      item: current && current.asset ? toItemView(current) : null,
    };
  } catch {
    return null;
  }
}

export async function getLearningConceptIds(): Promise<Set<string>> {
  try {
    const learner = await getLocalLearner(prisma);
    const items = await prisma.sessionItem.findMany({
      where: {
        completedAt: { not: null },
        session: { learnerId: learner.id },
      },
      select: {
        conceptId: true,
        asset: {
          select: {
            conceptId: true,
            pair: { select: { conceptAId: true, conceptBId: true } },
          },
        },
      },
    });
    const ids = new Set<string>();
    for (const item of items) {
      if (item.conceptId) ids.add(item.conceptId);
      if (item.asset?.conceptId) ids.add(item.asset.conceptId);
      if (item.asset?.pair?.conceptAId) ids.add(item.asset.pair.conceptAId);
      if (item.asset?.pair?.conceptBId) ids.add(item.asset.pair.conceptBId);
    }
    return ids;
  } catch {
    return new Set();
  }
}

export function studyStateFor(conceptId: string, learningIds: Set<string>): ConceptStudyState {
  return learningIds.has(conceptId) ? "learning" : "not_started";
}

function emptyStatus(databaseConnected: boolean): TeachMeLiveStatus {
  return {
    databaseConnected,
    canStart: false,
    openSessionId: null,
    completedSessionCount: 0,
    assetCount: 0,
  };
}

function toItemView(item: {
  id: string;
  kind: string;
  reasonCodes: string[];
  concept: { name: string; slug: string } | null;
  asset: {
    title: string;
    body: string;
    kind: string;
    informationClass: string;
    citations: Array<{
      heading: string;
      printedPage: number | null;
      pdfPage: number;
      documentSlug: string;
      sectionId: string | null;
    }>;
  };
}): SessionItemView {
  return {
    id: item.id,
    kind: item.kind,
    reasonCodes: item.reasonCodes,
    title: item.asset.title,
    body: item.asset.body,
    informationClass: item.asset.informationClass,
    assetKind: item.asset.kind,
    conceptName: item.concept?.name ?? null,
    conceptSlug: item.concept?.slug ?? null,
    citations: item.asset.citations.map((citation) => ({
      heading: citation.heading,
      citation: formatPageCitation({
        printedPageStart: citation.printedPage,
        printedPageEnd: citation.printedPage,
        pdfPageStart: citation.pdfPage,
        pdfPageEnd: citation.pdfPage,
      }),
      href: citation.sectionId
        ? `/library/${citation.documentSlug}/${citation.sectionId}`
        : `/library/${citation.documentSlug}`,
    })),
  };
}
