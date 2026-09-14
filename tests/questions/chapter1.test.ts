import { describe, expect, it } from "vitest";
import { PHASE5_CH1_QUESTIONS, citationsForQuestion, pairKeyForQuestion } from "@/lib/questions/chapter1";
import { CHAPTER_1_CONFUSION_PAIRS, canonicalPairKey } from "@/lib/knowledge";

describe("Phase 5 Chapter 1 questions", () => {
  it("gives every question citations and exactly one correct option", () => {
    expect(PHASE5_CH1_QUESTIONS.length).toBeGreaterThan(0);
    for (const question of PHASE5_CH1_QUESTIONS) {
      expect(question.chapterNumber).toBe(1);
      expect(question.examCategoryCodes).toEqual(["IV"]);
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
      const citations = citationsForQuestion(question);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.pdfPage > 0)).toBe(true);
      expect(question.remediationWhyMissed.length).toBeGreaterThan(0);
      expect(question.remediationDistinction.length).toBeGreaterThan(0);
    }
  });

  it("only uses active Chapter 1 confusion pairs", () => {
    const activeKeys = new Set(
      CHAPTER_1_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const question of PHASE5_CH1_QUESTIONS) {
      const key = pairKeyForQuestion(question);
      expect(key).toBeTruthy();
      expect(activeKeys.has(key!)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const text = PHASE5_CH1_QUESTIONS.map(
      (question) =>
        `${question.stem} ${question.options.map((option) => option.body).join(" ")} ${question.remediationWhyMissed} ${question.remediationDistinction}`,
    ).join(" ");
    expect(text).not.toMatch(/wis\.?\s*stat/i);
    expect(text).not.toMatch(/\$\d/);
  });
});
