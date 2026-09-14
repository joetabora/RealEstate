import { describe, expect, it } from "vitest";
import { PHASE5_CH6_QUESTIONS } from "@/lib/questions/chapter6";
import {
  citationsForQuestion,
  pairKeyForQuestion,
} from "@/lib/questions/catalog";
import { CHAPTER_6_CONFUSION_PAIRS, canonicalPairKey } from "@/lib/knowledge";

describe("Phase 5 Chapter 6 questions", () => {
  it("covers every Chapter 6 confusion pair with citations and one correct option", () => {
    expect(PHASE5_CH6_QUESTIONS).toHaveLength(CHAPTER_6_CONFUSION_PAIRS.length);
    for (const question of PHASE5_CH6_QUESTIONS) {
      expect(question.chapterNumber).toBe(6);
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
      expect(question.examCategoryCodes).toEqual(["III"]);
      const citations = citationsForQuestion(question);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.pdfPage > 0)).toBe(true);
    }
  });

  it("only uses active Chapter 6 confusion pairs", () => {
    const activeKeys = new Set(
      CHAPTER_6_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const question of PHASE5_CH6_QUESTIONS) {
      const key = pairKeyForQuestion(question);
      expect(key).toBeTruthy();
      expect(activeKeys.has(key!)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const text = PHASE5_CH6_QUESTIONS.map(
      (question) =>
        `${question.stem} ${question.options.map((option) => option.body).join(" ")} ${question.remediationWhyMissed} ${question.remediationDistinction}`,
    ).join(" ");
    expect(text).not.toMatch(/wis\.?\s*stat/i);
    expect(text).not.toMatch(/\$\d/);
  });
});
