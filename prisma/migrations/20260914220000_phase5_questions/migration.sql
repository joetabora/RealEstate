-- Phase 5: Questions, attempts, knowledge vs performance, mistakes

CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'mcq',
    "informationClass" TEXT NOT NULL,
    "lifecycle" TEXT NOT NULL DEFAULT 'active',
    "chapterNumber" INTEGER NOT NULL,
    "stem" TEXT NOT NULL,
    "remediationWhyMissed" TEXT NOT NULL,
    "remediationDistinction" TEXT NOT NULL,
    "conceptId" TEXT,
    "pairId" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuestionOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuestionCitation" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "sectionId" TEXT,
    "documentSlug" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "pdfPage" INTEGER NOT NULL,
    "printedPage" INTEGER,
    "layer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionCitation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuestionExamCategory" (
    "questionId" TEXT NOT NULL,
    "examCategoryId" TEXT NOT NULL,

    CONSTRAINT "QuestionExamCategory_pkey" PRIMARY KEY ("questionId","examCategoryId")
);

CREATE TABLE "QuestionAttempt" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "sessionItemId" TEXT,
    "selectedOptionId" TEXT,
    "correct" BOOLEAN NOT NULL,
    "confidence" INTEGER,
    "latencyMs" INTEGER,
    "errorCategory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "KnowledgeState" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "timesSeen" INTEGER NOT NULL DEFAULT 0,
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeState_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PerformanceState" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerformanceState_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Mistake" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "conceptId" TEXT,
    "pairId" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mistake_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Question_editionId_slug_key" ON "Question"("editionId", "slug");
CREATE INDEX "Question_editionId_lifecycle_chapterNumber_sortOrder_idx" ON "Question"("editionId", "lifecycle", "chapterNumber", "sortOrder");
CREATE INDEX "Question_conceptId_idx" ON "Question"("conceptId");
CREATE INDEX "Question_pairId_idx" ON "Question"("pairId");

CREATE UNIQUE INDEX "QuestionOption_questionId_key_key" ON "QuestionOption"("questionId", "key");
CREATE INDEX "QuestionOption_questionId_sortOrder_idx" ON "QuestionOption"("questionId", "sortOrder");

CREATE INDEX "QuestionCitation_questionId_idx" ON "QuestionCitation"("questionId");
CREATE INDEX "QuestionCitation_sectionId_idx" ON "QuestionCitation"("sectionId");

CREATE INDEX "QuestionAttempt_learnerId_createdAt_idx" ON "QuestionAttempt"("learnerId", "createdAt");
CREATE INDEX "QuestionAttempt_questionId_idx" ON "QuestionAttempt"("questionId");
CREATE INDEX "QuestionAttempt_sessionItemId_idx" ON "QuestionAttempt"("sessionItemId");

CREATE UNIQUE INDEX "KnowledgeState_learnerId_conceptId_key" ON "KnowledgeState"("learnerId", "conceptId");
CREATE INDEX "KnowledgeState_learnerId_status_idx" ON "KnowledgeState"("learnerId", "status");

CREATE UNIQUE INDEX "PerformanceState_learnerId_conceptId_key" ON "PerformanceState"("learnerId", "conceptId");
CREATE INDEX "PerformanceState_learnerId_idx" ON "PerformanceState"("learnerId");

CREATE UNIQUE INDEX "Mistake_attemptId_key" ON "Mistake"("attemptId");
CREATE INDEX "Mistake_learnerId_resolvedAt_createdAt_idx" ON "Mistake"("learnerId", "resolvedAt", "createdAt");
CREATE INDEX "Mistake_questionId_idx" ON "Mistake"("questionId");

CREATE INDEX "SessionItem_questionId_idx" ON "SessionItem"("questionId");

ALTER TABLE "Question" ADD CONSTRAINT "Question_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "CourseEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Question" ADD CONSTRAINT "Question_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Question" ADD CONSTRAINT "Question_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "ConfusionPair"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "QuestionCitation" ADD CONSTRAINT "QuestionCitation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuestionCitation" ADD CONSTRAINT "QuestionCitation_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "SourceSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "QuestionExamCategory" ADD CONSTRAINT "QuestionExamCategory_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuestionExamCategory" ADD CONSTRAINT "QuestionExamCategory_examCategoryId_fkey" FOREIGN KEY ("examCategoryId") REFERENCES "ExamCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_sessionItemId_fkey" FOREIGN KEY ("sessionItemId") REFERENCES "SessionItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "QuestionOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "KnowledgeState" ADD CONSTRAINT "KnowledgeState_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "KnowledgeState" ADD CONSTRAINT "KnowledgeState_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PerformanceState" ADD CONSTRAINT "PerformanceState_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PerformanceState" ADD CONSTRAINT "PerformanceState_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuestionAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "ConfusionPair"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SessionItem" ADD CONSTRAINT "SessionItem_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
