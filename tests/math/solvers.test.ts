import { describe, expect, it } from "vitest";
import {
  COMMISSION_GROSS,
  DISCOUNT_POINTS,
  LTV_RATIO,
  SIMPLE_INTEREST,
  SELLER_NET_AFTER_COMMISSION,
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
