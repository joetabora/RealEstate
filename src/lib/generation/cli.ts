import { prisma } from "@/lib/db/prisma";
import { getLocalLearner } from "@/lib/learner";
import { generateDraftQuestions } from "./service";
import type { GenerationMode } from "./types";

async function main() {
  const live = process.argv.includes("--live");
  const mode: GenerationMode = live ? "live" : "mock";
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.slice("--limit=".length)) : 3;

  const learner = await getLocalLearner(prisma);
  const result = await generateDraftQuestions({
    prisma,
    learnerId: learner.id,
    mode,
    limit: Number.isFinite(limit) ? limit : 3,
    online: true,
  });

  console.log(`Mode: ${result.mode}`);
  console.log(`Created: ${result.created.length}`);
  for (const row of result.created) {
    console.log(`  ${row.slug} (${row.lifecycle}) · ${row.pairKey}`);
  }
  if (result.skipped.length > 0) {
    console.log(`Skipped: ${result.skipped.length}`);
    for (const row of result.skipped) console.log(`  ${row}`);
  }
  if (result.tokenEstimate > 0) {
    console.log(`Token estimate: ${result.tokenEstimate}`);
  }
  console.log("Drafts stay lifecycle=generated until Validation gates + activate.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
