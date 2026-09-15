export const TUTOR_MODES = ["off", "mock", "live"] as const;
export type TutorMode = (typeof TUTOR_MODES)[number];

export type TutorCitation = {
  label: string;
  href?: string;
};

export type TutorChatMessage = {
  id: string;
  role: "user" | "assistant";
  body: string;
  provider: string;
  citations: TutorCitation[];
  createdAt: string;
};

export type TutorStatus = {
  databaseConnected: boolean;
  mode: TutorMode;
  liveConfigured: boolean;
  liveAvailable: boolean;
  model: string;
  dailySpendCapUsd: number;
  spentTodayUsd: number;
  remainingTodayUsd: number;
  threadId: string | null;
  messages: TutorChatMessage[];
};

export function isTutorMode(value: string): value is TutorMode {
  return (TUTOR_MODES as readonly string[]).includes(value);
}
