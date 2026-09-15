import { describe, expect, it } from "vitest";
import { PHASE5_CH10_QUESTIONS } from "@/lib/questions/chapter10";
import {
  citationsForQuestion,
  pairKeyForQuestion,
} from "@/lib/questions/catalog";
import { CHAPTER_10_CONFUSION_PAIRS, canonicalPairKey } from "@/lib/knowledge";

const EXPECTED_EXAM_CODES: Record<string, readonly string[]> = {
  "ch10-q-wb11-vs-wb14-offer": ["VI"],
  "ch10-q-wb11-vs-wb13-offer": ["VI"],
  "ch10-q-financing-commitment-vs-not-contingent": ["VI"],
  "ch10-q-bump-clause-vs-secondary-offer": ["VI"],
  "ch10-q-inspection-vs-appraisal-contingency": ["VI"],
  "ch10-q-drafting-vs-presentation-of-offers": ["IV", "VI"],
};

describe("Phase 5 Chapter 10 questions", () => {
  it("covers every Chapter 10 confusion pair with citations and one correct option", () => {
    expect(PHASE5_CH10_QUESTIONS).toHaveLength(CHAPTER_10_CONFUSION_PAIRS.length);
    for (const question of PHASE5_CH10_QUESTIONS) {
      expect(question.chapterNumber).toBe(10);
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
      const citations = citationsForQuestion(question);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.pdfPage > 0)).toBe(true);
    }
  });

  it("maps each question to the expected exam categories", () => {
    for (const question of PHASE5_CH10_QUESTIONS) {
      expect(question.examCategoryCodes).toEqual(EXPECTED_EXAM_CODES[question.slug]);
    }
  });

  it("only uses active Chapter 10 confusion pairs", () => {
    const activeKeys = new Set(
      CHAPTER_10_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const question of PHASE5_CH10_QUESTIONS) {
      const key = pairKeyForQuestion(question);
      expect(key).toBeTruthy();
      expect(activeKeys.has(key!)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const text = PHASE5_CH10_QUESTIONS.map(
      (question) =>
        `${question.stem} ${question.options.map((option) => option.body).join(" ")} ${question.remediationWhyMissed} ${question.remediationDistinction}`,
    ).join(" ");
    expect(text).not.toMatch(/wis\.?\s*stat/i);
    expect(text).not.toMatch(/\$\d/);
  });
});
