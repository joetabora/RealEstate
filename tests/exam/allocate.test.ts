import { describe, expect, it } from "vitest";
import { allocateExamSeats } from "@/lib/exam/allocate";
import { examTargetMinutes, SALESPERSON_EXAM_ITEM_TOTAL } from "@/lib/exam/types";

describe("allocateExamSeats", () => {
  it("never exceeds inventory and respects the 140 cap when stock is full", () => {
    const inventory: Record<string, number> = {
      I: 14,
      II: 5,
      III: 20,
      IV: 32,
      V: 13,
      VI: 22,
      VII: 14,
      VIII: 6,
      IX: 2,
      X: 12,
    };
    const quotas = allocateExamSeats(inventory);
    const seats = quotas.reduce((sum, row) => sum + row.seats, 0);
    expect(seats).toBe(SALESPERSON_EXAM_ITEM_TOTAL);
    for (const row of quotas) {
      expect(row.seats).toBeLessThanOrEqual(row.available);
      expect(row.seats).toBe(row.blueprintWeight);
    }
  });

  it("scales down when inventory is short, still preferring heavy categories", () => {
    const inventory: Record<string, number> = {
      I: 2,
      II: 1,
      III: 3,
      IV: 10,
      V: 2,
      VI: 4,
      VII: 2,
      VIII: 1,
      IX: 1,
      X: 2,
    };
    const quotas = allocateExamSeats(inventory);
    const seats = quotas.reduce((sum, row) => sum + row.seats, 0);
    const available = Object.values(inventory).reduce((a, b) => a + b, 0);
    expect(seats).toBe(available);
    expect(quotas.find((row) => row.code === "IV")?.seats ?? 0).toBeGreaterThanOrEqual(
      quotas.find((row) => row.code === "IX")?.seats ?? 0,
    );
    for (const row of quotas) {
      expect(row.seats).toBeLessThanOrEqual(row.available);
    }
  });
});

describe("examTargetMinutes", () => {
  it("uses 90 seconds per item", () => {
    expect(examTargetMinutes(140)).toBe(210);
    expect(examTargetMinutes(40)).toBe(60);
  });
});
