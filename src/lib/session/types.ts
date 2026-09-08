export const SESSION_ITEM_KINDS = [
  "review",
  "repair",
  "learn",
  "teachback",
  "practice",
  "recall",
] as const;

export type SessionItemKind = (typeof SESSION_ITEM_KINDS)[number];

export type SessionItemDraft = {
  sortOrder: number;
  kind: SessionItemKind;
  reasonCodes: string[];
  conceptId?: string;
  assetId?: string;
  questionId?: string;
};

export type SessionDraft = {
  objective: string;
  targetMinutes: number;
  plannerVersion: string;
  items: SessionItemDraft[];
};
