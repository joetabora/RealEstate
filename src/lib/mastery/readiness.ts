import type { PrismaClient } from "@prisma/client";
import {
  COURSE_EDITION_SEED,
  SALESPERSON_EXAM_CATEGORIES,
} from "@/lib/blueprint";
import { PLANNER_VERSION_EXAM_SIM, type ExamCategoryScore } from "@/lib/exam/types";

export type ReadinessCategoryRow = {
  code: string;
  name: string;
  blueprintWeight: number;
  conceptCount: number;
  learningCount: number;
  openMistakeCount: number;
  overdueCount: number;
  /** Last completed sim for this category — raw counts only, not a mastery %. */
  lastSim: { correct: number; answered: number } | null;
  /** Deterministic one-line status; never predicts a score. */
  line: string;
};

export type ReadinessNextAction = {
  label: string;
  href: string;
  reason: string;
};

export type ExamReadinessSummary = {
  categories: ReadinessCategoryRow[];
  totals: {
    openMistakeCount: number;
    overdueCount: number;
    learningCount: number;
    conceptCount: number;
  };
  lastSimAt: string | null;
  lastSimOverall: { correct: number; answered: number; total: number } | null;
  headline: string;
  nextActions: ReadinessNextAction[];
};

export type ReadinessSignalInput = {
  categories: Array<{ code: string; name: string; weight: number }>;
  /** conceptId → exam category codes */
  conceptCategories: Map<string, string[]>;
  learningConceptIds: Set<string>;
  openMistakeConceptIds: string[];
  overdueConceptIds: string[];
  lastSimAt: string | null;
  lastSimOverall: { correct: number; answered: number; total: number } | null;
  lastSimByCategory: ExamCategoryScore[];
};

/**
 * Pure aggregator — counts and templates only.
 * Never invents Wisconsin facts or predicts an exam score.
 */
export function buildExamReadinessSummary(
  input: ReadinessSignalInput,
): ExamReadinessSummary {
  const mistakeByCode = countByCategory(input.openMistakeConceptIds, input.conceptCategories);
  const overdueByCode = countByCategory(input.overdueConceptIds, input.conceptCategories);
  const conceptCountByCode = new Map<string, number>();
  const learningByCode = new Map<string, number>();

  for (const [conceptId, codes] of input.conceptCategories) {
    for (const code of codes) {
      conceptCountByCode.set(code, (conceptCountByCode.get(code) ?? 0) + 1);
      if (input.learningConceptIds.has(conceptId)) {
        learningByCode.set(code, (learningByCode.get(code) ?? 0) + 1);
      }
    }
  }

  const simByCode = new Map(
    input.lastSimByCategory.map((row) => [row.code, row] as const),
  );

  const categories: ReadinessCategoryRow[] = input.categories.map((cat) => {
    const openMistakeCount = mistakeByCode.get(cat.code) ?? 0;
    const overdueCount = overdueByCode.get(cat.code) ?? 0;
    const learningCount = learningByCode.get(cat.code) ?? 0;
    const conceptCount = conceptCountByCode.get(cat.code) ?? 0;
    const sim = simByCode.get(cat.code);
    const lastSim =
      sim && sim.answered > 0
        ? { correct: sim.correct, answered: sim.answered }
        : null;

    return {
      code: cat.code,
      name: cat.name,
      blueprintWeight: cat.weight,
      conceptCount,
      learningCount,
      openMistakeCount,
      overdueCount,
      lastSim,
      line: formatCategoryLine({
        code: cat.code,
        name: cat.name,
        weight: cat.weight,
        openMistakeCount,
        overdueCount,
        learningCount,
        lastSim,
      }),
    };
  });

  const totals = {
    openMistakeCount: input.openMistakeConceptIds.length,
    overdueCount: input.overdueConceptIds.length,
    learningCount: input.learningConceptIds.size,
    conceptCount: input.conceptCategories.size,
  };

  return {
    categories,
    totals,
    lastSimAt: input.lastSimAt,
    lastSimOverall: input.lastSimOverall,
    headline: formatHeadline(totals, input.lastSimOverall),
    nextActions: buildNextActions(totals),
  };
}

export function emptyExamReadinessSummary(): ExamReadinessSummary {
  return buildExamReadinessSummary({
    categories: SALESPERSON_EXAM_CATEGORIES.map((c) => ({
      code: c.code,
      name: c.name,
      weight: c.weight,
    })),
    conceptCategories: new Map(),
    learningConceptIds: new Set(),
    openMistakeConceptIds: [],
    overdueConceptIds: [],
    lastSimAt: null,
    lastSimOverall: null,
    lastSimByCategory: [],
  });
}

export async function getExamReadinessSummary(input: {
  prisma: PrismaClient;
  learnerId: string;
  learningConceptIds?: Set<string>;
  now?: Date;
}): Promise<ExamReadinessSummary> {
  const now = input.now ?? new Date();
  const edition = await input.prisma.courseEdition.findUnique({
    where: { slug: COURSE_EDITION_SEED.slug },
  });
  if (!edition) {
    return emptyExamReadinessSummary();
  }

  const [concepts, openMistakes, overdue, lastSim] = await Promise.all([
    input.prisma.concept.findMany({
      where: { editionId: edition.id },
      select: {
        id: true,
        examCategories: { select: { examCategory: { select: { code: true } } } },
      },
    }),
    input.prisma.mistake.findMany({
      where: { learnerId: input.learnerId, resolvedAt: null, conceptId: { not: null } },
      select: { conceptId: true },
    }),
    input.prisma.reviewSchedule.findMany({
      where: { learnerId: input.learnerId, dueAt: { lte: now } },
      select: { conceptId: true },
    }),
    input.prisma.learningSession.findFirst({
      where: {
        learnerId: input.learnerId,
        editionId: edition.id,
        plannerVersion: PLANNER_VERSION_EXAM_SIM,
        completedAt: { not: null },
      },
      orderBy: { completedAt: "desc" },
      select: { completedAt: true, stateAfter: true },
    }),
  ]);

  const conceptCategories = new Map<string, string[]>();
  for (const concept of concepts) {
    conceptCategories.set(
      concept.id,
      concept.examCategories.map((j) => j.examCategory.code),
    );
  }

  let lastSimOverall: ExamReadinessSummary["lastSimOverall"] = null;
  let lastSimByCategory: ExamCategoryScore[] = [];
  let lastSimAt: string | null = null;
  if (lastSim?.completedAt) {
    lastSimAt = lastSim.completedAt.toISOString();
    const state =
      lastSim.stateAfter && typeof lastSim.stateAfter === "object"
        ? (lastSim.stateAfter as Record<string, unknown>)
        : {};
    const answered = typeof state.answered === "number" ? state.answered : 0;
    const correct = typeof state.correct === "number" ? state.correct : 0;
    const total = typeof state.total === "number" ? state.total : answered;
    if (answered > 0) {
      lastSimOverall = { correct, answered, total };
    }
    if (Array.isArray(state.byCategory)) {
      lastSimByCategory = state.byCategory.filter(
        (row): row is ExamCategoryScore =>
          !!row &&
          typeof row === "object" &&
          typeof (row as ExamCategoryScore).code === "string" &&
          typeof (row as ExamCategoryScore).answered === "number" &&
          typeof (row as ExamCategoryScore).correct === "number",
      );
    }
  }

  return buildExamReadinessSummary({
    categories: SALESPERSON_EXAM_CATEGORIES.map((c) => ({
      code: c.code,
      name: c.name,
      weight: c.weight,
    })),
    conceptCategories,
    learningConceptIds: input.learningConceptIds ?? new Set(),
    openMistakeConceptIds: openMistakes
      .map((m) => m.conceptId)
      .filter((id): id is string => Boolean(id)),
    overdueConceptIds: overdue.map((r) => r.conceptId),
    lastSimAt,
    lastSimOverall,
    lastSimByCategory,
  });
}

function countByCategory(
  conceptIds: string[],
  conceptCategories: Map<string, string[]>,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const conceptId of conceptIds) {
    const codes = conceptCategories.get(conceptId) ?? [];
    for (const code of codes) {
      counts.set(code, (counts.get(code) ?? 0) + 1);
    }
  }
  return counts;
}

function formatCategoryLine(input: {
  code: string;
  name: string;
  weight: number;
  openMistakeCount: number;
  overdueCount: number;
  learningCount: number;
  lastSim: { correct: number; answered: number } | null;
}): string {
  const bits: string[] = [];
  if (input.openMistakeCount > 0) {
    bits.push(
      `${input.openMistakeCount} open mistake${input.openMistakeCount === 1 ? "" : "s"}`,
    );
  }
  if (input.overdueCount > 0) {
    bits.push(`${input.overdueCount} overdue`);
  }
  if (input.learningCount > 0) {
    bits.push(`${input.learningCount} learning`);
  }
  if (input.lastSim) {
    bits.push(`last sim ${input.lastSim.correct}/${input.lastSim.answered}`);
  }
  if (bits.length === 0) {
    bits.push("no open signals yet");
  }
  return `${input.code}. ${input.name} (w${input.weight}): ${bits.join(" · ")}`;
}

function formatHeadline(
  totals: ExamReadinessSummary["totals"],
  lastSim: ExamReadinessSummary["lastSimOverall"],
): string {
  const bits: string[] = [];
  if (totals.openMistakeCount > 0) {
    bits.push(
      `${totals.openMistakeCount} open mistake${totals.openMistakeCount === 1 ? "" : "s"}`,
    );
  }
  if (totals.overdueCount > 0) {
    bits.push(
      `${totals.overdueCount} overdue review${totals.overdueCount === 1 ? "" : "s"}`,
    );
  }
  if (totals.learningCount > 0) {
    bits.push(`${totals.learningCount} concepts in learning`);
  }
  if (lastSim) {
    bits.push(`last sim ${lastSim.correct}/${lastSim.answered}`);
  }
  if (bits.length === 0) {
    return "No study signals yet — start Teach Me or Practice. This is not a score prediction.";
  }
  return `${bits.join(" · ")}. Counts only — not a predicted exam score.`;
}

function buildNextActions(
  totals: ExamReadinessSummary["totals"],
): ReadinessNextAction[] {
  const actions: ReadinessNextAction[] = [];
  if (totals.openMistakeCount > 0) {
    actions.push({
      label: "Open Mistakes",
      href: "/mistakes",
      reason: "Repair open misses before farming easy items.",
    });
  }
  if (totals.overdueCount > 0) {
    actions.push({
      label: "Practice due reviews",
      href: "/practice",
      reason: "Clear overdue SM-2 schedules.",
    });
  }
  if (actions.length < 2) {
    actions.push({
      label: "Teach Me",
      href: "/",
      reason: "Continue the chapter sitting.",
    });
  }
  if (actions.length < 3) {
    actions.push({
      label: "Exam simulation",
      href: "/exam",
      reason: "Timed blueprint sitting when you want performance pressure.",
    });
  }
  return actions.slice(0, 3);
}
