import { describe, expect, it } from "vitest";
import { buildMockDraft } from "@/lib/generation/mock";
import { runQuestionGate } from "@/lib/validation/gates";
import type { DraftTarget } from "@/lib/generation/types";

const sampleTarget: DraftTarget = {
  pairId: "pair-1",
  canonicalKey: "client|customer",
  reason: "Client and customer are separate course headings, not interchangeable labels.",
  chapterNumber: 1,
  conceptA: {
    id: "a",
    slug: "client",
    name: "Client",
    examCategoryCodes: ["IV"],
  },
  conceptB: {
    id: "b",
    slug: "customer",
    name: "Customer",
    examCategoryCodes: ["IV"],
  },
  existingQuestionCount: 1,
  existingDraftCount: 0,
};

describe("Phase 13 mock draft generation", () => {
  it("builds a four-option draft with exactly one correct answer", () => {
    const draft = buildMockDraft(sampleTarget);
    expect(draft.provider).toBe("mock");
    expect(draft.stem.length).toBeGreaterThan(12);
    expect(draft.options).toHaveLength(4);
    expect(draft.options.filter((o) => o.isCorrect)).toHaveLength(1);
    expect(draft.informationClass).toBe("course_sourced");
  });

  it("produces a draft that can pass structural and answer gates", () => {
    const draft = buildMockDraft(sampleTarget);
    const input = {
      stem: draft.stem,
      informationClass: draft.informationClass,
      remediationWhyMissed: draft.remediationWhyMissed,
      remediationDistinction: draft.remediationDistinction,
      citationCount: 2,
      options: draft.options,
    };
    expect(runQuestionGate("structural_check", input).passed).toBe(true);
    expect(runQuestionGate("answer_check", input).passed).toBe(true);
    expect(runQuestionGate("ambiguity_check", input).passed).toBe(true);
    expect(runQuestionGate("source_check", input).passed).toBe(true);
    expect(runQuestionGate("wi_fact_check", input).passed).toBe(true);
  });

  it("avoids inventing Wisconsin statutory language in the mock stem", () => {
    const draft = buildMockDraft(sampleTarget);
    expect(draft.stem.toLowerCase()).not.toMatch(/wis\.?\s*stat|transfer fee|§/);
  });
});
