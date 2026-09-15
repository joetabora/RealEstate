import { PrismaClient } from "@prisma/client";
import { seedPhase1 } from "../src/lib/db/seed";
import { seedPhase3 } from "../src/lib/knowledge/seed";
import { seedPhase4 } from "../src/lib/teach-me/seed";
import { seedPhase5 } from "../src/lib/questions/seed";

const prisma = new PrismaClient();

async function main() {
  const result = await seedPhase1(prisma);
  const knowledge = await seedPhase3(prisma, result.edition.id);
  const assets = await seedPhase4(prisma, result.edition.id);
  const questions = await seedPhase5(prisma, result.edition.id);
  console.log(`Seeded edition ${result.edition.slug}`);
  console.log(`Seeded ${result.examCategories.length} exam categories`);
  console.log(`Ensured learner ${result.learner.key}`);
  console.log(`Seeded ${knowledge.conceptCount} concepts (Chapters 1–14)`);
  console.log(`Seeded ${knowledge.pairCount} active confusion pairs`);
  console.log(`Seeded ${assets.assetCount} Teach Me assets (Ch1–Ch14 sittings)`);
  console.log(`Seeded ${questions.questionCount} Phase 5 questions (Chapters 1–13 practice)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
