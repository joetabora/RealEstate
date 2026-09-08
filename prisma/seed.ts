import { PrismaClient } from "@prisma/client";
import { seedPhase1 } from "../src/lib/db/seed";
import { seedPhase3 } from "../src/lib/knowledge/seed";

const prisma = new PrismaClient();

async function main() {
  const result = await seedPhase1(prisma);
  const knowledge = await seedPhase3(prisma, result.edition.id);
  console.log(`Seeded edition ${result.edition.slug}`);
  console.log(`Seeded ${result.examCategories.length} exam categories`);
  console.log(`Ensured learner ${result.learner.key}`);
  console.log(`Seeded ${knowledge.conceptCount} Chapter 1 concepts`);
  console.log(`Seeded ${knowledge.pairCount} active confusion pairs`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
