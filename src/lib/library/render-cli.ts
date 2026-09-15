import { getLocalPageRenderPath } from "@/lib/db/env";
import { prisma } from "@/lib/db/prisma";
import { renderPendingOcrPages } from "@/lib/library/page-render";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.slice("--limit=".length)) : 20;

  console.log(`Page render root: ${getLocalPageRenderPath()}`);
  console.log(dryRun ? "Dry run — no files written." : "Rendering pending OCR pages…");

  const { results, pdftoppm } = await renderPendingOcrPages({
    prisma,
    limit: Number.isFinite(limit) ? limit : 20,
    dryRun,
  });

  console.log(`pdftoppm: ${pdftoppm ?? "not found (install poppler)"}`);
  console.log(`Assets considered: ${results.length}`);
  for (const row of results) {
    console.log(
      `  ${row.status} · ${row.documentSlug} p.${row.pdfPage}` +
        (row.relativePath ? ` → ${row.relativePath}` : ""),
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
