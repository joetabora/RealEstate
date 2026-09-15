import type { PrismaClient } from "@prisma/client";
import { allocateExamSeats } from "./allocate";
import type { ExamCategoryQuota } from "./types";

export type ExamQuestionPick = {
  id: string;
  conceptId: string | null;
  primaryCategoryCode: string;
};

/**
 * Blueprint-balanced picks from active MCQs. Primary category = first linked code.
 * Does not invent stems or import the course practice exam.
 */
export async function selectExamSimulationQuestions(input: {
  prisma: PrismaClient;
  editionId: string;
}): Promise<{ picks: ExamQuestionPick[]; quotas: ExamCategoryQuota[] }> {
  const questions = await input.prisma.question.findMany({
    where: { editionId: input.editionId, lifecycle: "active" },
    select: {
      id: true,
      conceptId: true,
      sortOrder: true,
      examCategories: {
        select: { examCategory: { select: { code: true, sortOrder: true } } },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  const byCode = new Map<string, ExamQuestionPick[]>();
  for (const question of questions) {
    const codes = [...question.examCategories]
      .map((join) => join.examCategory)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const primary = codes[0]?.code;
    if (!primary) continue;
    const list = byCode.get(primary) ?? [];
    list.push({
      id: question.id,
      conceptId: question.conceptId,
      primaryCategoryCode: primary,
    });
    byCode.set(primary, list);
  }

  const inventory: Record<string, number> = {};
  for (const [code, list] of byCode) {
    inventory[code] = list.length;
  }

  const quotas = allocateExamSeats(inventory);
  const picks: ExamQuestionPick[] = [];
  const used = new Set<string>();

  for (const quota of quotas) {
    if (quota.seats <= 0) continue;
    const pool = byCode.get(quota.code) ?? [];
    let taken = 0;
    for (const question of pool) {
      if (taken >= quota.seats) break;
      if (used.has(question.id)) continue;
      used.add(question.id);
      picks.push(question);
      taken += 1;
    }
  }

  return { picks, quotas };
}
