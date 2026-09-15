import { prisma } from "@/lib/db/prisma";
import { transcribePendingVideos } from "@/lib/library/whisper";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.slice("--limit=".length)) : 1;

  console.log(
    dryRun
      ? "Dry run — no Whisper writes."
      : "Running local Whisper on pending videos (needs_verification only)…",
  );

  const { results, whisper, model } = await transcribePendingVideos({
    prisma,
    limit: Number.isFinite(limit) ? limit : 1,
    dryRun,
  });

  console.log(`whisper: ${whisper ?? "not found (brew install openai-whisper)"}`);
  console.log(`model: ${model}`);
  console.log(`Videos considered: ${results.length}`);
  for (const row of results) {
    console.log(
      `  ${row.status} · ${row.relativePath}` +
        (row.charCount ? ` · ${row.charCount} chars` : "") +
        (row.note ? ` · ${row.note}` : ""),
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
