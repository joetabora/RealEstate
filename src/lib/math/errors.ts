import { nearlyEqual } from "./money";
import type { MathErrorKind, MathSolveResult } from "./types";

/**
 * Classify a wrong numeric attempt without inventing course facts.
 * Used for practice feedback only.
 */
export function classifyMathMiss(input: {
  expected: MathSolveResult;
  attempt: number;
  rawInputs: Record<string, number>;
}): MathErrorKind {
  const { expected, attempt, rawInputs } = input;
  if (nearlyEqual(attempt, expected.answer, expected.unit === "percent" ? 0.05 : 0.01)) {
    return "none";
  }

  // Off by factor of 100 (percent/decimal mix-up)
  if (
    nearlyEqual(attempt, expected.answer * 100, 0.05) ||
    nearlyEqual(attempt, expected.answer / 100, 0.05)
  ) {
    return "wrong_decimal";
  }

  const values = Object.values(rawInputs).filter((value) => Number.isFinite(value));
  if (values.length >= 2) {
    const [a, b] = values;
    if (a && b) {
      if (nearlyEqual(attempt, a + b) || nearlyEqual(attempt, Math.abs(a - b))) {
        return "wrong_operation";
      }
      if (nearlyEqual(attempt, a / b) || nearlyEqual(attempt, b / a)) {
        return "swapped_inputs";
      }
    }
  }

  return "unknown";
}

export function mathErrorMessage(kind: MathErrorKind): string {
  switch (kind) {
    case "none":
      return "Correct.";
    case "wrong_decimal":
      return "Check whether you used a percent (6) or a decimal (0.06).";
    case "swapped_inputs":
      return "Check which number is the loan/price numerator vs denominator.";
    case "wrong_operation":
      return "Check whether you should multiply, divide, or subtract for this template.";
    case "off_by_rate":
      return "Recheck the rate conversion before multiplying.";
    default:
      return "Not a match. Re-read the formula steps, then try again.";
  }
}
