export {
  PHASE8_MATH_TEMPLATES,
  mathTemplateById,
  COMMISSION_GROSS,
  SELLER_NET_AFTER_COMMISSION,
  LTV_RATIO,
  DISCOUNT_POINTS,
  SIMPLE_INTEREST,
} from "./catalog";
export { classifyMathMiss, mathErrorMessage } from "./errors";
export { nearlyEqual, percentToRate, rateToPercent, roundMoney, roundRatio } from "./money";
export type {
  MathErrorKind,
  MathField,
  MathSolveResult,
  MathStep,
  MathTemplate,
} from "./types";
