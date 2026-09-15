-- Phase 10: store local Tesseract dumps as unverified OCR text only.
ALTER TABLE "VisualAnchor" ADD COLUMN "ocrText" TEXT;
ALTER TABLE "VisualAnchor" ADD COLUMN "ocrVerified" BOOLEAN NOT NULL DEFAULT false;
