import type { PrismaClient } from "@prisma/client";
import { LOCAL_LEARNER_KEY } from "@/lib/blueprint";

export async function getLocalLearner(prisma: PrismaClient) {
  const learner = await prisma.learner.findUnique({
    where: { key: LOCAL_LEARNER_KEY },
  });

  if (!learner) {
    throw new Error(
      `Local learner "${LOCAL_LEARNER_KEY}" is missing. Run: npx prisma db seed`,
    );
  }

  return learner;
}

export { LOCAL_LEARNER_KEY };
