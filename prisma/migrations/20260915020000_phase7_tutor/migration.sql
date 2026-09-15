-- AlterTable
ALTER TABLE "Learner" ADD COLUMN "tutorMode" TEXT NOT NULL DEFAULT 'off';

-- CreateTable
CREATE TABLE "TutorThread" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TutorThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "citations" JSONB,
    "tokenEstimate" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TutorMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorUsageDay" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "estimatedCents" INTEGER NOT NULL DEFAULT 0,
    "tokenEstimate" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TutorUsageDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TutorThread_learnerId_updatedAt_idx" ON "TutorThread"("learnerId", "updatedAt");

-- CreateIndex
CREATE INDEX "TutorMessage_threadId_createdAt_idx" ON "TutorMessage"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "TutorUsageDay_learnerId_day_idx" ON "TutorUsageDay"("learnerId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "TutorUsageDay_learnerId_day_key" ON "TutorUsageDay"("learnerId", "day");

-- AddForeignKey
ALTER TABLE "TutorThread" ADD CONSTRAINT "TutorThread_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorMessage" ADD CONSTRAINT "TutorMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "TutorThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorUsageDay" ADD CONSTRAINT "TutorUsageDay_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
