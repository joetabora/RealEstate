import { prisma } from "@/lib/db/prisma";
import { catalogVideos } from "@/lib/library/catalog-videos";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(dryRun ? "Dry run — catalog only." : "Cataloging local course videos…");
  const { results, root } = await catalogVideos({ prisma, dryRun });
  console.log(`SOURCE_MATERIAL_PATH: ${root}`);
  console.log(`Videos: ${results.length}`);
  const created = results.filter((r) => r.status === "created").length;
  const updated = results.filter((r) => r.status === "updated").length;
  const dated = results.filter((r) => r.isDatedUpdate).length;
  console.log(`Created ${created} · updated ${updated} · dated updates ${dated}`);
  for (const row of results.slice(0, 12)) {
    console.log(
      `  ${row.status} · ch ${row.chapterNumber ?? "—"}` +
        (row.isDatedUpdate ? " · dated" : "") +
        ` · ${row.relativePath}`,
    );
  }
  if (results.length > 12) console.log(`  … ${results.length - 12} more`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
