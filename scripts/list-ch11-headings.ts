/**
 * List Chapter 11 Financing headings from notes PDF + PUB725 book + DB.
 * Run: PATH=./node_modules/.bin:$PATH tsx --env-file=.env scripts/list-ch11-headings.ts
 */
import { readFile } from "node:fs/promises";
import { getSourceMaterialPath } from "../src/lib/db/env";
import { prisma } from "../src/lib/db/prisma";
import { printedPageForPdfPage } from "../src/lib/ingest/catalog";
import { extractPdfPages, resolveSourceFile } from "../src/lib/ingest/pdf-text";

const NOTES_REL = "Course/Chapter11/Chapter 11 Finacing.pdf";
const BOOK_PDF_START = 199;
const BOOK_PDF_END = 214;

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

  const book = await extractPdfPages(
    new Uint8Array(await readFile(bookPath)),
    printedPageForPdfPage,
  );
  const ch11 = book.headings.filter(
    (h) => h.pdfPage >= BOOK_PDF_START && h.pdfPage <= BOOK_PDF_END,
  );
  console.log(`\n=== BOOK Ch11 headings (pdf ${BOOK_PDF_START}-${BOOK_PDF_END}) ===`);
  for (const h of ch11) {
    console.log(`pdf${h.pdfPage} printed${printedPageForPdfPage(h.pdfPage)}\t${h.heading}`);
  }

  const sections = await prisma.sourceSection.findMany({
    where: { chapterNumber: 11, NOT: { heading: { contains: "(cont.)" } } },
    select: {
      heading: true,
      pdfPageStart: true,
      printedPageStart: true,
      document: { select: { slug: true } },
    },
    orderBy: [{ pdfPageStart: "asc" }, { sortOrder: "asc" }],
  });
  console.log("\n=== DB chapterNumber=11 sections (no cont.) ===");
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
