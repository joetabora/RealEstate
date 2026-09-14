import {
  CHAPTER_NOTES_PARTS,
  BLUEPRINT_SOURCE_PART,
  editionDefaults,
  PUB725_EFFECTIVE_AT,
  PUB725_PARTS,
  PUB725_RELATIVE_PATH,
  printedPageForPdfPage,
} from "./catalog";
import { access } from "node:fs/promises";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import { SALESPERSON_EXAM_CATEGORIES } from "@/lib/blueprint";
import { seedPhase1 } from "@/lib/db/seed";
import { seedPhase3 } from "@/lib/knowledge/seed";
import { seedPhase4 } from "@/lib/teach-me/seed";
import { extractPdfPages, resolveSourceFile, sha256Hex } from "./pdf-text";
import { persistDocuments } from "./persist";
import { buildSections } from "./sections";
import {
  INGEST_VERSION,
  type BuiltDocument,
  type IngestSummary,
} from "./types";

export async function ingestPhase2(
  prisma: PrismaClient,
  sourceRoot: string,
): Promise<IngestSummary> {
  await assertReadable(resolveSourceFile(sourceRoot, PUB725_RELATIVE_PATH));
  for (const notes of CHAPTER_NOTES_PARTS) {
    await assertReadable(resolveSourceFile(sourceRoot, notes.relativePath));
  }

  const { edition } = await seedPhase1(prisma);
  const documents: BuiltDocument[] = [];

  documents.push(buildBlueprintDocument(edition.jurisdiction));
  documents.push(...(await ingestPub725(sourceRoot, edition.jurisdiction)));
  for (const notes of CHAPTER_NOTES_PARTS) {
    documents.push(await ingestChapterNotes(sourceRoot, edition.jurisdiction, notes));
  }

  const summary = await persistDocuments(prisma, edition.id, documents);
  await seedPhase3(prisma, edition.id);
  await seedPhase4(prisma, edition.id);
  return summary;
}

async function ingestPub725(sourceRoot: string, jurisdiction: string): Promise<BuiltDocument[]> {
  const relativePath = PUB725_RELATIVE_PATH;
  const filePath = resolveSourceFile(sourceRoot, relativePath);
  const data = await readPdf(filePath);
  const checksum = sha256Hex(data);
  const { pages, headings } = await extractPdfPages(data, printedPageForPdfPage);

  return PUB725_PARTS.map((part) => {
    const partPages = pages.filter(
      (page) => page.pdfPage >= part.pdfStart && page.pdfPage <= part.pdfEnd,
    );
    const forcePageSections = part.layer === "forms" || part.layer === "practice_exam";
    const sections = buildSections({
      pages: partPages,
      headings,
      defaultHeading: part.title,
      injectChapters: part.slug === "pub725-course-book",
      forcePageSections,
    });

    return {
      slug: part.slug,
      title: part.title,
      layer: part.layer,
      authority: "educational",
      jurisdiction,
      relativePath,
      fileName: path.basename(relativePath),
      checksumSha256: checksum,
      publishedAt: PUB725_EFFECTIVE_AT,
      effectiveAt: PUB725_EFFECTIVE_AT,
      pageCount: partPages.length,
      firstPdfPage: part.pdfStart,
      lastPdfPage: part.pdfEnd,
      hideBodyInUi: part.hideBodyInUi,
      ingestVersion: INGEST_VERSION,
      sections,
    };
  });
}

async function ingestChapterNotes(
  sourceRoot: string,
  jurisdiction: string,
  part: (typeof CHAPTER_NOTES_PARTS)[number],
): Promise<BuiltDocument> {
  const relativePath = part.relativePath;
  const filePath = resolveSourceFile(sourceRoot, relativePath);
  const data = await readPdf(filePath);
  const { pages, headings } = await extractPdfPages(data, () => null);

  const sections = buildSections({
    pages,
    headings,
    defaultHeading: part.title,
    injectChapters: false,
    chapterNumber: part.chapterNumber,
    chapterTitle: part.chapterTitle,
  });

  return {
    slug: part.slug,
    title: part.title,
    layer: part.layer,
    authority: "educational",
    jurisdiction,
    relativePath,
    fileName: path.basename(relativePath),
    checksumSha256: sha256Hex(data),
    publishedAt: null,
    effectiveAt: PUB725_EFFECTIVE_AT,
    pageCount: pages.length,
    firstPdfPage: pages[0]?.pdfPage ?? 1,
    lastPdfPage: pages[pages.length - 1]?.pdfPage ?? 1,
    hideBodyInUi: false,
    ingestVersion: INGEST_VERSION,
    sections,
  };
}

function buildBlueprintDocument(jurisdiction: string): BuiltDocument {
  const defaults = editionDefaults();
  const sections = SALESPERSON_EXAM_CATEGORIES.map((category, index) => ({
    sortOrder: index,
    heading: `${category.code}. ${category.name}`,
    headingPath: [BLUEPRINT_SOURCE_PART.title, `${category.code}. ${category.name}`],
    kind: "heading" as const,
    chapterNumber: null,
    chapterTitle: null,
    pdfPageStart: 1,
    pdfPageEnd: 1,
    printedPageStart: null,
    printedPageEnd: null,
    body: `${category.weight} scored salesperson items. This is the public Pearson outline, not course teaching text.`,
    charCount: 0,
    tokenEstimate: 0,
    needsOcr: false,
  })).map((section) => ({
    ...section,
    charCount: section.body.length,
    tokenEstimate: Math.ceil(section.body.length / 4),
  }));

  return {
    slug: BLUEPRINT_SOURCE_PART.slug,
    title: BLUEPRINT_SOURCE_PART.title,
    layer: BLUEPRINT_SOURCE_PART.layer,
    authority: "regulatory_exam",
    jurisdiction,
    relativePath: "",
    fileName: "",
    checksumSha256: null,
    publishedAt: null,
    effectiveAt: defaults.effectiveAt,
    pageCount: 0,
    firstPdfPage: 1,
    lastPdfPage: 1,
    hideBodyInUi: false,
    ingestVersion: INGEST_VERSION,
    sections,
  };
}

async function readPdf(filePath: string): Promise<Uint8Array> {
  const { readFile } = await import("node:fs/promises");
  return new Uint8Array(await readFile(filePath));
}

async function assertReadable(filePath: string): Promise<void> {
  try {
    await access(filePath);
  } catch {
    throw new Error(
      `Source file is missing: ${filePath}. Set SOURCE_MATERIAL_PATH to the local course folder.`,
    );
  }
}
