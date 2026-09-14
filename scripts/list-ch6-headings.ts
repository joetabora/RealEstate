/**
 * List Chapter 6 Valuation headings from notes PDF + PUB725 book + DB.
 * Run: PATH=./node_modules/.bin:$PATH tsx --env-file=.env scripts/list-ch6-headings.ts
 */
import { readFile } from "node:fs/promises";
import { getSourceMaterialPath } from "../src/lib/db/env";
import { prisma } from "../src/lib/db/prisma";
import { printedPageForPdfPage } from "../src/lib/ingest/catalog";
import { extractPdfPages, resolveSourceFile } from "../src/lib/ingest/pdf-text";

async function main() {
  const root = getSourceMaterialPath();
  const notesPath = resolveSourceFile(root, "Course/Chapter6/Chapter 6 Valuation.pdf");
  const bookPath = resolveSourceFile(root, "Course/PUB725_July_2024.pdf");

  const notes = await extractPdfPages(new Uint8Array(await readFile(notesPath)), () => null);
  console.log("=== NOTES headings ===");
  for (const h of notes.headings) {
    console.log(`p${h.pdfPage}\t${h.heading}`);
  }
  console.log("notes pages", notes.pages.length);
  console.log("\n=== NOTES page text (first 800 chars each) ===");
  for (const p of notes.pages) {
    console.log(`\n--- page ${p.pdfPage} ---`);
    console.log(p.text.slice(0, 800));
  }

  const book = await extractPdfPages(
    new Uint8Array(await readFile(bookPath)),
    printedPageForPdfPage,
  );
  const ch6 = book.headings.filter((h) => h.pdfPage >= 111 && h.pdfPage <= 118);
  console.log("\n=== BOOK Ch6 headings (pdf 111-118) ===");
  for (const h of ch6) {
    console.log(`pdf${h.pdfPage} printed${printedPageForPdfPage(h.pdfPage)}\t${h.heading}`);
  }

  const sections = await prisma.sourceSection.findMany({
    where: { chapterNumber: 6 },
    select: {
      heading: true,
      pdfPageStart: true,
      printedPageStart: true,
      document: { select: { slug: true } },
    },
    orderBy: [{ pdfPageStart: "asc" }, { sortOrder: "asc" }],
  });
  console.log("\n=== DB chapterNumber=6 sections ===");
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
