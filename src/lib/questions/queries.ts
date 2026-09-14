import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { formatPageCitation } from "@/lib/ingest/citation";
import { getLocalLearner } from "@/lib/learner";
import {
  PRACTICE_SITTINGS,
  isPracticePlannerVersion,
  practiceSittingByPlannerVersion,
} from "./types";

export type PracticeChapterCard = {
  chapterNumber: number;
  label: string;
  shortLabel: string;
  questionCount: number;
  openSessionId: string | null;
  canStart: boolean;
};

export type PracticeHomeData = {
  databaseConnected: boolean;
  chapters: PracticeChapterCard[];
  openMistakes: number;
};

export type PracticeSessionView = {
  id: string;
  objective: string;
  targetMinutes: number;
  plannerVersion: string;
  sittingLabel: string;
  completed: boolean;
  recommendedNext: string | null;
  currentIndex: number;
  total: number;
  item: PracticeItemView | null;
};

export type PracticeItemView = {
  id: string;
  kind: string;
  stem: string;
  informationClass: string;
  conceptName: string | null;
  conceptSlug: string | null;
  options: Array<{ id: string; key: string; body: string }>;
  citations: Array<{
    heading: string;
    citation: string;
    href: string | null;
  }>;
};

export async function getPracticeHomeData(): Promise<PracticeHomeData> {
  try {
    const edition = await prisma.courseEdition.findUnique({
      where: { slug: COURSE_EDITION_SEED.slug },
    });
    if (!edition) {
      return {
        databaseConnected: true,
        chapters: PRACTICE_SITTINGS.map((sitting) => ({
          chapterNumber: sitting.chapterNumber,
          label: sitting.label,
          shortLabel: sitting.shortLabel,
          questionCount: 0,
          openSessionId: null,
          canStart: false,
        })),
        openMistakes: 0,
      };
    }
    const learner = await getLocalLearner(prisma);
    const openSessions = await prisma.learningSession.findMany({
      where: {
        learnerId: learner.id,
        editionId: edition.id,
        plannerVersion: { in: [...PRACTICE_SITTINGS.map((row) => row.plannerVersion)] },
        completedAt: null,
      },
      select: { id: true, plannerVersion: true },
    });
    const openByPlanner = new Map(
      openSessions.map((row) => [row.plannerVersion ?? "", row.id]),
    );

    const chapters: PracticeChapterCard[] = [];
    for (const sitting of PRACTICE_SITTINGS) {
      const questionCount = await prisma.question.count({
        where: {
          editionId: edition.id,
          lifecycle: "active",
          chapterNumber: sitting.chapterNumber,
        },
      });
      chapters.push({
        chapterNumber: sitting.chapterNumber,
        label: sitting.label,
        shortLabel: sitting.shortLabel,
        questionCount,
        openSessionId: openByPlanner.get(sitting.plannerVersion) ?? null,
        canStart: questionCount > 0,
      });
    }

    const openMistakes = await prisma.mistake.count({
      where: { learnerId: learner.id, resolvedAt: null },
    });
    return {
      databaseConnected: true,
      chapters,
      openMistakes,
    };
  } catch {
    return {
      databaseConnected: false,
      chapters: PRACTICE_SITTINGS.map((sitting) => ({
        chapterNumber: sitting.chapterNumber,
        label: sitting.label,
        shortLabel: sitting.shortLabel,
        questionCount: 0,
        openSessionId: null,
        canStart: false,
      })),
      openMistakes: 0,
    };
  }
}

export async function getPracticeSessionView(
  sessionId: string,
): Promise<PracticeSessionView | null> {
  const session = await prisma.learningSession.findUnique({
    where: { id: sessionId },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          question: {
            include: {
              options: { orderBy: { sortOrder: "asc" } },
              citations: true,
              concept: { select: { name: true, slug: true } },
            },
          },
        },
      },
    },
  });
  if (!session || !isPracticePlannerVersion(session.plannerVersion)) {
    return null;
  }

  const sitting = practiceSittingByPlannerVersion(session.plannerVersion);
  const incomplete = session.items.filter((item) => !item.completedAt);
  const current = incomplete[0] ?? null;
  const completed = Boolean(session.completedAt) || incomplete.length === 0;
  const currentIndex = completed
    ? session.items.length
    : session.items.findIndex((item) => item.id === current?.id);

  let item: PracticeItemView | null = null;
  if (current?.question) {
    const question = current.question;
    item = {
      id: current.id,
      kind: current.kind,
      stem: question.stem,
      informationClass: question.informationClass,
      conceptName: question.concept?.name ?? null,
      conceptSlug: question.concept?.slug ?? null,
      options: question.options.map((option) => ({
        id: option.id,
        key: option.key,
        body: option.body,
      })),
      citations: question.citations.map((citation) => ({
        heading: citation.heading,
        citation: formatPageCitation({
          pdfPageStart: citation.pdfPage,
          pdfPageEnd: citation.pdfPage,
          printedPageStart: citation.printedPage,
          printedPageEnd: citation.printedPage,
        }),
        href: citation.sectionId
          ? `/library/${citation.documentSlug}?section=${citation.sectionId}`
          : null,
      })),
    };
  }

  return {
    id: session.id,
    objective: session.objective ?? sitting?.label ?? "Practice",
    targetMinutes: session.targetMinutes ?? 15,
    plannerVersion: session.plannerVersion ?? "",
    sittingLabel: sitting?.label ?? "Practice",
    completed,
    recommendedNext: session.recommendedNext,
    currentIndex: Math.max(currentIndex, 0),
    total: session.items.length,
    item,
  };
}

export type MistakeListItem = {
  id: string;
  createdAt: string;
  resolved: boolean;
  stem: string;
  whyMissed: string;
  distinction: string;
  errorCategory: string | null;
  confidence: number | null;
  conceptName: string | null;
};

export async function getMistakeList(): Promise<{
  databaseConnected: boolean;
  items: MistakeListItem[];
}> {
  try {
    const learner = await getLocalLearner(prisma);
    const rows = await prisma.mistake.findMany({
      where: { learnerId: learner.id },
      orderBy: [{ resolvedAt: "asc" }, { createdAt: "desc" }],
      take: 50,
      include: {
        question: {
          select: { stem: true, remediationWhyMissed: true, remediationDistinction: true },
        },
        attempt: { select: { errorCategory: true, confidence: true } },
        concept: { select: { name: true } },
      },
    });
    return {
      databaseConnected: true,
      items: rows.map((row) => ({
        id: row.id,
        createdAt: row.createdAt.toISOString(),
        resolved: Boolean(row.resolvedAt),
        stem: row.question.stem,
        whyMissed: row.question.remediationWhyMissed,
        distinction: row.question.remediationDistinction,
        errorCategory: row.attempt.errorCategory,
        confidence: row.attempt.confidence,
        conceptName: row.concept?.name ?? null,
      })),
    };
  } catch {
    return { databaseConnected: false, items: [] };
  }
}
