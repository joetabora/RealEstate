import { describe, expect, it } from "vitest";
import {
  lifecycleAfterPassingGate,
  nextGateForLifecycle,
  runAssetGate,
  runQuestionGate,
} from "@/lib/validation/gates";

const solidQuestion = {
  stem: "Chapter 1 lists Client and Customer as separate headings. Which statement matches?",
  informationClass: "course_sourced",
  remediationWhyMissed: "That choice collapses Client and Customer.",
  remediationDistinction: "Client and customer are separate terms.",
  citationCount: 2,
  options: [
    { key: "A", body: "They are interchangeable.", isCorrect: false },
    { key: "B", body: "They are separate terms.", isCorrect: true },
    { key: "C", body: "Customer always signed a buyer agency agreement.", isCorrect: false },
    { key: "D", body: "Client means only the listing firm.", isCorrect: false },
  ],
};

describe("content gates", () => {
  it("advances lifecycle markers through the pipeline", () => {
    expect(nextGateForLifecycle("generated")).toBe("source_check");
    expect(lifecycleAfterPassingGate("source_check")).toBe("source_check");
    expect(nextGateForLifecycle("ambiguity_check")).toBe("wi_fact_check");
    expect(lifecycleAfterPassingGate("wi_fact_check")).toBe("validated");
  });

  it("passes a well-formed cited question through every gate", () => {
    for (const gate of [
      "source_check",
      "structural_check",
      "answer_check",
      "ambiguity_check",
      "wi_fact_check",
    ] as const) {
      const result = runQuestionGate(gate, solidQuestion);
      expect(result.passed, gate).toBe(true);
    }
  });

  it("fails wi_fact_check when WI-like claims lack citations", () => {
    const result = runQuestionGate("wi_fact_check", {
      ...solidQuestion,
      citationCount: 0,
      stem: "What is the Wisconsin transfer fee under Wis. Stat.?",
      informationClass: "general_explanation",
    });
    expect(result.passed).toBe(false);
    expect(result.reasons.join(" ")).toMatch(/citation/i);
  });

  it("fails answer_check without exactly one correct option", () => {
    const result = runQuestionGate("answer_check", {
      ...solidQuestion,
      options: solidQuestion.options.map((o) => ({ ...o, isCorrect: false })),
    });
    expect(result.passed).toBe(false);
  });

  it("blocks needs_verification assets at wi_fact_check", () => {
    const result = runAssetGate("wi_fact_check", {
      title: "Draft",
      body: "A long enough general explanation without statute claims here.",
      kind: "explanation",
      informationClass: "needs_verification",
      citationCount: 0,
    });
    expect(result.passed).toBe(false);
  });
});
