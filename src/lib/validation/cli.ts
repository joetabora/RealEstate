import { prisma } from "@/lib/db/prisma";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { advanceQuestionGate, runQuestionPipeline } from "@/lib/validation/runner";

async function main() {
  const pipeline = process.argv.includes("--pipeline");
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.slice("--limit=".length)) : 20;

  const edition = await prisma.courseEdition.findUnique({
    where: { slug: COURSE_EDITION_SEED.slug },
  });
  if (!edition) {
    throw new Error("Course edition missing. Run seed first.");
  }

  const questions = await prisma.question.findMany({
    where: {
      editionId: edition.id,
      lifecycle: {
        in: [
          "generated",
          "source_check",
          "structural_check",
          "answer_check",
          "ambiguity_check",
          "wi_fact_check",
        ],
      },
    },
    take: Number.isFinite(limit) ? limit : 20,
    orderBy: { updatedAt: "asc" },
    select: { id: true, slug: true, lifecycle: true },
  });

  console.log(`Questions in pipeline: ${questions.length}`);
  for (const q of questions) {
    if (pipeline) {
      const steps = await runQuestionPipeline(prisma, q.id);
      const last = steps[steps.length - 1];
      console.log(
        `  ${q.slug}: ${q.lifecycle} → ${last?.toLifecycle ?? q.lifecycle}` +
          (last?.result && !last.result.passed
            ? ` FAIL ${last.result.reasons.join("; ")}`
            : ""),
      );
    } else {
      const step = await advanceQuestionGate(prisma, q.id);
      console.log(
        `  ${q.slug}: ${step.fromLifecycle} → ${step.toLifecycle}` +
          (step.result && !step.result.passed
            ? ` FAIL ${step.result.reasons.join("; ")}`
            : ""),
      );
    }
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
