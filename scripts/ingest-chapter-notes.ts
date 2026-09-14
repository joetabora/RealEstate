/**
 * Notes-only ingest for Chapter 1–2 (skips full PUB725 re-extract).
 * Run: PATH=./node_modules/.bin:$PATH tsx --env-file=.env scripts/ingest-chapter-notes.ts
 */
import path from "node:path";
import { access, readFile } from "node:fs/promises";
import { prisma } from "../src/lib/db/prisma";
import { getSourceMaterialPath } from "../src/lib/db/env";
import { seedPhase1 } from "../src/lib/db/seed";
import { seedPhase3 } from "../src/lib/knowledge/seed";
import { seedPhase4 } from "../src/lib/teach-me/seed";
import {
  CHAPTER_2_NOTES_PART,
  CHAPTER_3_NOTES_PART,
  CHAPTER_NOTES_PARTS,
  PUB725_EFFECTIVE_AT,
} from "../src/lib/ingest/catalog";
import { extractPdfPages, resolveSourceFile, sha256Hex } from "../src/lib/ingest/pdf-text";
import { buildSections } from "../src/lib/ingest/sections";
import { persistDocuments } from "../src/lib/ingest/persist";
import { INGEST_VERSION, type BuiltDocument } from "../src/lib/ingest/types";

async function ingestNotes(
  sourceRoot: string,
  jurisdiction: string,
  part: (typeof CHAPTER_NOTES_PARTS)[number],
): Promise<BuiltDocument> {
  const filePath = resolveSourceFile(sourceRoot, part.relativePath);
  await access(filePath);
  const data = new Uint8Array(await readFile(filePath));
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
    relativePath: part.relativePath,
    fileName: path.basename(part.relativePath),
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

async function main() {
  const sourceRoot = getSourceMaterialPath();
  const { edition } = await seedPhase1(prisma);
  const documents: BuiltDocument[] = [];
  for (const part of CHAPTER_NOTES_PARTS) {
    documents.push(await ingestNotes(sourceRoot, edition.jurisdiction, part));
  }
  const summary = await persistDocuments(prisma, edition.id, documents);
  const knowledge = await seedPhase3(prisma, edition.id);
  const assets = await seedPhase4(prisma, edition.id);
  const ch2Doc = await prisma.sourceDocument.findFirst({
    where: { slug: CHAPTER_2_NOTES_PART.slug },
  });
  const ch2Sections = ch2Doc
    ? await prisma.sourceSection.count({ where: { documentId: ch2Doc.id } })
    : 0;
  const ch3Doc = await prisma.sourceDocument.findFirst({
    where: { slug: CHAPTER_3_NOTES_PART.slug },
  });
  const ch3Sections = ch3Doc
    ? await prisma.sourceSection.count({ where: { documentId: ch3Doc.id } })
    : 0;
  console.log(
    JSON.stringify(
      {
        documents: summary.documents,
        sections: summary.sections,
        conceptCount: knowledge.conceptCount,
        pairCount: knowledge.pairCount,
        assetCount: assets.assetCount,
        ch2NotesSections: ch2Sections,
        ch3NotesSections: ch3Sections,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
