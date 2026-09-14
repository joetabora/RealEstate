/**
 * List Chapter 8 Title of Real Estate headings from notes PDF + PUB725 book + DB.
 * Run: PATH=./node_modules/.bin:$PATH tsx --env-file=.env scripts/list-ch8-headings.ts
 */
import { readFile } from "node:fs/promises";
import { getSourceMaterialPath } from "../src/lib/db/env";
import { prisma } from "../src/lib/db/prisma";
import { printedPageForPdfPage } from "../src/lib/ingest/catalog";
import { extractPdfPages, resolveSourceFile } from "../src/lib/ingest/pdf-text";

const NOTES_REL = "Course/Chapter8/Chapter 8 Title of Real Estate.pdf";
const BOOK_PDF_START = 133;
const BOOK_PDF_END = 146;

async function main() {
  const root = getSourceMaterialPath();
  const notesPath = resolveSourceFile(root, NOTES_REL);
  const bookPath = resolveSourceFile(root, "Course/PUB725_July_2024.pdf");

  const notes = await extractPdfPages(new Uint8Array(await readFile(notesPath)), () => null);
  console.log("=== NOTES headings ===");
  for (const h of notes.headings) {
    console.log(`p${h.pdfPage}\t${h.heading}`);
  }
  console.log("notes pages", notes.pages.length);
  console.log("\n=== NOTES page text (first 500 chars each) ===");
  for (const p of notes.pages) {
    console.log(`\n--- page ${p.pdfPage} ---`);
    console.log(p.text.slice(0, 500));
  }

  const book = await extractPdfPages(
    new Uint8Array(await readFile(bookPath)),
    printedPageForPdfPage,
  );
  const ch8 = book.headings.filter(
    (h) => h.pdfPage >= BOOK_PDF_START && h.pdfPage <= BOOK_PDF_END,
  );
  console.log(`\n=== BOOK Ch8 headings (pdf ${BOOK_PDF_START}-${BOOK_PDF_END}) ===`);
  for (const h of ch8) {
    console.log(`pdf${h.pdfPage} printed${printedPageForPdfPage(h.pdfPage)}\t${h.heading}`);
  }

  const sections = await prisma.sourceSection.findMany({
    where: { chapterNumber: 8 },
    select: {
      heading: true,
      pdfPageStart: true,
      printedPageStart: true,
      document: { select: { slug: true } },
    },
    orderBy: [{ pdfPageStart: "asc" }, { sortOrder: "asc" }],
  });
  console.log("\n=== DB chapterNumber=8 sections ===");
  for (const s of sections) {
    console.log(
      `${s.document.slug}\tpdf${s.pdfPageStart}\tprinted${s.printedPageStart}\t${s.heading}`,
    );
  }

  const existing = await prisma.concept.findMany({ select: { slug: true, chapterNumber: true } });
  console.log("\n=== existing concept slug count", existing.length, "===");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
