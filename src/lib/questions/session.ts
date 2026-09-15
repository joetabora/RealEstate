import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { getLocalLearner } from "@/lib/learner";
import { updateReviewSchedulesForConcepts } from "@/lib/mastery";
import { selectDueReviewQuestions } from "./due-review";
import {
  DUE_REVIEW_LABEL,
  PLANNER_VERSION_PRACTICE_DUE_REVIEW,
  PRACTICE_SESSION_TARGET_MINUTES,
  practiceSittingByChapter,
  type PracticeChapterNumber,
} from "./types";

/**
 * Resume an open practice sitting for a chapter, or start a new one from active questions.
 */
export async function startOrResumeChapterPractice(chapterNumber: PracticeChapterNumber) {
  const sitting = practiceSittingByChapter(chapterNumber);
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
      plannerVersion: sitting.plannerVersion,
      completedAt: null,
    },
    orderBy: { startedAt: "desc" },
  });
  if (open) {
    return open;
  }

  const questions = await prisma.question.findMany({
    where: {
      editionId: edition.id,
      lifecycle: "active",
      chapterNumber,
    },
    select: { id: true, conceptId: true, slug: true },
    orderBy: { sortOrder: "asc" },
  });
  if (questions.length === 0) {
    throw new Error(
      `No Chapter ${chapterNumber} questions seeded. Run: npx prisma db seed`,
    );
  }

  return prisma.learningSession.create({
    data: {
      learnerId: learner.id,
      editionId: edition.id,
      objective: `${sitting.label} practice: sourced MCQs with confidence and remediation`,
      targetMinutes: PRACTICE_SESSION_TARGET_MINUTES,
      plannerVersion: sitting.plannerVersion,
      stateBefore: {
        plannerVersion: sitting.plannerVersion,
        questionCount: questions.length,
        chapterNumber,
      },
      items: {
        create: questions.map((question, index) => ({
          sortOrder: index + 1,
          kind: "practice",
          reasonCodes: ["phase5", `chapter_${chapterNumber}`, "seed"],
          conceptId: question.conceptId,
          questionId: question.id,
        })),
      },
      recommendedNext: `${sitting.label} practice complete. Review Mistakes for misses, or continue on Practice / Teach Me.`,
    },
  });
}

/**
 * Resume or start a cross-chapter due-review sitting from overdue SM-2 concepts.
 * Uses existing active MCQs only — no new stems.
 */
export async function startOrResumeDueReviewPractice() {
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
      plannerVersion: PLANNER_VERSION_PRACTICE_DUE_REVIEW,
      completedAt: null,
    },
    orderBy: { startedAt: "desc" },
  });
  if (open) {
    return open;
  }

  const picks = await selectDueReviewQuestions({
    prisma,
    editionId: edition.id,
    learnerId: learner.id,
  });
  if (picks.length === 0) {
    throw new Error(
      "No due-review questions available. Create overdue schedules via practice, or wait until concepts are due.",
    );
  }

  return prisma.learningSession.create({
    data: {
      learnerId: learner.id,
      editionId: edition.id,
      objective: `${DUE_REVIEW_LABEL}: overdue concepts with sourced MCQs`,
      targetMinutes: PRACTICE_SESSION_TARGET_MINUTES,
      plannerVersion: PLANNER_VERSION_PRACTICE_DUE_REVIEW,
      stateBefore: {
        plannerVersion: PLANNER_VERSION_PRACTICE_DUE_REVIEW,
        questionCount: picks.length,
        kind: "due_review",
      },
      items: {
        create: picks.map((pick, index) => ({
          sortOrder: index + 1,
          kind: "practice",
          reasonCodes: ["phase6", "due_review", "overdue"],
          conceptId: pick.conceptId ?? pick.reasonConceptId,
          questionId: pick.id,
        })),
      },
      recommendedNext:
        "Due review complete. Check Progress for remaining overdue, or return to chapter practice / Teach Me.",
    },
  });
}

/** @deprecated Prefer startOrResumeChapterPractice(1). */
export async function startOrResumeChapter1Practice() {
  return startOrResumeChapterPractice(1);
}

export type SubmitAnswerInput = {
  sessionId: string;
  itemId: string;
  optionId: string;
  confidence: number;
  latencyMs?: number;
};

export async function submitPracticeAnswer(input: SubmitAnswerInput) {
  const confidence = Math.round(input.confidence);
  if (confidence < 1 || confidence > 5) {
    throw new Error("Confidence must be an integer from 1 to 5.");
  }

  const learner = await getLocalLearner(prisma);
  const item = await prisma.sessionItem.findFirst({
    where: { id: input.itemId, sessionId: input.sessionId },
    include: {
      question: {
        include: {
          options: true,
        },
      },
      session: true,
    },
  });
  if (!item || !item.question) {
    throw new Error("Practice item not found.");
  }
  if (item.session.learnerId !== learner.id) {
    throw new Error("Practice session does not belong to the local learner.");
  }
  if (item.completedAt) {
    throw new Error("This practice item is already complete.");
  }

  const selected = item.question.options.find((option) => option.id === input.optionId);
  if (!selected) {
    throw new Error("Selected option is not part of this question.");
  }

  const correct = selected.isCorrect;
  const errorCategory = correct
    ? null
    : confidence >= 4
      ? "overconfidence"
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
  } else {
    await prisma.mistake.updateMany({
      where: {
        learnerId: learner.id,
        questionId: item.question.id,
        resolvedAt: null,
      },
      data: { resolvedAt: new Date() },
    });
  }

  const conceptIds = new Set<string>();
  if (item.question.conceptId) {
    conceptIds.add(item.question.conceptId);
  }
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
    await prisma.knowledgeState.upsert({
      where: {
        learnerId_conceptId: {
          learnerId: learner.id,
          conceptId,
        },
      },
      create: {
        learnerId: learner.id,
        conceptId,
        status: "learning",
        timesSeen: 1,
        lastSeenAt: new Date(),
      },
      update: {
        status: "learning",
        timesSeen: { increment: 1 },
        lastSeenAt: new Date(),
      },
    });

    await prisma.performanceState.upsert({
      where: {
        learnerId_conceptId: {
          learnerId: learner.id,
          conceptId,
        },
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

  if (conceptIds.size > 0) {
    await updateReviewSchedulesForConcepts({
      prisma,
      learnerId: learner.id,
      conceptIds,
      correct,
      confidence,
    });
  }

  if (correct) {
    await prisma.sessionItem.update({
      where: { id: item.id },
      data: { completedAt: new Date() },
    });

    const remaining = await prisma.sessionItem.count({
      where: { sessionId: input.sessionId, completedAt: null },
    });
    if (remaining === 0) {
      await prisma.learningSession.update({
        where: { id: input.sessionId },
        data: {
          completedAt: new Date(),
          stateAfter: {
            completedAt: new Date().toISOString(),
            lastQuestionId: item.question.id,
          },
        },
      });
    }
  } else {
    const maxSort = await prisma.sessionItem.aggregate({
      where: { sessionId: input.sessionId },
      _max: { sortOrder: true },
    });
    const alreadyQueued = await prisma.sessionItem.findFirst({
      where: {
        sessionId: input.sessionId,
        questionId: item.question.id,
        completedAt: null,
        id: { not: item.id },
      },
    });
    if (!alreadyQueued) {
      await prisma.sessionItem.create({
        data: {
          sessionId: input.sessionId,
          sortOrder: (maxSort._max.sortOrder ?? item.sortOrder) + 1,
          kind: "practice",
          reasonCodes: ["retest", "phase5", `chapter_${item.question.chapterNumber}`],
          conceptId: item.question.conceptId,
          questionId: item.question.id,
        },
      });
    }
    await prisma.sessionItem.update({
      where: { id: item.id },
      data: { completedAt: new Date() },
    });
  }

  return {
    correct,
    attemptId: attempt.id,
    remediationWhyMissed: correct ? null : item.question.remediationWhyMissed,
    remediationDistinction: correct ? null : item.question.remediationDistinction,
  };
}
