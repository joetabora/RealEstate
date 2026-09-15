/**
 * Tutor is an optional overlay. Core study must work with this entirely off.
 * Live mode requires OPENAI_API_KEY. Mock never invents Wisconsin facts.
 */

export type TutorEnvConfig = {
  liveConfigured: boolean;
  apiKey: string | null;
  model: string;
  dailySpendCapUsd: number;
  /** Rough USD per 1K tokens for soft spend estimates (live only). */
  usdPer1kTokens: number;
};

export function getTutorEnvConfig(): TutorEnvConfig {
  const apiKey = process.env.OPENAI_API_KEY?.trim() || null;
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const dailySpendCapUsd = parseFloat(process.env.TUTOR_DAILY_SPEND_CAP_USD ?? "1");
  const usdPer1kTokens = parseFloat(process.env.TUTOR_USD_PER_1K_TOKENS ?? "0.002");

  return {
    liveConfigured: Boolean(apiKey),
    apiKey,
    model,
    dailySpendCapUsd: Number.isFinite(dailySpendCapUsd) ? Math.max(0, dailySpendCapUsd) : 1,
    usdPer1kTokens: Number.isFinite(usdPer1kTokens) ? Math.max(0, usdPer1kTokens) : 0.002,
  };
}

export function utcDayKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}
