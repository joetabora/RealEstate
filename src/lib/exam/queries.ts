import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED, SALESPERSON_EXAM_CATEGORIES } from "@/lib/blueprint";
import { getLocalLearner } from "@/lib/learner";
import { buildExamScoreSummary } from "./session";
import { selectExamSimulationQuestions } from "./select";
import { shuffledCopy } from "./shuffle";
import {
  EXAM_SIM_DISCLAIMER,
  EXAM_SIM_LABEL,
  PLANNER_VERSION_EXAM_SIM,
  SALESPERSON_EXAM_ITEM_TOTAL,
  examTargetMinutes,
  type ExamCategoryQuota,
  type ExamCategoryScore,
} from "./types";

export type ExamHistoryRow = {
  id: string;
  completedAt: string;
  correct: number;
  answered: number;
  total: number;
  endedEarly: boolean;
};

export type ExamHomeData = {
  databaseConnected: boolean;
  disclaimer: string;
  blueprintTotal: number;
  openSessionId: string | null;
  canStart: boolean;
  plannedItemCount: number;
  targetMinutes: number;
  quotas: ExamCategoryQuota[];
  recent: ExamHistoryRow[];
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
    recent: [],
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

    const completed = await prisma.learningSession.findMany({
      where: {
        learnerId: learner.id,
        editionId: edition.id,
        plannerVersion: PLANNER_VERSION_EXAM_SIM,
        completedAt: { not: null },
      },
      orderBy: { completedAt: "desc" },
      take: 5,
      select: { id: true, completedAt: true, stateAfter: true },
    });

    const recent: ExamHistoryRow[] = completed.map((row) => {
      const after =
        row.stateAfter && typeof row.stateAfter === "object"
          ? (row.stateAfter as Record<string, unknown>)
          : {};
      return {
        id: row.id,
        completedAt: row.completedAt?.toISOString() ?? new Date(0).toISOString(),
        correct: typeof after.correct === "number" ? after.correct : 0,
        answered: typeof after.answered === "number" ? after.answered : 0,
        total: typeof after.total === "number" ? after.total : 0,
        endedEarly: after.endedEarly === true,
      };
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
      recent,
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
      const options = shuffledCopy(
        question.options.map((option) => ({
          id: option.id,
          key: option.key,
          body: option.body,
        })),
        `exam-options:${current.id}`,
      );
      item = {
        id: current.id,
        kind: current.kind,
        stem: question.stem,
        informationClass: question.informationClass,
        conceptName: null,
        conceptSlug: null,
        options,
        citations: [],
      };
    }

    let results: ExamSessionView["results"] = null;
    if (completed) {
      let answered =
        typeof stateAfter.answered === "number" ? stateAfter.answered : null;
      let correct = typeof stateAfter.correct === "number" ? stateAfter.correct : null;
      let byCategory = Array.isArray(stateAfter.byCategory)
        ? (stateAfter.byCategory as ExamCategoryScore[])
        : [];
      if (answered == null || correct == null || byCategory.length === 0) {
        const summary = await buildExamScoreSummary(sessionId);
        answered = summary.answered;
        correct = summary.correct;
        byCategory = summary.byCategory;
      }
      results = {
        answered,
        correct,
        total:
          typeof stateAfter.total === "number" ? stateAfter.total : session.items.length,
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
