/**
 * List Chapter 9 Land Use headings from notes PDF + PUB725 book + DB.
 * Run: PATH=./node_modules/.bin:$PATH tsx --env-file=.env scripts/list-ch9-headings.ts
 */
import { readFile } from "node:fs/promises";
import { getSourceMaterialPath } from "../src/lib/db/env";
import { prisma } from "../src/lib/db/prisma";
import { printedPageForPdfPage } from "../src/lib/ingest/catalog";
import { extractPdfPages, resolveSourceFile } from "../src/lib/ingest/pdf-text";

const NOTES_REL = "Course/Chapter9/Chapter 9 Land Use.pdf";
const BOOK_PDF_START = 147;
const BOOK_PDF_END = 154;

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
  console.log("\n=== NOTES page text (first 450 chars each) ===");
  for (const p of notes.pages) {
    console.log(`\n--- page ${p.pdfPage} ---`);
    console.log(p.text.slice(0, 450));
  }

  const book = await extractPdfPages(
    new Uint8Array(await readFile(bookPath)),
    printedPageForPdfPage,
  );
  const ch9 = book.headings.filter(
    (h) => h.pdfPage >= BOOK_PDF_START && h.pdfPage <= BOOK_PDF_END,
  );
  console.log(`\n=== BOOK Ch9 headings (pdf ${BOOK_PDF_START}-${BOOK_PDF_END}) ===`);
  for (const h of ch9) {
    console.log(`pdf${h.pdfPage} printed${printedPageForPdfPage(h.pdfPage)}\t${h.heading}`);
  }

  const sections = await prisma.sourceSection.findMany({
    where: { chapterNumber: 9 },
    select: {
      heading: true,
      pdfPageStart: true,
      printedPageStart: true,
      document: { select: { slug: true } },
    },
    orderBy: [{ pdfPageStart: "asc" }, { sortOrder: "asc" }],
  });
  console.log("\n=== DB chapterNumber=9 sections ===");
  for (const s of sections) {
    console.log(
      `${s.document.slug}\tpdf${s.pdfPageStart}\tprinted${s.printedPageStart}\t${s.heading}`,
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
