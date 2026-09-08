import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { formatPageCitation } from "@/lib/ingest/citation";
import type { SourceLayer } from "@/lib/ingest/types";
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
  documents: LibraryDocumentCard[];
};

export type LibraryDocumentData = {
  databaseConnected: boolean;
  document: LibraryDocumentCard | null;
  chapters: LibraryChapterRow[];
  sections: LibrarySectionRow[];
  selectedChapter: number | null;
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

    return {
      databaseConnected: true,
      ingested: documents.length > 0,
      conceptCount,
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
    return { databaseConnected: false, ingested: false, conceptCount: 0, documents: [] };
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
        anchors: { take: 1, orderBy: { createdAt: "asc" } },
      },
    });

    if (!section) {
      return null;
    }

    const hideBody = section.document.hideBodyInUi;
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
          ? "This page is image-heavy. OCR and page images are deferred to a later phase."
          : null,
      visualAnchorLabel: section.anchors[0]?.label ?? null,
    };
  } catch {
    return null;
  }
}
