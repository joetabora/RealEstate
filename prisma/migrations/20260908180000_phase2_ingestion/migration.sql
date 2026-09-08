-- CreateTable
CREATE TABLE "SourceDocument" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "layer" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL DEFAULT 'WI',
    "relativePath" TEXT NOT NULL DEFAULT '',
    "fileName" TEXT NOT NULL DEFAULT '',
    "checksumSha256" TEXT,
    "publishedAt" TIMESTAMP(3),
    "effectiveAt" TIMESTAMP(3),
    "pageCount" INTEGER NOT NULL DEFAULT 0,
    "firstPdfPage" INTEGER NOT NULL DEFAULT 1,
    "lastPdfPage" INTEGER NOT NULL DEFAULT 1,
    "hideBodyInUi" BOOLEAN NOT NULL DEFAULT false,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ingestVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SourceDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceSection" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "headingPath" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "kind" TEXT NOT NULL DEFAULT 'heading',
    "chapterNumber" INTEGER,
    "chapterTitle" TEXT,
    "pdfPageStart" INTEGER NOT NULL,
    "pdfPageEnd" INTEGER NOT NULL,
    "printedPageStart" INTEGER,
    "printedPageEnd" INTEGER,
    "body" TEXT NOT NULL,
    "charCount" INTEGER NOT NULL,
    "tokenEstimate" INTEGER NOT NULL,
    "needsOcr" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SourceSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceSupersession" (
    "id" TEXT NOT NULL,
    "supersedingDocumentId" TEXT NOT NULL,
    "supersedingSectionId" TEXT,
    "supersededDocumentId" TEXT NOT NULL,
    "supersededSectionId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SourceSupersession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceAsset" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "pdfPage" INTEGER,
    "printedPage" INTEGER,
    "filePath" TEXT,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SourceAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisualAnchor" (
    "id" TEXT NOT NULL,
    "assetId" TEXT,
    "sectionId" TEXT,
    "pdfPage" INTEGER NOT NULL,
    "printedPage" INTEGER,
    "formNumber" TEXT,
    "lineRange" TEXT,
    "bboxX" DOUBLE PRECISION,
    "bboxY" DOUBLE PRECISION,
    "bboxWidth" DOUBLE PRECISION,
    "bboxHeight" DOUBLE PRECISION,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisualAnchor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SourceDocument_editionId_layer_idx" ON "SourceDocument"("editionId", "layer");

-- CreateIndex
CREATE UNIQUE INDEX "SourceDocument_editionId_slug_key" ON "SourceDocument"("editionId", "slug");

-- CreateIndex
CREATE INDEX "SourceSection_documentId_sortOrder_idx" ON "SourceSection"("documentId", "sortOrder");

-- CreateIndex
CREATE INDEX "SourceSection_documentId_chapterNumber_idx" ON "SourceSection"("documentId", "chapterNumber");

-- CreateIndex
CREATE INDEX "SourceSupersession_supersededDocumentId_idx" ON "SourceSupersession"("supersededDocumentId");

-- CreateIndex
CREATE INDEX "SourceSupersession_supersedingDocumentId_idx" ON "SourceSupersession"("supersedingDocumentId");

-- CreateIndex
CREATE INDEX "SourceAsset_documentId_pdfPage_idx" ON "SourceAsset"("documentId", "pdfPage");

-- CreateIndex
CREATE INDEX "VisualAnchor_pdfPage_idx" ON "VisualAnchor"("pdfPage");

-- CreateIndex
CREATE INDEX "VisualAnchor_sectionId_idx" ON "VisualAnchor"("sectionId");

-- AddForeignKey
ALTER TABLE "SourceDocument" ADD CONSTRAINT "SourceDocument_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "CourseEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceSection" ADD CONSTRAINT "SourceSection_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "SourceDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceSupersession" ADD CONSTRAINT "SourceSupersession_supersedingDocumentId_fkey" FOREIGN KEY ("supersedingDocumentId") REFERENCES "SourceDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceSupersession" ADD CONSTRAINT "SourceSupersession_supersededDocumentId_fkey" FOREIGN KEY ("supersededDocumentId") REFERENCES "SourceDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceAsset" ADD CONSTRAINT "SourceAsset_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "SourceDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualAnchor" ADD CONSTRAINT "VisualAnchor_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "SourceAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualAnchor" ADD CONSTRAINT "VisualAnchor_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "SourceSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
