-- CreateTable
CREATE TABLE "Concept" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "group" TEXT NOT NULL,
    "jurisdictionScope" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Concept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptCitation" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "sectionId" TEXT,
    "documentSlug" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "pdfPage" INTEGER NOT NULL,
    "printedPage" INTEGER,
    "layer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConceptCitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptExamCategory" (
    "conceptId" TEXT NOT NULL,
    "examCategoryId" TEXT NOT NULL,

    CONSTRAINT "ConceptExamCategory_pkey" PRIMARY KEY ("conceptId","examCategoryId")
);

-- CreateTable
CREATE TABLE "ConceptRelationship" (
    "id" TEXT NOT NULL,
    "fromConceptId" TEXT NOT NULL,
    "toConceptId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConceptRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfusionPair" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "conceptAId" TEXT NOT NULL,
    "conceptBId" TEXT NOT NULL,
    "canonicalKey" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'seed',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfusionPair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfusionEvidence" (
    "id" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfusionEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Concept_editionId_chapterNumber_sortOrder_idx" ON "Concept"("editionId", "chapterNumber", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Concept_editionId_slug_key" ON "Concept"("editionId", "slug");

-- CreateIndex
CREATE INDEX "ConceptCitation_conceptId_idx" ON "ConceptCitation"("conceptId");

-- CreateIndex
CREATE INDEX "ConceptCitation_sectionId_idx" ON "ConceptCitation"("sectionId");

-- CreateIndex
CREATE INDEX "ConceptRelationship_toConceptId_idx" ON "ConceptRelationship"("toConceptId");

-- CreateIndex
CREATE UNIQUE INDEX "ConceptRelationship_fromConceptId_toConceptId_kind_key" ON "ConceptRelationship"("fromConceptId", "toConceptId", "kind");

-- CreateIndex
CREATE INDEX "ConfusionPair_editionId_active_idx" ON "ConfusionPair"("editionId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "ConfusionPair_editionId_canonicalKey_key" ON "ConfusionPair"("editionId", "canonicalKey");

-- CreateIndex
CREATE INDEX "ConfusionEvidence_pairId_idx" ON "ConfusionEvidence"("pairId");

-- AddForeignKey
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "CourseEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptCitation" ADD CONSTRAINT "ConceptCitation_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptCitation" ADD CONSTRAINT "ConceptCitation_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "SourceSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptExamCategory" ADD CONSTRAINT "ConceptExamCategory_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptExamCategory" ADD CONSTRAINT "ConceptExamCategory_examCategoryId_fkey" FOREIGN KEY ("examCategoryId") REFERENCES "ExamCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptRelationship" ADD CONSTRAINT "ConceptRelationship_fromConceptId_fkey" FOREIGN KEY ("fromConceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptRelationship" ADD CONSTRAINT "ConceptRelationship_toConceptId_fkey" FOREIGN KEY ("toConceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfusionPair" ADD CONSTRAINT "ConfusionPair_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "CourseEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfusionPair" ADD CONSTRAINT "ConfusionPair_conceptAId_fkey" FOREIGN KEY ("conceptAId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfusionPair" ADD CONSTRAINT "ConfusionPair_conceptBId_fkey" FOREIGN KEY ("conceptBId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfusionEvidence" ADD CONSTRAINT "ConfusionEvidence_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "ConfusionPair"("id") ON DELETE CASCADE ON UPDATE CASCADE;
