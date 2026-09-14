import { describe, expect, it } from "vitest";
import {
  PHASE5_CH2_QUESTIONS,
} from "@/lib/questions/chapter2";
import {
  citationsForQuestion,
  pairKeyForQuestion,
} from "@/lib/questions/catalog";
import { CHAPTER_2_CONFUSION_PAIRS, canonicalPairKey } from "@/lib/knowledge";

describe("Phase 5 Chapter 2 questions", () => {
  it("gives every question citations and exactly one correct option", () => {
    expect(PHASE5_CH2_QUESTIONS.length).toBeGreaterThan(0);
    for (const question of PHASE5_CH2_QUESTIONS) {
      expect(question.chapterNumber).toBe(2);
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
      const citations = citationsForQuestion(question);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.pdfPage > 0)).toBe(true);
    }
  });

  it("maps antitrust pair to exam category IX and others to IV", () => {
    for (const question of PHASE5_CH2_QUESTIONS) {
      if (question.slug === "ch2-q-price-fixing-vs-group-boycott") {
        expect(question.examCategoryCodes).toEqual(["IX"]);
      } else {
        expect(question.examCategoryCodes).toEqual(["IV"]);
      }
    }
  });

  it("only uses active Chapter 2 confusion pairs", () => {
    const activeKeys = new Set(
      CHAPTER_2_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const question of PHASE5_CH2_QUESTIONS) {
      const key = pairKeyForQuestion(question);
      expect(key).toBeTruthy();
      expect(activeKeys.has(key!)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const text = PHASE5_CH2_QUESTIONS.map(
      (question) =>
        `${question.stem} ${question.options.map((option) => option.body).join(" ")} ${question.remediationWhyMissed} ${question.remediationDistinction}`,
    ).join(" ");
    expect(text).not.toMatch(/wis\.?\s*stat/i);
    expect(text).not.toMatch(/\$\d/);
  });
});
