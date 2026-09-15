export type MathField = {
  key: string;
  label: string;
  /** dollar | percent | number | years */
  unit: "dollar" | "percent" | "number" | "years";
};

export type MathStep = {
  label: string;
  expression: string;
  value: number;
};

export type MathSolveResult = {
  answerKey: string;
  answerLabel: string;
  answer: number;
  unit: MathField["unit"];
  steps: MathStep[];
};

export type MathTemplate = {
  id: string;
  title: string;
  summary: string;
  inputs: MathField[];
  /** Deterministic formula description shown before solve */
  formula: string;
  solve: (inputs: Record<string, number>) => MathSolveResult;
};

export type MathErrorKind =
  | "none"
  | "wrong_decimal"
  | "swapped_inputs"
  | "wrong_operation"
  | "off_by_rate"
  | "unknown";
