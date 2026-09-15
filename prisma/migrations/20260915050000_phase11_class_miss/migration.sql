-- Phase 11: class-miss photo intake (local files only).
CREATE TABLE "ClassMissCapture" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'captured',
    "ocrText" TEXT,
    "ocrVerified" BOOLEAN NOT NULL DEFAULT false,
    "conceptId" TEXT,
    "mistakeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassMissCapture_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ClassMissCapture_learnerId_createdAt_idx" ON "ClassMissCapture"("learnerId", "createdAt");
CREATE INDEX "ClassMissCapture_status_idx" ON "ClassMissCapture"("status");
CREATE INDEX "ClassMissCapture_conceptId_idx" ON "ClassMissCapture"("conceptId");

ALTER TABLE "ClassMissCapture" ADD CONSTRAINT "ClassMissCapture_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClassMissCapture" ADD CONSTRAINT "ClassMissCapture_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ClassMissCapture" ADD CONSTRAINT "ClassMissCapture_mistakeId_fkey" FOREIGN KEY ("mistakeId") REFERENCES "Mistake"("id") ON DELETE SET NULL ON UPDATE CASCADE;
