import { getSourceMaterialPath } from "@/lib/db/env";
import { prisma } from "@/lib/db/prisma";
import { ingestPhase2 } from "./run";

async function main() {
  const sourceRoot = getSourceMaterialPath();
  console.log(`Ingesting from ${sourceRoot}`);
  const summary = await ingestPhase2(prisma, sourceRoot);
  console.log(`Documents: ${summary.documents}`);
  console.log(`Sections: ${summary.sections}`);
  console.log(`OCR placeholders: ${summary.ocrPlaceholders}`);
  console.log(`Chapters present: ${summary.chapters.join(", ")}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
