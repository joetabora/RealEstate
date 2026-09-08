import { COURSE_CHAPTERS } from "@/lib/ingest/catalog";
import { formatPageCitation, formatSourceCitation } from "@/lib/ingest/citation";
import type { SourceLayer } from "@/lib/ingest/types";

export const LAYER_LABELS: Record<SourceLayer, string> = {
  course_book: "Course book",
  chapter_notes: "Chapter notes",
  dated_update: "Dated updates",
  exam_blueprint: "Exam blueprint",
  glossary: "Glossary",
  forms: "Forms",
  math_appendix: "Math appendix",
  story_problem: "Story problem",
  practice_exam: "Practice exam",
  pedagogy: "Pedagogy",
};

export const LAYER_ORDER: SourceLayer[] = [
  "exam_blueprint",
  "course_book",
  "chapter_notes",
  "forms",
  "story_problem",
  "glossary",
  "math_appendix",
  "practice_exam",
  "dated_update",
  "pedagogy",
];

export type LibraryDocumentCard = {
  slug: string;
  title: string;
  layer: SourceLayer;
  layerLabel: string;
  sectionCount: number;
  pageCount: number;
  hideBodyInUi: boolean;
  citation: string;
};

export type LibraryChapterRow = {
  number: number;
  title: string;
  pdfStart: number;
  pdfEnd: number;
  citation: string;
  sectionCount: number;
};

export type LibrarySectionRow = {
  id: string;
  heading: string;
  headingPath: string[];
  kind: string;
  chapterNumber: number | null;
  citation: string;
  needsOcr: boolean;
  hideBody: boolean;
};

export type LibrarySectionDetail = LibrarySectionRow & {
  documentTitle: string;
  documentSlug: string;
  body: string | null;
  withheldReason: string | null;
  visualAnchorLabel: string | null;
};

export function layerLabel(layer: string): string {
  return LAYER_LABELS[layer as SourceLayer] ?? layer;
}

export function sortDocuments<T extends { layer: string; title: string }>(documents: T[]): T[] {
  return [...documents].sort((a, b) => {
    const aOrder = LAYER_ORDER.indexOf(a.layer as SourceLayer);
    const bOrder = LAYER_ORDER.indexOf(b.layer as SourceLayer);
    if (aOrder !== bOrder) {
      return (aOrder === -1 ? 99 : aOrder) - (bOrder === -1 ? 99 : bOrder);
    }
    return a.title.localeCompare(b.title);
  });
}

export function courseChapterIndex(
  sections: Array<{
    chapterNumber: number | null;
    kind?: string;
    pdfPageStart: number;
    pdfPageEnd: number;
    printedPageStart: number | null;
    printedPageEnd: number | null;
  }>,
): LibraryChapterRow[] {
  return COURSE_CHAPTERS.map((chapter) => {
    const owned = sections.filter((section) => section.chapterNumber === chapter.number);
    const pdfStart = owned[0]?.pdfPageStart ?? chapter.pdfStart;
    const pdfEnd =
      owned.length > 0
        ? Math.max(...owned.map((section) => section.pdfPageEnd))
        : chapter.pdfStart;
    const printedStart = owned.find((section) => section.printedPageStart != null)?.printedPageStart ?? null;
    const printedEnd =
      [...owned].reverse().find((section) => section.printedPageEnd != null)?.printedPageEnd ?? null;

    return {
      number: chapter.number,
      title: chapter.title,
      pdfStart,
      pdfEnd,
      sectionCount: owned.filter((section) => section.kind !== "chapter").length,
      citation: formatPageCitation({
        printedPageStart: printedStart,
        printedPageEnd: printedEnd,
        pdfPageStart: pdfStart,
        pdfPageEnd: pdfEnd,
      }),
    };
  });
}

export function toSectionRow(input: {
  id: string;
  heading: string;
  headingPath: string[];
  kind: string;
  chapterNumber: number | null;
  printedPageStart: number | null;
  printedPageEnd: number | null;
  pdfPageStart: number;
  pdfPageEnd: number;
  needsOcr: boolean;
  hideBody: boolean;
  documentTitle: string;
}): LibrarySectionRow {
  return {
    id: input.id,
    heading: input.heading,
    headingPath: input.headingPath,
    kind: input.kind,
    chapterNumber: input.chapterNumber,
    needsOcr: input.needsOcr,
    hideBody: input.hideBody,
    citation: formatSourceCitation({
      documentTitle: input.documentTitle,
      heading: input.heading,
      printedPageStart: input.printedPageStart,
      printedPageEnd: input.printedPageEnd,
      pdfPageStart: input.pdfPageStart,
      pdfPageEnd: input.pdfPageEnd,
    }),
  };
}
