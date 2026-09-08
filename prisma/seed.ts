import { PrismaClient } from "@prisma/client";
import { seedPhase1 } from "../src/lib/db/seed";

const prisma = new PrismaClient();

async function main() {
  const result = await seedPhase1(prisma);
  console.log(`Seeded edition ${result.edition.slug}`);
  console.log(`Seeded ${result.examCategories.length} exam categories`);
  console.log(`Ensured learner ${result.learner.key}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
