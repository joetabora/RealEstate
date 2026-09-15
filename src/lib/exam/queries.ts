import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED, SALESPERSON_EXAM_CATEGORIES } from "@/lib/blueprint";
import { formatPageCitation } from "@/lib/ingest/citation";
import { getLocalLearner } from "@/lib/learner";
import { selectExamSimulationQuestions } from "./select";
import {
  EXAM_SIM_DISCLAIMER,
  EXAM_SIM_LABEL,
  PLANNER_VERSION_EXAM_SIM,
  SALESPERSON_EXAM_ITEM_TOTAL,
  examTargetMinutes,
  type ExamCategoryQuota,
  type ExamCategoryScore,
} from "./types";

export type ExamHomeData = {
  databaseConnected: boolean;
  disclaimer: string;
  blueprintTotal: number;
  openSessionId: string | null;
  canStart: boolean;
  plannedItemCount: number;
  targetMinutes: number;
  quotas: ExamCategoryQuota[];
};

export type ExamSessionView = {
  id: string;
  objective: string;
  targetMinutes: number;
  plannerVersion: string;
  sittingLabel: string;
  completed: boolean;
  recommendedNext: string | null;
  currentIndex: number;
  total: number;
  endsAt: string | null;
  item: ExamItemView | null;
  results: {
    answered: number;
    correct: number;
    total: number;
    endedEarly: boolean;
    byCategory: ExamCategoryScore[];
  } | null;
};

export type ExamItemView = {
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

export async function getExamHomeData(): Promise<ExamHomeData> {
  const empty: ExamHomeData = {
    databaseConnected: false,
    disclaimer: EXAM_SIM_DISCLAIMER,
    blueprintTotal: SALESPERSON_EXAM_ITEM_TOTAL,
    openSessionId: null,
    canStart: false,
    plannedItemCount: 0,
    targetMinutes: 0,
    quotas: SALESPERSON_EXAM_CATEGORIES.map((row) => ({
      code: row.code,
      name: row.name,
      blueprintWeight: row.weight,
      available: 0,
      seats: 0,
    })),
  };

  try {
    const edition = await prisma.courseEdition.findUnique({
      where: { slug: COURSE_EDITION_SEED.slug },
    });
    if (!edition) {
      return { ...empty, databaseConnected: true };
    }

    const learner = await getLocalLearner(prisma);
    const open = await prisma.learningSession.findFirst({
      where: {
        learnerId: learner.id,
        editionId: edition.id,
        plannerVersion: PLANNER_VERSION_EXAM_SIM,
        completedAt: null,
      },
      select: { id: true },
      orderBy: { startedAt: "desc" },
    });

    const { picks, quotas } = await selectExamSimulationQuestions({
      prisma,
      editionId: edition.id,
    });

    return {
      databaseConnected: true,
      disclaimer: EXAM_SIM_DISCLAIMER,
      blueprintTotal: SALESPERSON_EXAM_ITEM_TOTAL,
      openSessionId: open?.id ?? null,
      canStart: picks.length > 0,
      plannedItemCount: picks.length,
      targetMinutes: examTargetMinutes(picks.length),
      quotas,
    };
  } catch {
    return empty;
  }
}

export async function getExamSessionView(sessionId: string): Promise<ExamSessionView | null> {
  try {
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
            attempts: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { correct: true },
            },
          },
        },
      },
    });
    if (!session || session.plannerVersion !== PLANNER_VERSION_EXAM_SIM) {
      return null;
    }

    const incomplete = session.items.filter((item) => !item.completedAt);
    const current = incomplete[0] ?? null;
    const completed = Boolean(session.completedAt);
    const currentIndex = completed
      ? session.items.length
      : session.items.findIndex((item) => item.id === current?.id);

    const stateBefore =
      session.stateBefore && typeof session.stateBefore === "object"
        ? (session.stateBefore as Record<string, unknown>)
        : {};
    const stateAfter =
      session.stateAfter && typeof session.stateAfter === "object"
        ? (session.stateAfter as Record<string, unknown>)
        : {};
    const endsAt = typeof stateBefore.endsAt === "string" ? stateBefore.endsAt : null;

    let item: ExamItemView | null = null;
    if (!completed && current?.question) {
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

    let results: ExamSessionView["results"] = null;
    if (completed) {
      const answered =
        typeof stateAfter.answered === "number"
          ? stateAfter.answered
          : session.items.filter((row) => row.attempts.length > 0).length;
      const correct =
        typeof stateAfter.correct === "number"
          ? stateAfter.correct
          : session.items.filter((row) => row.attempts[0]?.correct).length;
      const byCategory = Array.isArray(stateAfter.byCategory)
        ? (stateAfter.byCategory as ExamCategoryScore[])
        : [];
      results = {
        answered,
        correct,
        total: session.items.length,
        endedEarly: stateAfter.endedEarly === true,
        byCategory,
      };
    }

    return {
      id: session.id,
      objective: session.objective ?? EXAM_SIM_LABEL,
      targetMinutes: session.targetMinutes ?? examTargetMinutes(session.items.length),
      plannerVersion: session.plannerVersion ?? PLANNER_VERSION_EXAM_SIM,
      sittingLabel: EXAM_SIM_LABEL,
      completed,
      recommendedNext: session.recommendedNext,
      currentIndex: Math.max(currentIndex, 0),
      total: session.items.length,
      endsAt,
      item,
      results,
    };
  } catch {
    return null;
  }
}
