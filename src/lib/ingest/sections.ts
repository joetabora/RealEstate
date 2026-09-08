import {
  chapterAtPdfPage,
  chapterPdfEnd,
  COURSE_CHAPTERS,
} from "./catalog";
import {
  estimateTokens,
  LOW_TEXT_CHAR_THRESHOLD,
  MAX_SECTION_TOKENS,
  type BuiltSection,
  type DetectedHeading,
  type ParsedPage,
  type SectionKind,
} from "./types";

const RUNNING_HEADER = /^(REAL ESTATE SALES|FORMS APPENDIX|Story Problem|Practice Exam|Glossary|Math Appendix|Agency Relationships\s*-\s*1|i{1,3}|iv|\d+)$/i;

export function cleanSectionBody(text: string): string {
  const lines = text.split("\n").map((line) => line.trim());
  const kept = lines.filter((line) => line.length > 0 && !RUNNING_HEADER.test(line));
  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function buildSections(input: {
  pages: ParsedPage[];
  headings: DetectedHeading[];
  defaultHeading: string;
  injectChapters?: boolean;
  forcePageSections?: boolean;
  chapterNumber?: number | null;
  chapterTitle?: string | null;
}): BuiltSection[] {
  const pages = input.pages.filter((page) => page.pdfPage > 0);
  if (pages.length === 0) {
    return [];
  }

  const allLowText = pages.every((page) => page.charCount < LOW_TEXT_CHAR_THRESHOLD);
  const hasStructure = input.headings.length > 0 || Boolean(input.injectChapters);
  if (input.forcePageSections || (allLowText && !hasStructure)) {
    return pages.map((page, index) =>
      makeSection({
        sortOrder: index,
        heading: `${input.defaultHeading} — PDF p. ${page.pdfPage}`,
        headingPath: [input.defaultHeading],
        kind: "page",
        chapterNumber: input.chapterNumber ?? chapterAtPdfPage(page.pdfPage)?.number ?? null,
        chapterTitle: input.chapterTitle ?? chapterAtPdfPage(page.pdfPage)?.title ?? null,
        pdfPageStart: page.pdfPage,
        pdfPageEnd: page.pdfPage,
        printedPageStart: page.printedPage,
        printedPageEnd: page.printedPage,
        body: cleanSectionBody(page.text),
        needsOcr: page.charCount < LOW_TEXT_CHAR_THRESHOLD,
      }),
    );
  }

  const headings = [
    ...(input.injectChapters ? chapterHeadings(pages) : []),
    ...input.headings.filter((heading) =>
      pages.some((page) => page.pdfPage === heading.pdfPage),
    ),
  ];

  const unique = dedupeHeadings(headings);
  if (unique.length === 0) {
    return splitPagesByTokenBudget(pages, input.defaultHeading, input.chapterNumber, input.chapterTitle);
  }

  const slices = headingsToSlices(unique, pages, input.defaultHeading);
  const sections: BuiltSection[] = [];

  for (const slice of slices) {
    const chapter =
      input.chapterNumber != null
        ? {
            number: input.chapterNumber,
            title: input.chapterTitle ?? null,
          }
        : chapterAtPdfPage(slice.pdfPageStart);
    const kind: SectionKind = slice.kind;
    const body = cleanSectionBody(slice.body);
    const chapterNumber = chapter?.number ?? input.chapterNumber ?? null;
    const chapterTitle = chapter?.title ?? input.chapterTitle ?? null;
    const chapterEnd = chapterNumber ? chapterPdfEndFor(chapterNumber, pages) : slice.pdfPageEnd;
    const base = makeSection({
      sortOrder: sections.length,
      heading: slice.heading,
      headingPath: slice.headingPath,
      kind,
      chapterNumber,
      chapterTitle,
      pdfPageStart: slice.pdfPageStart,
      pdfPageEnd: kind === "chapter" ? chapterEnd : slice.pdfPageEnd,
      printedPageStart: printedOf(slice.pdfPageStart, pages),
      printedPageEnd: printedOf(kind === "chapter" ? chapterEnd : slice.pdfPageEnd, pages),
      body: kind === "chapter" ? "" : body,
      needsOcr: kind !== "chapter" && body.length < LOW_TEXT_CHAR_THRESHOLD,
    });
    sections.push(...(kind === "chapter" ? [base] : splitSectionOnTokenBudget(base, pages)));
  }

  return sections.map((section, index) => ({ ...section, sortOrder: index }));
}

function chapterHeadings(pages: ParsedPage[]): DetectedHeading[] {
  const first = pages[0]?.pdfPage ?? 1;
  const last = pages[pages.length - 1]?.pdfPage ?? first;
  return COURSE_CHAPTERS.filter(
    (chapter) => chapter.pdfStart >= first && chapter.pdfStart <= last,
  ).map((chapter) => ({
    pdfPage: chapter.pdfStart,
    heading: `Chapter ${chapter.number} ${chapter.title}`,
    depth: 0,
    offset: 0,
  }));
}

function dedupeHeadings(headings: DetectedHeading[]): DetectedHeading[] {
  const seen = new Set<string>();
  const result: DetectedHeading[] = [];
  const sorted = [...headings].sort((a, b) => {
    if (a.pdfPage !== b.pdfPage) {
      return a.pdfPage - b.pdfPage;
    }
    return (a.offset ?? 0) - (b.offset ?? 0);
  });
  for (const heading of sorted) {
    const key = `${heading.pdfPage}:${heading.heading.toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(heading);
  }
  return result;
}

function headingsToSlices(
  headings: DetectedHeading[],
  pages: ParsedPage[],
  fallbackHeading: string,
): Array<{
  heading: string;
  headingPath: string[];
  kind: SectionKind;
  pdfPageStart: number;
  pdfPageEnd: number;
  body: string;
}> {
  const firstPage = pages[0];
  const lastPage = pages[pages.length - 1];
  const slices: Array<{
    heading: string;
    headingPath: string[];
    kind: SectionKind;
    pdfPageStart: number;
    pdfPageEnd: number;
    body: string;
  }> = [];

  const path: string[] = [];

  if ((headings[0]?.pdfPage ?? firstPage.pdfPage) > firstPage.pdfPage || (headings[0]?.offset ?? 0) > 0) {
    const preambleEnd = headings[0]
      ? { pdfPage: headings[0].pdfPage, offset: headings[0].offset ?? 0 }
      : { pdfPage: lastPage.pdfPage, offset: null };
    const body = extractRange(
      pages,
      { pdfPage: firstPage.pdfPage, offset: 0 },
      preambleEnd,
    );
    if (cleanSectionBody(body).length > 0) {
      slices.push({
        heading: fallbackHeading,
        headingPath: [fallbackHeading],
        kind: "part",
        pdfPageStart: firstPage.pdfPage,
        pdfPageEnd: headings[0]?.pdfPage ?? lastPage.pdfPage,
        body,
      });
    }
  }

  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index];
    const next = headings[index + 1];
    while (path.length > heading.depth) {
      path.pop();
    }
    path[heading.depth] = heading.heading;
    const headingPath = path.filter(Boolean);
    const start = { pdfPage: heading.pdfPage, offset: heading.offset ?? 0 };
    const end = next
      ? { pdfPage: next.pdfPage, offset: next.offset ?? 0 }
      : { pdfPage: lastPage.pdfPage, offset: null };
    const body = extractRange(pages, start, end);
    const isChapter = /^Chapter \d+\b/.test(heading.heading) && heading.depth === 0;
    slices.push({
      heading: heading.heading,
      headingPath: headingPath.length > 0 ? headingPath : [heading.heading],
      kind: isChapter ? "chapter" : "heading",
      pdfPageStart: heading.pdfPage,
      pdfPageEnd: next ? Math.max(heading.pdfPage, next.pdfPage) : lastPage.pdfPage,
      body,
    });
  }

  return slices;
}

function extractRange(
  pages: ParsedPage[],
  start: { pdfPage: number; offset: number },
  end: { pdfPage: number; offset: number | null },
): string {
  const chunks: string[] = [];
  for (const page of pages) {
    if (page.pdfPage < start.pdfPage || page.pdfPage > end.pdfPage) {
      continue;
    }
    const collapsed = page.text.replace(/\s+/g, " ").trim();
    let slice = collapsed;
    if (page.pdfPage === start.pdfPage && start.offset > 0) {
      slice = collapsed.slice(start.offset);
    }
    if (page.pdfPage === end.pdfPage && end.offset != null && page.pdfPage !== start.pdfPage) {
      slice = collapsed.slice(0, end.offset);
    } else if (
      page.pdfPage === end.pdfPage &&
      end.offset != null &&
      page.pdfPage === start.pdfPage
    ) {
      slice = collapsed.slice(start.offset, end.offset);
    }
    if (slice.trim()) {
      chunks.push(slice.trim());
    }
  }
  return chunks.join("\n\n");
}

function splitPagesByTokenBudget(
  pages: ParsedPage[],
  heading: string,
  chapterNumber?: number | null,
  chapterTitle?: string | null,
): BuiltSection[] {
  const groups: ParsedPage[][] = [];
  let current: ParsedPage[] = [];
  let tokens = 0;

  for (const page of pages) {
    const pageTokens = estimateTokens(page.text);
    if (current.length > 0 && tokens + pageTokens > MAX_SECTION_TOKENS) {
      groups.push(current);
      current = [];
      tokens = 0;
    }
    current.push(page);
    tokens += pageTokens;
  }
  if (current.length > 0) {
    groups.push(current);
  }

  return groups.map((group, index) => {
    const start = group[0];
    const end = group[group.length - 1];
    const chapter = chapterNumber != null ? null : chapterAtPdfPage(start.pdfPage);
    return makeSection({
      sortOrder: index,
      heading: groups.length > 1 ? `${heading} (${index + 1})` : heading,
      headingPath: [heading],
      kind: "part",
      chapterNumber: chapterNumber ?? chapter?.number ?? null,
      chapterTitle: chapterTitle ?? chapter?.title ?? null,
      pdfPageStart: start.pdfPage,
      pdfPageEnd: end.pdfPage,
      printedPageStart: start.printedPage,
      printedPageEnd: end.printedPage,
      body: cleanSectionBody(group.map((page) => page.text).join("\n\n")),
      needsOcr: group.every((page) => page.charCount < LOW_TEXT_CHAR_THRESHOLD),
    });
  });
}

function splitSectionOnTokenBudget(section: BuiltSection, pages: ParsedPage[]): BuiltSection[] {
  if (section.tokenEstimate <= MAX_SECTION_TOKENS) {
    return [section];
  }

  const spanned = pages.filter(
    (page) => page.pdfPage >= section.pdfPageStart && page.pdfPage <= section.pdfPageEnd,
  );
  if (spanned.length <= 1) {
    return splitBodyParagraphs(section);
  }

  const pieces: BuiltSection[] = [];
  let bucket: ParsedPage[] = [];
  let tokens = 0;

  for (const page of spanned) {
    const pageTokens = estimateTokens(page.text);
    if (bucket.length > 0 && tokens + pageTokens > MAX_SECTION_TOKENS) {
      pieces.push(sectionFromPages(section, bucket, pieces.length));
      bucket = [];
      tokens = 0;
    }
    bucket.push(page);
    tokens += pageTokens;
  }
  if (bucket.length > 0) {
    pieces.push(sectionFromPages(section, bucket, pieces.length));
  }
  return pieces.length > 0 ? pieces : [section];
}

function splitBodyParagraphs(section: BuiltSection): BuiltSection[] {
  const paragraphs = section.body.split(/\n{2,}/).filter((part) => part.trim());
  if (paragraphs.length <= 1) {
    return [section];
  }

  const pieces: string[][] = [];
  let bucket: string[] = [];
  let tokens = 0;
  for (const paragraph of paragraphs) {
    const paragraphTokens = estimateTokens(paragraph);
    if (bucket.length > 0 && tokens + paragraphTokens > MAX_SECTION_TOKENS) {
      pieces.push(bucket);
      bucket = [];
      tokens = 0;
    }
    bucket.push(paragraph);
    tokens += paragraphTokens;
  }
  if (bucket.length > 0) {
    pieces.push(bucket);
  }

  return pieces.map((part, index) =>
    makeSection({
      sortOrder: section.sortOrder + index,
      heading: index === 0 ? section.heading : `${section.heading} (cont.)`,
      headingPath: section.headingPath,
      kind: section.kind,
      chapterNumber: section.chapterNumber,
      chapterTitle: section.chapterTitle,
      pdfPageStart: section.pdfPageStart,
      pdfPageEnd: section.pdfPageEnd,
      printedPageStart: section.printedPageStart,
      printedPageEnd: section.printedPageEnd,
      body: part.join("\n\n"),
      needsOcr: section.needsOcr,
    }),
  );
}

function sectionFromPages(
  section: BuiltSection,
  pages: ParsedPage[],
  index: number,
): BuiltSection {
  const start = pages[0];
  const end = pages[pages.length - 1];
  return makeSection({
    sortOrder: section.sortOrder + index,
    heading: index === 0 ? section.heading : `${section.heading} (cont.)`,
    headingPath: section.headingPath,
    kind: section.kind,
    chapterNumber: section.chapterNumber,
    chapterTitle: section.chapterTitle,
    pdfPageStart: start.pdfPage,
    pdfPageEnd: end.pdfPage,
    printedPageStart: start.printedPage,
    printedPageEnd: end.printedPage,
    body: cleanSectionBody(pages.map((page) => page.text).join("\n\n")),
    needsOcr: pages.every((page) => page.charCount < LOW_TEXT_CHAR_THRESHOLD),
  });
}

function printedOf(pdfPage: number, pages: ParsedPage[]): number | null {
  return pages.find((page) => page.pdfPage === pdfPage)?.printedPage ?? null;
}

function chapterPdfEndFor(chapterNumber: number, pages: ParsedPage[]): number {
  const chapter = COURSE_CHAPTERS.find((row) => row.number === chapterNumber);
  if (!chapter) {
    return pages[pages.length - 1]?.pdfPage ?? 1;
  }
  return Math.min(chapterPdfEnd(chapter), pages[pages.length - 1]?.pdfPage ?? chapter.pdfStart);
}

function makeSection(input: {
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
  needsOcr: boolean;
}): BuiltSection {
  const body = input.body;
  return {
    sortOrder: input.sortOrder,
    heading: input.heading,
    headingPath: input.headingPath,
    kind: input.kind,
    chapterNumber: input.chapterNumber,
    chapterTitle: input.chapterTitle,
    pdfPageStart: input.pdfPageStart,
    pdfPageEnd: input.pdfPageEnd,
    printedPageStart: input.printedPageStart,
    printedPageEnd: input.printedPageEnd,
    body,
    charCount: body.length,
    tokenEstimate: estimateTokens(body),
    needsOcr: input.needsOcr,
  };
}

export function chapterRangeLabel(chapterNumber: number): { pdfStart: number; pdfEnd: number } | null {
  const chapter = COURSE_CHAPTERS.find((row) => row.number === chapterNumber);
  if (!chapter) {
    return null;
  }
  return { pdfStart: chapter.pdfStart, pdfEnd: chapterPdfEnd(chapter) };
}
