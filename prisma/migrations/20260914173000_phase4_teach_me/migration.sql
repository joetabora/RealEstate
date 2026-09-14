-- CreateTable
CREATE TABLE "LearningAsset" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "informationClass" TEXT NOT NULL,
    "lifecycle" TEXT NOT NULL DEFAULT 'active',
    "conceptId" TEXT,
    "pairId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetCitation" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "sectionId" TEXT,
    "documentSlug" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "pdfPage" INTEGER NOT NULL,
    "printedPage" INTEGER,
    "layer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetCitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearningAsset_editionId_lifecycle_sortOrder_idx" ON "LearningAsset"("editionId", "lifecycle", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "LearningAsset_editionId_slug_key" ON "LearningAsset"("editionId", "slug");

-- CreateIndex
CREATE INDEX "LearningAsset_conceptId_idx" ON "LearningAsset"("conceptId");

-- CreateIndex
CREATE INDEX "LearningAsset_pairId_idx" ON "LearningAsset"("pairId");

-- CreateIndex
CREATE INDEX "AssetCitation_assetId_idx" ON "AssetCitation"("assetId");

-- CreateIndex
CREATE INDEX "AssetCitation_sectionId_idx" ON "AssetCitation"("sectionId");

-- CreateIndex
CREATE INDEX "SessionItem_conceptId_idx" ON "SessionItem"("conceptId");

-- CreateIndex
CREATE INDEX "SessionItem_assetId_idx" ON "SessionItem"("assetId");

-- AddForeignKey
ALTER TABLE "SessionItem" ADD CONSTRAINT "SessionItem_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionItem" ADD CONSTRAINT "SessionItem_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "LearningAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningAsset" ADD CONSTRAINT "LearningAsset_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "CourseEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningAsset" ADD CONSTRAINT "LearningAsset_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningAsset" ADD CONSTRAINT "LearningAsset_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "ConfusionPair"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCitation" ADD CONSTRAINT "AssetCitation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "LearningAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCitation" ADD CONSTRAINT "AssetCitation_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "SourceSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
