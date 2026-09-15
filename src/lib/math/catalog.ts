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

export const LOAN_FROM_LTV: MathTemplate = {
  id: "loan-from-ltv",
  title: "Loan amount from LTV",
  summary: "Loan = property value × LTV percent.",
  formula: "loanAmount = propertyValue × (ltvPercent ÷ 100)",
  inputs: [
    { key: "propertyValue", label: "Property value", unit: "dollar" },
    { key: "ltvPercent", label: "LTV", unit: "percent" },
  ],
  solve(inputs): MathSolveResult {
    requireFinite(inputs, ["propertyValue", "ltvPercent"]);
    const propertyValue = inputs.propertyValue!;
    const ltvPercent = inputs.ltvPercent!;
    const loanAmount = roundMoney(propertyValue * percentToRate(ltvPercent));
    return {
      answerKey: "loanAmount",
      answerLabel: "Loan amount",
      answer: loanAmount,
      unit: "dollar",
      steps: [
        {
          label: "Convert LTV percent to decimal",
          expression: `${ltvPercent}% ÷ 100`,
          value: roundRatio(percentToRate(ltvPercent), 6),
        },
        {
          label: "Multiply value by LTV",
          expression: `${propertyValue} × ${roundRatio(percentToRate(ltvPercent), 6)}`,
          value: loanAmount,
        },
      ],
    };
  },
};

export const DAILY_PRORATION: MathTemplate = {
  id: "daily-proration",
  title: "Daily proration (365-day)",
  summary: "Share of an annual amount for a given number of days using a 365-day year.",
  formula: "share = annualAmount × days ÷ 365",
  inputs: [
    { key: "annualAmount", label: "Annual amount", unit: "dollar" },
    { key: "days", label: "Days", unit: "number" },
  ],
  solve(inputs): MathSolveResult {
    requireFinite(inputs, ["annualAmount", "days"]);
    const annualAmount = inputs.annualAmount!;
    const days = inputs.days!;
    if (days < 0) {
      throw new Error("Days cannot be negative.");
    }
    const daily = annualAmount / 365;
    const share = roundMoney(annualAmount * (days / 365));
    return {
      answerKey: "share",
      answerLabel: "Prorated share",
      answer: share,
      unit: "dollar",
      steps: [
        {
          label: "Daily rate (365-day year)",
          expression: `${annualAmount} ÷ 365`,
          value: roundRatio(daily, 6),
        },
        {
          label: "Multiply by days",
          expression: `${roundRatio(daily, 6)} × ${days}`,
          value: share,
        },
      ],
    };
  },
};

export const BANKER_PRORATION: MathTemplate = {
  id: "banker-proration",
  title: "Daily proration (360-day)",
  summary: "Banker's year: annual amount × days ÷ 360.",
  formula: "share = annualAmount × days ÷ 360",
  inputs: [
    { key: "annualAmount", label: "Annual amount", unit: "dollar" },
    { key: "days", label: "Days", unit: "number" },
  ],
  solve(inputs): MathSolveResult {
    requireFinite(inputs, ["annualAmount", "days"]);
    const annualAmount = inputs.annualAmount!;
    const days = inputs.days!;
    if (days < 0) {
      throw new Error("Days cannot be negative.");
    }
    const daily = annualAmount / 360;
    const share = roundMoney(annualAmount * (days / 360));
    return {
      answerKey: "share",
      answerLabel: "Prorated share",
      answer: share,
      unit: "dollar",
      steps: [
        {
          label: "Daily rate (360-day year)",
          expression: `${annualAmount} ÷ 360`,
          value: roundRatio(daily, 6),
        },
        {
          label: "Multiply by days",
          expression: `${roundRatio(daily, 6)} × ${days}`,
          value: share,
        },
      ],
    };
  },
};

/**
 * Transfer / conveyance fee as a general formula.
 * Rate is an input — do not hardcode a Wisconsin statutory rate here.
 */
export const TRANSFER_FEE: MathTemplate = {
  id: "transfer-fee",
  title: "Transfer fee (rate input)",
  summary:
    "Sale price × fee rate. Enter the rate from your cited course material — this app does not invent Wisconsin fee schedules.",
  formula: "fee = salePrice × (ratePercent ÷ 100)",
  inputs: [
    { key: "salePrice", label: "Sale / consideration", unit: "dollar" },
    { key: "ratePercent", label: "Fee rate (from citation)", unit: "percent" },
  ],
  solve(inputs): MathSolveResult {
    requireFinite(inputs, ["salePrice", "ratePercent"]);
    const salePrice = inputs.salePrice!;
    const ratePercent = inputs.ratePercent!;
    const fee = roundMoney(salePrice * percentToRate(ratePercent));
    return {
      answerKey: "fee",
      answerLabel: "Transfer fee",
      answer: fee,
      unit: "dollar",
      steps: [
        {
          label: "Convert cited rate to decimal",
          expression: `${ratePercent}% ÷ 100`,
          value: roundRatio(percentToRate(ratePercent), 6),
        },
        {
          label: "Multiply by consideration",
          expression: `${salePrice} × ${roundRatio(percentToRate(ratePercent), 6)}`,
          value: fee,
        },
      ],
    };
  },
};

export const DOWN_PAYMENT: MathTemplate = {
  id: "down-payment",
  title: "Down payment",
  summary: "Purchase price minus loan amount.",
  formula: "downPayment = purchasePrice − loanAmount",
  inputs: [
    { key: "purchasePrice", label: "Purchase price", unit: "dollar" },
    { key: "loanAmount", label: "Loan amount", unit: "dollar" },
  ],
  solve(inputs): MathSolveResult {
    requireFinite(inputs, ["purchasePrice", "loanAmount"]);
    const purchasePrice = inputs.purchasePrice!;
    const loanAmount = inputs.loanAmount!;
    const downPayment = roundMoney(purchasePrice - loanAmount);
    return {
      answerKey: "downPayment",
      answerLabel: "Down payment",
      answer: downPayment,
      unit: "dollar",
      steps: [
        {
          label: "Subtract loan from price",
          expression: `${purchasePrice} − ${loanAmount}`,
          value: downPayment,
        },
      ],
    };
  },
};

export const PHASE8_MATH_TEMPLATES: readonly MathTemplate[] = [
  COMMISSION_GROSS,
  SELLER_NET_AFTER_COMMISSION,
  LTV_RATIO,
  LOAN_FROM_LTV,
  DOWN_PAYMENT,
  DISCOUNT_POINTS,
  SIMPLE_INTEREST,
  DAILY_PRORATION,
  BANKER_PRORATION,
  TRANSFER_FEE,
];

export function mathTemplateById(id: string): MathTemplate | null {
  return PHASE8_MATH_TEMPLATES.find((row) => row.id === id) ?? null;
}
