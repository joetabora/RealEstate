import { percentToRate, roundMoney, roundRatio } from "./money";
import type { MathSolveResult, MathTemplate } from "./types";

function requireFinite(inputs: Record<string, number>, keys: string[]) {
  for (const key of keys) {
    const value = inputs[key];
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error(`Missing or invalid input: ${key}`);
    }
  }
}

export const COMMISSION_GROSS: MathTemplate = {
  id: "commission-gross",
  title: "Gross commission",
  summary: "Sale price × commission rate = total commission.",
  formula: "commission = salePrice × (ratePercent ÷ 100)",
  inputs: [
    { key: "salePrice", label: "Sale price", unit: "dollar" },
    { key: "ratePercent", label: "Commission rate", unit: "percent" },
  ],
  solve(inputs): MathSolveResult {
    requireFinite(inputs, ["salePrice", "ratePercent"]);
    const salePrice = inputs.salePrice!;
    const ratePercent = inputs.ratePercent!;
    const rate = percentToRate(ratePercent);
    const commission = roundMoney(salePrice * rate);
    return {
      answerKey: "commission",
      answerLabel: "Gross commission",
      answer: commission,
      unit: "dollar",
      steps: [
        {
          label: "Convert percent to decimal",
          expression: `${ratePercent}% ÷ 100`,
          value: roundRatio(rate, 6),
        },
        {
          label: "Multiply sale price by rate",
          expression: `${salePrice} × ${roundRatio(rate, 6)}`,
          value: commission,
        },
      ],
    };
  },
};

export const SELLER_NET_AFTER_COMMISSION: MathTemplate = {
  id: "seller-net-after-commission",
  title: "Seller net after commission",
  summary: "Sale price minus gross commission.",
  formula: "net = salePrice − (salePrice × ratePercent ÷ 100)",
  inputs: [
    { key: "salePrice", label: "Sale price", unit: "dollar" },
    { key: "ratePercent", label: "Commission rate", unit: "percent" },
  ],
  solve(inputs): MathSolveResult {
    requireFinite(inputs, ["salePrice", "ratePercent"]);
    const salePrice = inputs.salePrice!;
    const ratePercent = inputs.ratePercent!;
    const commission = roundMoney(salePrice * percentToRate(ratePercent));
    const net = roundMoney(salePrice - commission);
    return {
      answerKey: "net",
      answerLabel: "Seller net",
      answer: net,
      unit: "dollar",
      steps: [
        {
          label: "Gross commission",
          expression: `${salePrice} × ${ratePercent}%`,
          value: commission,
        },
        {
          label: "Subtract from sale price",
          expression: `${salePrice} − ${commission}`,
          value: net,
        },
      ],
    };
  },
};

export const LTV_RATIO: MathTemplate = {
  id: "ltv-ratio",
  title: "Loan-to-value (LTV)",
  summary: "Loan amount ÷ property value = LTV (as a percent).",
  formula: "ltvPercent = (loanAmount ÷ propertyValue) × 100",
  inputs: [
    { key: "loanAmount", label: "Loan amount", unit: "dollar" },
    { key: "propertyValue", label: "Property value", unit: "dollar" },
  ],
  solve(inputs): MathSolveResult {
    requireFinite(inputs, ["loanAmount", "propertyValue"]);
    const loanAmount = inputs.loanAmount!;
    const propertyValue = inputs.propertyValue!;
    if (propertyValue === 0) {
      throw new Error("Property value cannot be zero.");
    }
    const ratio = loanAmount / propertyValue;
    const ltvPercent = roundRatio(ratio * 100, 4);
    return {
      answerKey: "ltvPercent",
      answerLabel: "LTV",
      answer: ltvPercent,
      unit: "percent",
      steps: [
        {
          label: "Divide loan by value",
          expression: `${loanAmount} ÷ ${propertyValue}`,
          value: roundRatio(ratio, 6),
        },
        {
          label: "Convert to percent",
          expression: `${roundRatio(ratio, 6)} × 100`,
          value: ltvPercent,
        },
      ],
    };
  },
};

export const DISCOUNT_POINTS: MathTemplate = {
  id: "discount-points",
  title: "Discount points cost",
  summary: "One point = 1% of the loan. Cost = loan × points ÷ 100.",
  formula: "pointsCost = loanAmount × (points ÷ 100)",
  inputs: [
    { key: "loanAmount", label: "Loan amount", unit: "dollar" },
    { key: "points", label: "Points", unit: "number" },
  ],
  solve(inputs): MathSolveResult {
    requireFinite(inputs, ["loanAmount", "points"]);
    const loanAmount = inputs.loanAmount!;
    const points = inputs.points!;
    const cost = roundMoney(loanAmount * (points / 100));
    return {
      answerKey: "pointsCost",
      answerLabel: "Points cost",
      answer: cost,
      unit: "dollar",
      steps: [
        {
          label: "Convert points to a decimal of the loan",
          expression: `${points} ÷ 100`,
          value: roundRatio(points / 100, 6),
        },
        {
          label: "Multiply by loan amount",
          expression: `${loanAmount} × ${roundRatio(points / 100, 6)}`,
          value: cost,
        },
      ],
    };
  },
};

export const SIMPLE_INTEREST: MathTemplate = {
  id: "simple-interest",
  title: "Simple interest",
  summary: "Interest = principal × rate × time (years).",
  formula: "interest = principal × (ratePercent ÷ 100) × years",
  inputs: [
    { key: "principal", label: "Principal", unit: "dollar" },
    { key: "ratePercent", label: "Annual rate", unit: "percent" },
    { key: "years", label: "Time", unit: "years" },
  ],
  solve(inputs): MathSolveResult {
    requireFinite(inputs, ["principal", "ratePercent", "years"]);
    const principal = inputs.principal!;
    const ratePercent = inputs.ratePercent!;
    const years = inputs.years!;
    const rate = percentToRate(ratePercent);
    const interest = roundMoney(principal * rate * years);
    return {
      answerKey: "interest",
      answerLabel: "Simple interest",
      answer: interest,
      unit: "dollar",
      steps: [
        {
          label: "Convert rate to decimal",
          expression: `${ratePercent}% ÷ 100`,
          value: roundRatio(rate, 6),
        },
        {
          label: "Principal × rate × time",
          expression: `${principal} × ${roundRatio(rate, 6)} × ${years}`,
          value: interest,
        },
      ],
    };
  },
};

export const PHASE8_MATH_TEMPLATES: readonly MathTemplate[] = [
  COMMISSION_GROSS,
  SELLER_NET_AFTER_COMMISSION,
  LTV_RATIO,
  DISCOUNT_POINTS,
  SIMPLE_INTEREST,
];

export function mathTemplateById(id: string): MathTemplate | null {
  return PHASE8_MATH_TEMPLATES.find((row) => row.id === id) ?? null;
}
