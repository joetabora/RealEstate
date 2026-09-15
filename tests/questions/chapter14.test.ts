import { describe, expect, it } from "vitest";
import { PHASE5_CH14_QUESTIONS } from "@/lib/questions/chapter14";
import {
  citationsForQuestion,
  pairKeyForQuestion,
} from "@/lib/questions/catalog";
import { CHAPTER_14_CONFUSION_PAIRS, canonicalPairKey } from "@/lib/knowledge";

describe("Phase 5 Chapter 14 questions", () => {
  it("covers every Chapter 14 confusion pair with citations and one correct option", () => {
    expect(PHASE5_CH14_QUESTIONS).toHaveLength(CHAPTER_14_CONFUSION_PAIRS.length);
    for (const question of PHASE5_CH14_QUESTIONS) {
      expect(question.chapterNumber).toBe(14);
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
      expect(question.examCategoryCodes).toEqual(["X"]);
      const citations = citationsForQuestion(question);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.pdfPage > 0)).toBe(true);
    }
  });

  it("only uses active Chapter 14 confusion pairs", () => {
    const activeKeys = new Set(
      CHAPTER_14_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const question of PHASE5_CH14_QUESTIONS) {
      const key = pairKeyForQuestion(question);
      expect(key).toBeTruthy();
      expect(activeKeys.has(key!)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const text = PHASE5_CH14_QUESTIONS.map(
      (question) =>
        `${question.stem} ${question.options.map((option) => option.body).join(" ")} ${question.remediationWhyMissed} ${question.remediationDistinction}`,
    ).join(" ");
    expect(text).not.toMatch(/wis\.?\s*stat/i);
    expect(text).not.toMatch(/\$\d/);
  });
});
