import type { PrismaClient } from "@prisma/client";
import type { BuiltDocument, IngestSummary } from "./types";

export async function persistDocuments(
  prisma: PrismaClient,
  editionId: string,
  documents: BuiltDocument[],
): Promise<IngestSummary> {
  let sections = 0;
  let ocrPlaceholders = 0;
  const chapters = new Set<number>();

  for (const document of documents) {
    await prisma.$transaction(async (tx) => {
      const saved = await tx.sourceDocument.upsert({
        where: {
          editionId_slug: {
            editionId,
            slug: document.slug,
          },
        },
        create: {
          editionId,
          slug: document.slug,
          title: document.title,
          layer: document.layer,
          authority: document.authority,
          jurisdiction: document.jurisdiction,
          relativePath: document.relativePath,
          fileName: document.fileName,
          checksumSha256: document.checksumSha256,
          publishedAt: document.publishedAt,
          effectiveAt: document.effectiveAt,
          pageCount: document.pageCount,
          firstPdfPage: document.firstPdfPage,
          lastPdfPage: document.lastPdfPage,
          hideBodyInUi: document.hideBodyInUi,
          ingestVersion: document.ingestVersion,
        },
        update: {
          title: document.title,
          layer: document.layer,
          authority: document.authority,
          jurisdiction: document.jurisdiction,
          relativePath: document.relativePath,
          fileName: document.fileName,
          checksumSha256: document.checksumSha256,
          publishedAt: document.publishedAt,
          effectiveAt: document.effectiveAt,
          pageCount: document.pageCount,
          firstPdfPage: document.firstPdfPage,
          lastPdfPage: document.lastPdfPage,
          hideBodyInUi: document.hideBodyInUi,
          ingestVersion: document.ingestVersion,
          ingestedAt: new Date(),
        },
      });

      await tx.visualAnchor.deleteMany({
        where: { section: { documentId: saved.id } },
      });
      await tx.sourceSection.deleteMany({ where: { documentId: saved.id } });
      await tx.sourceAsset.deleteMany({ where: { documentId: saved.id } });

      const pdfAsset = await tx.sourceAsset.create({
        data: {
          documentId: saved.id,
          kind: document.relativePath ? "pdf" : "blueprint",
          filePath: document.relativePath || null,
          mimeType: document.relativePath ? "application/pdf" : null,
        },
      });

      for (const section of document.sections) {
        const row = await tx.sourceSection.create({
          data: {
            documentId: saved.id,
            sortOrder: section.sortOrder,
            heading: section.heading,
            headingPath: section.headingPath,
            kind: section.kind,
            chapterNumber: section.chapterNumber,
            chapterTitle: section.chapterTitle,
            pdfPageStart: section.pdfPageStart,
            pdfPageEnd: section.pdfPageEnd,
            printedPageStart: section.printedPageStart,
            printedPageEnd: section.printedPageEnd,
            body: section.body,
            charCount: section.charCount,
            tokenEstimate: section.tokenEstimate,
            needsOcr: section.needsOcr,
          },
        });

        await tx.visualAnchor.create({
          data: {
            sectionId: row.id,
            assetId: pdfAsset.id,
            pdfPage: section.pdfPageStart,
            printedPage: section.printedPageStart,
            label: section.needsOcr
              ? `Page image placeholder (OCR later) — PDF p. ${section.pdfPageStart}`
              : `Page ${section.printedPageStart ?? section.pdfPageStart}`,
          },
        });

        if (section.needsOcr) {
          ocrPlaceholders += 1;
          await tx.sourceAsset.create({
            data: {
              documentId: saved.id,
              kind: document.layer === "forms" ? "form_pdf_page" : "page_render",
              pdfPage: section.pdfPageStart,
              printedPage: section.printedPageStart,
              filePath: null,
              mimeType: null,
            },
          });
        }

        sections += 1;
        if (section.chapterNumber != null) {
          chapters.add(section.chapterNumber);
        }
      }
    });
  }

  return {
    documents: documents.length,
    sections,
    ocrPlaceholders,
    chapters: [...chapters].sort((a, b) => a - b),
  };
}
