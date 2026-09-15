export type GenerationMode = "mock" | "live";

export type DraftOption = {
  key: "A" | "B" | "C" | "D";
  body: string;
  isCorrect: boolean;
};

/** In-memory draft before persistence. Citations are attached from DB concepts only. */
export type QuestionDraft = {
  stem: string;
  options: DraftOption[];
  remediationWhyMissed: string;
  remediationDistinction: string;
  /** Always general_explanation or course_sourced — never invents WI facts. */
  informationClass: "course_sourced" | "general_explanation";
  provider: GenerationMode;
};

export type DraftTarget = {
  pairId: string;
  canonicalKey: string;
  reason: string;
  chapterNumber: number;
  conceptA: {
    id: string;
    slug: string;
    name: string;
    examCategoryCodes: string[];
  };
  conceptB: {
    id: string;
    slug: string;
    name: string;
    examCategoryCodes: string[];
  };
  existingQuestionCount: number;
  existingDraftCount: number;
};

export type GenerationResult = {
  mode: GenerationMode;
  created: Array<{
    id: string;
    slug: string;
    pairKey: string;
    lifecycle: string;
  }>;
  skipped: string[];
  tokenEstimate: number;
};
