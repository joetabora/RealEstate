-- Phase 10: VisualAnchor OCR status without inventing page text.
ALTER TABLE "VisualAnchor" ADD COLUMN "ocrStatus" TEXT NOT NULL DEFAULT 'not_needed';
ALTER TABLE "VisualAnchor" ADD COLUMN "ocrNote" TEXT;

CREATE INDEX "VisualAnchor_ocrStatus_idx" ON "VisualAnchor"("ocrStatus");

UPDATE "VisualAnchor" AS va
SET "ocrStatus" = CASE
  WHEN s."needsOcr" THEN 'pending'
  ELSE 'not_needed'
END
FROM "SourceSection" AS s
WHERE va."sectionId" = s.id;
