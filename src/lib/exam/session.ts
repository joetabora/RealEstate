import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED, SALESPERSON_EXAM_CATEGORIES } from "@/lib/blueprint";
import { getLocalLearner } from "@/lib/learner";
import { selectExamSimulationQuestions } from "./select";
import { shuffledCopy } from "./shuffle";
import {
  EXAM_SIM_DISCLAIMER,
  EXAM_SIM_LABEL,
  PLANNER_VERSION_EXAM_SIM,
  examEndsAtIso,
  examTargetMinutes,
  type ExamCategoryScore,
} from "./types";

export async function startOrResumeExamSimulation() {
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
      plannerVersion: PLANNER_VERSION_EXAM_SIM,
      completedAt: null,
    },
    orderBy: { startedAt: "desc" },
  });
  if (open) {
    return open;
  }

  const { picks: orderedPicks, quotas } = await selectExamSimulationQuestions({
    prisma,
    editionId: edition.id,
  });
  if (orderedPicks.length === 0) {
    throw new Error("No active questions available for exam simulation. Run: npx prisma db seed");
  }

  const startedAt = new Date();
  const shuffleSeed = `exam-order:${learner.id}:${startedAt.toISOString()}`;
  const picks = shuffledCopy(orderedPicks, shuffleSeed);
  const targetMinutes = examTargetMinutes(picks.length);
  const endsAt = examEndsAtIso(startedAt, picks.length);

  return prisma.learningSession.create({
    data: {
      learnerId: learner.id,
      editionId: edition.id,
      objective: `${EXAM_SIM_LABEL}: blueprint-balanced sourced MCQs. ${EXAM_SIM_DISCLAIMER}`,
      targetMinutes,
      plannerVersion: PLANNER_VERSION_EXAM_SIM,
      stateBefore: {
        plannerVersion: PLANNER_VERSION_EXAM_SIM,
        kind: "exam_simulation",
        questionCount: picks.length,
        startedAt: startedAt.toISOString(),
        endsAt,
        shuffleSeed,
        quotas: quotas.map((row) => ({
          code: row.code,
          seats: row.seats,
          available: row.available,
          blueprintWeight: row.blueprintWeight,
        })),
        disclaimer: EXAM_SIM_DISCLAIMER,
      },
      items: {
        create: picks.map((pick, index) => ({
          sortOrder: index + 1,
          kind: "exam",
          reasonCodes: ["phase9", "exam_sim", `cat_${pick.primaryCategoryCode}`],
          conceptId: pick.conceptId,
          questionId: pick.id,
        })),
      },
      recommendedNext:
        "Exam simulation complete. Review category scores, then Mistakes / Practice / Teach Me. This was not a licensing exam.",
    },
  });
}

export type SubmitExamAnswerInput = {
  sessionId: string;
  itemId: string;
  optionId: string;
  latencyMs?: number;
};

/**
 * Exam-mode submit: records attempt + performance, no mid-exam remediation retest,
 * no confidence prompt (fixed confidence 3 for mistake tagging only).
 * Does not advance SM-2 — exam conditions are not study review.
 */
export async function submitExamAnswer(input: SubmitExamAnswerInput) {
  const learner = await getLocalLearner(prisma);
  const item = await prisma.sessionItem.findFirst({
    where: { id: input.itemId, sessionId: input.sessionId },
    include: {
      question: { include: { options: true } },
      session: true,
    },
  });
  if (!item || !item.question) {
    throw new Error("Exam item not found.");
  }
  if (item.session.learnerId !== learner.id) {
    throw new Error("Exam session does not belong to the local learner.");
  }
  if (item.session.plannerVersion !== PLANNER_VERSION_EXAM_SIM) {
    throw new Error("Not an exam simulation session.");
  }
  if (item.completedAt) {
    throw new Error("This exam item is already complete.");
  }

  const selected = item.question.options.find((option) => option.id === input.optionId);
  if (!selected) {
    throw new Error("Selected option is not part of this question.");
  }

  const correct = selected.isCorrect;
  const confidence = 3;
  const errorCategory = correct
    ? null
    : item.question.pairId
      ? "confusion"
      : "knowledge_gap";

  const attempt = await prisma.questionAttempt.create({
    data: {
      learnerId: learner.id,
      questionId: item.question.id,
      sessionItemId: item.id,
      selectedOptionId: selected.id,
      correct,
      confidence,
      latencyMs: input.latencyMs ?? null,
      errorCategory,
    },
  });

  if (!correct) {
    await prisma.mistake.create({
      data: {
        learnerId: learner.id,
        questionId: item.question.id,
        attemptId: attempt.id,
        conceptId: item.question.conceptId,
        pairId: item.question.pairId,
      },
    });
  }

  const conceptIds = new Set<string>();
  if (item.question.conceptId) conceptIds.add(item.question.conceptId);
  if (item.question.pairId) {
    const pair = await prisma.confusionPair.findUnique({
      where: { id: item.question.pairId },
      select: { conceptAId: true, conceptBId: true },
    });
    if (pair) {
      conceptIds.add(pair.conceptAId);
      conceptIds.add(pair.conceptBId);
    }
  }

  for (const conceptId of conceptIds) {
    await prisma.performanceState.upsert({
      where: {
        learnerId_conceptId: { learnerId: learner.id, conceptId },
      },
      create: {
        learnerId: learner.id,
        conceptId,
        attempts: 1,
        correctCount: correct ? 1 : 0,
        lastAttemptAt: new Date(),
      },
      update: {
        attempts: { increment: 1 },
        correctCount: correct ? { increment: 1 } : undefined,
        lastAttemptAt: new Date(),
      },
    });
  }

  await prisma.sessionItem.update({
    where: { id: item.id },
    data: { completedAt: new Date() },
  });

  const remaining = await prisma.sessionItem.count({
    where: { sessionId: input.sessionId, completedAt: null },
  });
  if (remaining === 0) {
    const summary = await buildExamScoreSummary(input.sessionId);
    await prisma.learningSession.update({
      where: { id: input.sessionId },
      data: {
        completedAt: new Date(),
        stateAfter: {
          completedAt: new Date().toISOString(),
          kind: "exam_simulation",
          ...summary,
        },
      },
    });
  }

  return { correct, attemptId: attempt.id, remaining };
}

export async function finishExamSimulationEarly(sessionId: string) {
  const learner = await getLocalLearner(prisma);
  const session = await prisma.learningSession.findFirst({
    where: {
      id: sessionId,
      learnerId: learner.id,
      plannerVersion: PLANNER_VERSION_EXAM_SIM,
      completedAt: null,
    },
  });
  if (!session) {
    throw new Error("Open exam session not found.");
  }

  // Mark unanswered items complete without attempts so the sitting closes.
  await prisma.sessionItem.updateMany({
    where: { sessionId, completedAt: null },
    data: { completedAt: new Date() },
  });

  const summary = await buildExamScoreSummary(sessionId);
  await prisma.learningSession.update({
    where: { id: sessionId },
    data: {
      completedAt: new Date(),
      stateAfter: {
        completedAt: new Date().toISOString(),
        kind: "exam_simulation",
        endedEarly: true,
        ...summary,
      },
      recommendedNext:
        "Exam ended early. Unanswered items count as incomplete — review category scores, then Practice / Mistakes.",
    },
  });
}

export async function buildExamScoreSummary(sessionId: string): Promise<{
  answered: number;
  correct: number;
  total: number;
  byCategory: ExamCategoryScore[];
}> {
  const items = await prisma.sessionItem.findMany({
    where: { sessionId },
    select: {
      id: true,
      question: {
        select: {
          examCategories: {
            select: { examCategory: { select: { code: true, name: true, sortOrder: true } } },
          },
        },
      },
      attempts: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { correct: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  const byCode = new Map<string, ExamCategoryScore>();
  for (const category of SALESPERSON_EXAM_CATEGORIES) {
    byCode.set(category.code, {
      code: category.code,
      name: category.name,
      answered: 0,
      correct: 0,
    });
  }

  let answered = 0;
  let correct = 0;
  for (const item of items) {
    const attempt = item.attempts[0];
    if (!attempt) continue;
    answered += 1;
    if (attempt.correct) correct += 1;

    const codes = [...(item.question?.examCategories ?? [])]
      .map((join) => join.examCategory)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const primary = codes[0];
    if (!primary) continue;
    const bucket = byCode.get(primary.code);
    if (!bucket) continue;
    bucket.answered += 1;
    if (attempt.correct) bucket.correct += 1;
  }

  return {
    answered,
    correct,
    total: items.length,
    byCategory: [...byCode.values()].filter((row) => row.answered > 0),
  };
}
