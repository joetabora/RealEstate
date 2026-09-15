import { prisma } from "@/lib/db/prisma";
import { ocrRenderedPages } from "@/lib/library/tesseract";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.slice("--limit=".length)) : 20;

  console.log(dryRun ? "Dry run — no OCR writes." : "Running local Tesseract on rendered pages…");

  const { results, tesseract } = await ocrRenderedPages({
    prisma,
    limit: Number.isFinite(limit) ? limit : 20,
    dryRun,
  });

  console.log(`tesseract: ${tesseract ?? "not found (brew install tesseract)"}`);
  console.log(`Anchors considered: ${results.length}`);
  for (const row of results) {
    console.log(
      `  ${row.status} · ${row.documentSlug} p.${row.pdfPage}` +
        (row.charCount ? ` · ${row.charCount} chars` : ""),
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
