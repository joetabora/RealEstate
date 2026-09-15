import { describe, expect, it } from "vitest";
import {
  BANKER_PRORATION,
  COMMISSION_GROSS,
  DAILY_PRORATION,
  DISCOUNT_POINTS,
  DOWN_PAYMENT,
  LOAN_FROM_LTV,
  LTV_RATIO,
  PHASE8_MATH_TEMPLATES,
  SIMPLE_INTEREST,
  SELLER_NET_AFTER_COMMISSION,
  TRANSFER_FEE,
  classifyMathMiss,
  nearlyEqual,
} from "@/lib/math";

describe("math solvers", () => {
  it("computes gross commission", () => {
    const result = COMMISSION_GROSS.solve({ salePrice: 250_000, ratePercent: 6 });
    expect(result.answer).toBe(15_000);
  });

  it("computes seller net after commission", () => {
    const result = SELLER_NET_AFTER_COMMISSION.solve({
      salePrice: 250_000,
      ratePercent: 6,
    });
    expect(result.answer).toBe(235_000);
  });

  it("computes LTV percent", () => {
    const result = LTV_RATIO.solve({ loanAmount: 160_000, propertyValue: 200_000 });
    expect(result.answer).toBe(80);
  });

  it("computes loan from LTV", () => {
    const result = LOAN_FROM_LTV.solve({ propertyValue: 200_000, ltvPercent: 80 });
    expect(result.answer).toBe(160_000);
  });

  it("computes down payment", () => {
    const result = DOWN_PAYMENT.solve({ purchasePrice: 200_000, loanAmount: 160_000 });
    expect(result.answer).toBe(40_000);
  });

  it("computes discount points cost", () => {
    const result = DISCOUNT_POINTS.solve({ loanAmount: 200_000, points: 2 });
    expect(result.answer).toBe(4_000);
  });

  it("computes simple interest", () => {
    const result = SIMPLE_INTEREST.solve({
      principal: 10_000,
      ratePercent: 5,
      years: 2,
    });
    expect(result.answer).toBe(1_000);
  });

  it("prorates on a 365-day year", () => {
    const result = DAILY_PRORATION.solve({ annualAmount: 3_650, days: 10 });
    expect(result.answer).toBe(100);
  });

  it("prorates on a 360-day banker's year", () => {
    const result = BANKER_PRORATION.solve({ annualAmount: 3_600, days: 30 });
    expect(result.answer).toBe(300);
  });

  it("computes transfer fee from a supplied rate (no hardcoded WI schedule)", () => {
    const result = TRANSFER_FEE.solve({ salePrice: 100_000, ratePercent: 0.3 });
    expect(result.answer).toBe(300);
    expect(TRANSFER_FEE.summary.toLowerCase()).toContain("does not invent");
  });

  it("lists the Phase 8 starter catalog", () => {
    expect(PHASE8_MATH_TEMPLATES.length).toBeGreaterThanOrEqual(10);
  });
});

describe("math miss classification", () => {
  it("detects percent/decimal mix-ups", () => {
    const expected = COMMISSION_GROSS.solve({ salePrice: 100_000, ratePercent: 6 });
    expect(
      classifyMathMiss({
        expected,
        attempt: expected.answer / 100,
        rawInputs: { salePrice: 100_000, ratePercent: 6 },
      }),
    ).toBe("wrong_decimal");
  });

  it("accepts near-equal money answers", () => {
    expect(nearlyEqual(15_000, 15_000.004)).toBe(true);
  });
});
