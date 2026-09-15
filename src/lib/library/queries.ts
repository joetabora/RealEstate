import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { formatPageCitation } from "@/lib/ingest/citation";
import type { SourceLayer } from "@/lib/ingest/types";
import { OCR_STATUS_LABELS, type OcrStatus } from "./ocr";
import {
  courseChapterIndex,
  layerLabel,
  sortDocuments,
  toSectionRow,
  type LibraryChapterRow,
  type LibraryDocumentCard,
  type LibrarySectionDetail,
  type LibrarySectionRow,
} from "./view-models";

export type LibraryHomeData = {
  databaseConnected: boolean;
  ingested: boolean;
  conceptCount: number;
  ocrPendingCount: number;
  documents: LibraryDocumentCard[];
};

export type LibraryDocumentData = {
  databaseConnected: boolean;
  document: LibraryDocumentCard | null;
  chapters: LibraryChapterRow[];
  sections: LibrarySectionRow[];
  selectedChapter: number | null;
};

export type OcrQueueItem = {
  sectionId: string;
  documentSlug: string;
  documentTitle: string;
  heading: string;
  citation: string;
  ocrStatus: string;
  ocrStatusLabel: string;
  formNumber: string | null;
  visualAnchorLabel: string | null;
  hasLocalRender: boolean;
  renderImageHref: string | null;
  href: string;
};

export type OcrQueueData = {
  databaseConnected: boolean;
  pendingCount: number;
  items: OcrQueueItem[];
};

export async function getLibraryHome(): Promise<LibraryHomeData> {
  try {
    const documents = await prisma.sourceDocument.findMany({
      where: { edition: { slug: COURSE_EDITION_SEED.slug } },
      include: { _count: { select: { sections: true } } },
    });
    const conceptCount = await prisma.concept.count({
      where: { edition: { slug: COURSE_EDITION_SEED.slug } },
    });
    const ocrPendingCount = await prisma.sourceSection.count({
      where: {
        needsOcr: true,
        document: { edition: { slug: COURSE_EDITION_SEED.slug } },
      },
    });

    return {
      databaseConnected: true,
      ingested: documents.length > 0,
      conceptCount,
      ocrPendingCount,
      documents: sortDocuments(
        documents.map((document) => ({
          slug: document.slug,
          title: document.title,
          layer: document.layer as SourceLayer,
          layerLabel: layerLabel(document.layer),
          sectionCount: document._count.sections,
          pageCount: document.pageCount,
          hideBodyInUi: document.hideBodyInUi,
          citation: formatPageCitation({
            printedPageStart: null,
            printedPageEnd: null,
            pdfPageStart: document.firstPdfPage,
            pdfPageEnd: document.lastPdfPage,
          }),
        })),
      ),
    };
  } catch {
    return {
      databaseConnected: false,
      ingested: false,
      conceptCount: 0,
      ocrPendingCount: 0,
      documents: [],
    };
  }
}

export async function getLibraryDocument(
  slug: string,
  chapterNumber?: number,
): Promise<LibraryDocumentData> {
  try {
    const document = await prisma.sourceDocument.findFirst({
      where: { slug, edition: { slug: COURSE_EDITION_SEED.slug } },
      include: {
        sections: { orderBy: { sortOrder: "asc" } },
        _count: { select: { sections: true } },
      },
    });

    if (!document) {
      return {
        databaseConnected: true,
        document: null,
        chapters: [],
        sections: [],
        selectedChapter: chapterNumber ?? null,
      };
    }

    const chapters = document.slug === "pub725-course-book" ? courseChapterIndex(document.sections) : [];
    const visibleSections = document.sections.filter((section) => {
      if (section.kind === "chapter") {
        return false;
      }
      if (chapterNumber != null) {
        return section.chapterNumber === chapterNumber;
      }
      return true;
    });

    return {
      databaseConnected: true,
      document: {
        slug: document.slug,
        title: document.title,
        layer: document.layer as SourceLayer,
        layerLabel: layerLabel(document.layer),
        sectionCount: document._count.sections,
        pageCount: document.pageCount,
        hideBodyInUi: document.hideBodyInUi,
        citation: formatPageCitation({
          printedPageStart: null,
          printedPageEnd: null,
          pdfPageStart: document.firstPdfPage,
          pdfPageEnd: document.lastPdfPage,
        }),
      },
      chapters,
      selectedChapter: chapterNumber ?? null,
      sections: visibleSections.map((section) =>
        toSectionRow({
          id: section.id,
          heading: section.heading,
          headingPath: section.headingPath,
          kind: section.kind,
          chapterNumber: section.chapterNumber,
          printedPageStart: section.printedPageStart,
          printedPageEnd: section.printedPageEnd,
          pdfPageStart: section.pdfPageStart,
          pdfPageEnd: section.pdfPageEnd,
          needsOcr: section.needsOcr,
          hideBody: document.hideBodyInUi,
          documentTitle: document.title,
        }),
      ),
    };
  } catch {
    return {
      databaseConnected: false,
      document: null,
      chapters: [],
      sections: [],
      selectedChapter: chapterNumber ?? null,
    };
  }
}

export async function getLibrarySection(
  slug: string,
  sectionId: string,
): Promise<LibrarySectionDetail | null> {
  try {
    const section = await prisma.sourceSection.findFirst({
      where: {
        id: sectionId,
        document: { slug, edition: { slug: COURSE_EDITION_SEED.slug } },
      },
      include: {
        document: true,
        anchors: {
          take: 1,
          orderBy: { createdAt: "asc" },
          include: { asset: { select: { filePath: true, kind: true } } },
        },
      },
    });

    if (!section) {
      return null;
    }

    const hideBody = section.document.hideBodyInUi;
    const anchor = section.anchors[0] ?? null;
    const ocrStatus = (anchor?.ocrStatus as OcrStatus | undefined) ?? null;
    const row = toSectionRow({
      id: section.id,
      heading: section.heading,
      headingPath: section.headingPath,
      kind: section.kind,
      chapterNumber: section.chapterNumber,
      printedPageStart: section.printedPageStart,
      printedPageEnd: section.printedPageEnd,
      pdfPageStart: section.pdfPageStart,
      pdfPageEnd: section.pdfPageEnd,
      needsOcr: section.needsOcr,
      hideBody,
      documentTitle: section.document.title,
    });

    return {
      ...row,
      documentTitle: section.document.title,
      documentSlug: section.document.slug,
      body: hideBody ? null : section.body,
      withheldReason: hideBody
        ? "Practice-exam item text is stored locally and is not shown in Library."
        : section.needsOcr
          ? "This page is image-heavy. No OCR text has been invented. Open the OCR queue for status; local page renders are optional and gitignored."
          : null,
      visualAnchorLabel: anchor?.label ?? null,
      ocrStatus,
      ocrStatusLabel: ocrStatus ? OCR_STATUS_LABELS[ocrStatus] ?? ocrStatus : null,
      formNumber: anchor?.formNumber ?? null,
      hasLocalRender: Boolean(anchor?.asset?.filePath),
      renderAssetId:
        anchor?.asset?.filePath && anchor.assetId ? anchor.assetId : null,
      renderImageHref:
        anchor?.asset?.filePath && anchor.assetId
          ? `/api/library/page-render/${anchor.assetId}`
          : null,
    };
  } catch {
    return null;
  }
}

export async function getOcrQueue(): Promise<OcrQueueData> {
  try {
    const sections = await prisma.sourceSection.findMany({
      where: {
        needsOcr: true,
        document: { edition: { slug: COURSE_EDITION_SEED.slug } },
      },
      orderBy: [{ documentId: "asc" }, { sortOrder: "asc" }],
      take: 100,
      include: {
        document: { select: { slug: true, title: true } },
        anchors: {
          take: 1,
          orderBy: { createdAt: "asc" },
          include: { asset: { select: { filePath: true } } },
        },
      },
    });

    const items: OcrQueueItem[] = sections.map((section) => {
      const anchor = section.anchors[0] ?? null;
      const status = (anchor?.ocrStatus as OcrStatus | undefined) ?? "pending";
      return {
        sectionId: section.id,
        documentSlug: section.document.slug,
        documentTitle: section.document.title,
        heading: section.heading,
        citation: formatPageCitation({
          printedPageStart: section.printedPageStart,
          printedPageEnd: section.printedPageEnd,
          pdfPageStart: section.pdfPageStart,
          pdfPageEnd: section.pdfPageEnd,
        }),
        ocrStatus: status,
        ocrStatusLabel: OCR_STATUS_LABELS[status] ?? status,
        formNumber: anchor?.formNumber ?? null,
        visualAnchorLabel: anchor?.label ?? null,
        hasLocalRender: Boolean(anchor?.asset?.filePath),
        renderImageHref:
          anchor?.asset?.filePath && anchor.assetId
            ? `/api/library/page-render/${anchor.assetId}`
            : null,
        href: `/library/${section.document.slug}/${section.id}`,
      };
    });

    return {
      databaseConnected: true,
      pendingCount: items.length,
      items,
    };
  } catch {
    return { databaseConnected: false, pendingCount: 0, items: [] };
  }
}
