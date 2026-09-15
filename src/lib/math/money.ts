/** Money and percent helpers — deterministic rounding only. */

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function roundRatio(value: number, places = 6): number {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function percentToRate(percent: number): number {
  return percent / 100;
}

export function rateToPercent(rate: number): number {
  return roundRatio(rate * 100, 4);
}

/** Compare learner answer to key within a tolerance (default 1 cent for dollars). */
export function nearlyEqual(a: number, b: number, tolerance = 0.01): boolean {
  return Math.abs(a - b) <= tolerance;
}
