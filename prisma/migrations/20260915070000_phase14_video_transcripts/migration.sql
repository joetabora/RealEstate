-- Phase 14: local video inventory + unverified transcript dumps.
CREATE TABLE "VideoSource" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "relativePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "chapterNumber" INTEGER,
    "isDatedUpdate" BOOLEAN NOT NULL DEFAULT false,
    "transcriptStatus" TEXT NOT NULL DEFAULT 'pending',
    "transcriptNote" TEXT,
    "transcriptText" TEXT,
    "transcriptVerified" BOOLEAN NOT NULL DEFAULT false,
    "transcriptFilePath" TEXT,
    "durationSec" INTEGER,
    "byteSize" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoSource_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VideoSource_editionId_relativePath_key" ON "VideoSource"("editionId", "relativePath");
CREATE INDEX "VideoSource_editionId_transcriptStatus_idx" ON "VideoSource"("editionId", "transcriptStatus");
CREATE INDEX "VideoSource_editionId_chapterNumber_idx" ON "VideoSource"("editionId", "chapterNumber");
CREATE INDEX "VideoSource_isDatedUpdate_idx" ON "VideoSource"("isDatedUpdate");

ALTER TABLE "VideoSource" ADD CONSTRAINT "VideoSource_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "CourseEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
