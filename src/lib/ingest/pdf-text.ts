import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { extractText, extractTextItems, getDocumentProxy } from "unpdf";
import type { DetectedHeading, ParsedPage } from "./types";
import { printedPageForPdfPage } from "./catalog";

const HEADING_MIN_FONT = 12.8;
const HEADING_MAX_FONT = 26;
const HEADING_MIN_CHARS = 3;
const HEADING_MAX_CHARS = 90;

type PdfDocument = Awaited<ReturnType<typeof getDocumentProxy>>;

type OutlineNode = {
  title?: string;
  dest?: unknown;
  items?: OutlineNode[];
};

type PdfRef = {
  num: number;
  gen: number;
};

export async function readPdfBuffer(filePath: string): Promise<Uint8Array> {
  const buffer = await readFile(filePath);
  return new Uint8Array(buffer);
}

export function sha256Hex(data: Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

export function resolveSourceFile(root: string, relativePath: string): string {
  return path.resolve(root, relativePath);
}

export async function extractPdfPages(
  data: Uint8Array,
  printedPageFn: (pdfPage: number) => number | null = printedPageForPdfPage,
): Promise<{ pages: ParsedPage[]; headings: DetectedHeading[] }> {
  const pdf = await getDocumentProxy(data);
  const [{ text }, { items }, outline] = await Promise.all([
    extractText(pdf, { mergePages: false }),
    extractTextItems(pdf),
    pdf.getOutline().catch(() => null),
  ]);

  const pages: ParsedPage[] = text.map((pageText, index) => {
    const pdfPage = index + 1;
    const cleaned = normalizePageText(pageText);
    return {
      pdfPage,
      printedPage: printedPageFn(pdfPage),
      text: cleaned,
      charCount: cleaned.length,
    };
  });

  const fontHeadings = headingsFromFontSizes(items, pages);
  const outlineHeadings = outlineIsUseful(outline)
    ? await headingsFromOutline(pdf, outline as OutlineNode[], pages)
    : [];

  const headings = mergeHeadings(outlineHeadings, fontHeadings);
  return { pages, headings };
}

export function normalizePageText(raw: string): string {
  return raw
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function outlineIsUseful(outline: unknown): outline is OutlineNode[] {
  if (!Array.isArray(outline) || outline.length < 8) {
    return false;
  }
  const titles: string[] = [];
  const walk = (nodes: OutlineNode[]) => {
    for (const node of nodes) {
      titles.push(node.title ?? "");
      if (node.items?.length) {
        walk(node.items);
      }
    }
  };
  walk(outline);
  if (titles.some((title) => /PUB725/i.test(title))) {
    return false;
  }
  return titles.filter((title) => title.trim().length > 0).length >= 8;
}

async function headingsFromOutline(
  pdf: PdfDocument,
  outline: OutlineNode[],
  pages: ParsedPage[],
): Promise<DetectedHeading[]> {
  const headings: DetectedHeading[] = [];

  const walk = async (nodes: OutlineNode[], depth: number) => {
    for (const node of nodes) {
      const heading = (node.title ?? "").trim();
      const pdfPage = await resolveOutlinePage(pdf, node.dest);
      if (heading && pdfPage) {
        const page = pages[pdfPage - 1];
        headings.push({
          pdfPage,
          heading,
          depth,
          offset: page ? findHeadingOffset(page.text, heading) : null,
        });
      }
      if (node.items?.length) {
        await walk(node.items, depth + 1);
      }
    }
  };

  await walk(outline, 0);
  return headings;
}

async function resolveOutlinePage(pdf: PdfDocument, dest: unknown): Promise<number | null> {
  try {
    let resolved = dest;
    if (typeof dest === "string") {
      resolved = await pdf.getDestination(dest);
    }
    if (!Array.isArray(resolved) || resolved.length === 0) {
      return null;
    }
    const ref = resolved[0];
    if (!isPdfRef(ref)) {
      return null;
    }
    const index = await pdf.getPageIndex(ref);
    return index + 1;
  } catch {
    return null;
  }
}

function isPdfRef(value: unknown): value is PdfRef {
  return (
    typeof value === "object" &&
    value !== null &&
    "num" in value &&
    "gen" in value &&
    typeof value.num === "number" &&
    typeof value.gen === "number"
  );
}

function headingsFromFontSizes(
  itemsByPage: Array<Array<{ str: string; fontSize: number; y: number }>>,
  pages: ParsedPage[],
): DetectedHeading[] {
  const headings: DetectedHeading[] = [];

  itemsByPage.forEach((pageItems, index) => {
    const pdfPage = index + 1;
    const page = pages[pdfPage - 1];
    const lines = groupItemsIntoLines(pageItems);
    for (const line of lines) {
      if (!isFontHeading(line.text, line.fontSize)) {
        continue;
      }
      headings.push({
        pdfPage,
        heading: line.text,
        depth: line.fontSize >= 16 ? 0 : 1,
        offset: page ? findHeadingOffset(page.text, line.text) : null,
      });
    }
  });

  return headings;
}

function groupItemsIntoLines(
  items: Array<{ str: string; fontSize: number; y: number }>,
): Array<{ text: string; fontSize: number }> {
  const buckets = new Map<number, Array<{ str: string; fontSize: number }>>();
  for (const item of items) {
    const key = Math.round(item.y);
    const bucket = buckets.get(key) ?? [];
    bucket.push({ str: item.str, fontSize: item.fontSize });
    buckets.set(key, bucket);
  }

  return [...buckets.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, parts]) => {
      const headingParts = parts.filter((part) => part.fontSize >= HEADING_MIN_FONT);
      const used = headingParts.length > 0 ? headingParts : parts;
      const text = used
        .map((part) => part.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      const fontSize = Math.max(...used.map((part) => part.fontSize));
      return { text, fontSize };
    })
    .filter((line) => line.text.length > 0);
}

export function isFontHeading(text: string, fontSize: number): boolean {
  if (fontSize < HEADING_MIN_FONT || fontSize >= HEADING_MAX_FONT) {
    return false;
  }
  if (text.length < HEADING_MIN_CHARS || text.length > HEADING_MAX_CHARS) {
    return false;
  }
  if (/^\d+[.)]?$/.test(text)) {
    return false;
  }
  if (/^REAL ESTATE SALES$/i.test(text) || /^FORMS APPENDIX$/i.test(text)) {
    return false;
  }
  return true;
}

export function findHeadingOffset(pageText: string, heading: string): number | null {
  const haystack = pageText.replace(/\s+/g, " ");
  const needle = heading.replace(/\s+/g, " ").trim();
  if (!needle) {
    return null;
  }
  const index = haystack.toLowerCase().indexOf(needle.toLowerCase());
  if (index >= 0) {
    return index;
  }
  const collapsed = needle.replace(/[’']/g, "'");
  const collapsedHay = haystack.replace(/[’']/g, "'");
  const fallback = collapsedHay.toLowerCase().indexOf(collapsed.toLowerCase());
  return fallback >= 0 ? fallback : null;
}

function mergeHeadings(
  outlineHeadings: DetectedHeading[],
  fontHeadings: DetectedHeading[],
): DetectedHeading[] {
  const seen = new Set<string>();
  const merged: DetectedHeading[] = [];

  for (const heading of [...outlineHeadings, ...fontHeadings]) {
    const key = `${heading.pdfPage}:${normalizeHeadingKey(heading.heading)}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    merged.push(heading);
  }

  merged.sort((a, b) => {
    if (a.pdfPage !== b.pdfPage) {
      return a.pdfPage - b.pdfPage;
    }
    return (a.offset ?? 0) - (b.offset ?? 0);
  });

  return merged;
}

export function normalizeHeadingKey(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
