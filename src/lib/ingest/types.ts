export const SOURCE_LAYERS = [
  "course_book",
  "chapter_notes",
  "dated_update",
  "exam_blueprint",
  "glossary",
  "forms",
  "math_appendix",
  "story_problem",
  "practice_exam",
  "pedagogy",
] as const;

export type SourceLayer = (typeof SOURCE_LAYERS)[number];

export const SOURCE_AUTHORITIES = [
  "educational",
  "regulatory_exam",
  "pedagogical",
] as const;

export type SourceAuthority = (typeof SOURCE_AUTHORITIES)[number];

export const SECTION_KINDS = ["chapter", "heading", "page", "part"] as const;
export type SectionKind = (typeof SECTION_KINDS)[number];

export const INGEST_VERSION = "phase2-v1";

/** ~4 characters per token. Used to keep long sections in the 400–800 token band. */
export const CHARS_PER_TOKEN = 4;
export const MAX_SECTION_TOKENS = 800;
export const LOW_TEXT_CHAR_THRESHOLD = 80;

export type ParsedPage = {
  pdfPage: number;
  printedPage: number | null;
  text: string;
  charCount: number;
};

export type DetectedHeading = {
  pdfPage: number;
  heading: string;
  depth: number;
  /** Character offset in that page's text, if found. */
  offset: number | null;
};

export type BuiltSection = {
  sortOrder: number;
  heading: string;
  headingPath: string[];
  kind: SectionKind;
  chapterNumber: number | null;
  chapterTitle: string | null;
  pdfPageStart: number;
  pdfPageEnd: number;
  printedPageStart: number | null;
  printedPageEnd: number | null;
  body: string;
  charCount: number;
  tokenEstimate: number;
  needsOcr: boolean;
};

export type BuiltDocument = {
  slug: string;
  title: string;
  layer: SourceLayer;
  authority: SourceAuthority;
  jurisdiction: string;
  relativePath: string;
  fileName: string;
  checksumSha256: string | null;
  publishedAt: Date | null;
  effectiveAt: Date | null;
  pageCount: number;
  firstPdfPage: number;
  lastPdfPage: number;
  hideBodyInUi: boolean;
  ingestVersion: string;
  sections: BuiltSection[];
};

export type IngestSummary = {
  documents: number;
  sections: number;
  ocrPlaceholders: number;
  chapters: number[];
};

export function estimateTokens(text: string): number {
  const length = text.trim().length;
  if (length === 0) {
    return 0;
  }
  return Math.ceil(length / CHARS_PER_TOKEN);
}
