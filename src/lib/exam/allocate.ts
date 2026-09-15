import {
  SALESPERSON_EXAM_CATEGORIES,
  SALESPERSON_EXAM_ITEM_TOTAL,
} from "@/lib/blueprint";
import type { ExamCategoryQuota } from "./types";

/**
 * Allocate seats by blueprint weight using largest remainder, never exceeding
 * inventory per category. Target size is min(140, total available).
 */
export function allocateExamSeats(
  inventoryByCode: Readonly<Record<string, number>>,
  targetTotal: number = SALESPERSON_EXAM_ITEM_TOTAL,
): ExamCategoryQuota[] {
  const rows = SALESPERSON_EXAM_CATEGORIES.map((category) => {
    const available = Math.max(0, Math.floor(inventoryByCode[category.code] ?? 0));
    return {
      code: category.code,
      name: category.name,
      blueprintWeight: category.weight,
      available,
      seats: 0,
    };
  });

  const availableTotal = rows.reduce((sum, row) => sum + row.available, 0);
  let remaining = Math.min(Math.max(0, Math.floor(targetTotal)), availableTotal);
  if (remaining === 0) {
    return rows;
  }

  const weightTotal = SALESPERSON_EXAM_ITEM_TOTAL;
  const ideals = rows.map((row) => ({
    code: row.code,
    ideal: (row.blueprintWeight / weightTotal) * remaining,
  }));

  for (const row of rows) {
    const ideal = ideals.find((entry) => entry.code === row.code)?.ideal ?? 0;
    const floor = Math.min(row.available, Math.floor(ideal));
    row.seats = floor;
    remaining -= floor;
  }

  const remainders = ideals
    .map((entry) => {
      const row = rows.find((r) => r.code === entry.code)!;
      return {
        code: entry.code,
        frac: entry.ideal - Math.floor(entry.ideal),
        room: row.available - row.seats,
      };
    })
    .filter((entry) => entry.room > 0)
    .sort((a, b) => {
      if (b.frac !== a.frac) return b.frac - a.frac;
      return a.code.localeCompare(b.code);
    });

  for (const entry of remainders) {
    if (remaining <= 0) break;
    const row = rows.find((r) => r.code === entry.code)!;
    row.seats += 1;
    remaining -= 1;
  }

  // Spill leftover seats into categories that still have inventory (weight order).
  while (remaining > 0) {
    const candidates = [...rows]
      .filter((row) => row.seats < row.available)
      .sort((a, b) => {
        if (b.blueprintWeight !== a.blueprintWeight) {
          return b.blueprintWeight - a.blueprintWeight;
        }
        return a.code.localeCompare(b.code);
      });
    if (candidates.length === 0) break;
    candidates[0]!.seats += 1;
    remaining -= 1;
  }

  return rows;
}
