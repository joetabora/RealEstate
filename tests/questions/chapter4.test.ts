import { describe, expect, it } from "vitest";
import { PHASE5_CH4_QUESTIONS } from "@/lib/questions/chapter4";
import {
  citationsForQuestion,
  pairKeyForQuestion,
} from "@/lib/questions/catalog";
import { CHAPTER_4_CONFUSION_PAIRS, canonicalPairKey } from "@/lib/knowledge";

const EXPECTED_EXAM_CODES: Record<string, readonly string[]> = {
  "ch4-q-owner-vs-licensee-disclosure": ["V", "VI"],
  "ch4-q-seller-completion-vs-amending-recr": ["V", "VI"],
  "ch4-q-as-is-sales-vs-disclosure-by-owners": ["V", "VI"],
  "ch4-q-buyer-rescission-vs-amending-recr": ["V", "VI"],
  "ch4-q-condo-disclosure-vs-owner-disclosure": ["V", "VI"],
  "ch4-q-executive-summary-vs-condo-documents": ["V", "VI"],
  "ch4-q-lead-based-paint-vs-asbestos": ["V"],
  "ch4-q-radon-vs-mold": ["V"],
};

describe("Phase 5 Chapter 4 questions", () => {
  it("covers every Chapter 4 confusion pair with citations and one correct option", () => {
    expect(PHASE5_CH4_QUESTIONS).toHaveLength(CHAPTER_4_CONFUSION_PAIRS.length);
    for (const question of PHASE5_CH4_QUESTIONS) {
      expect(question.chapterNumber).toBe(4);
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
      const citations = citationsForQuestion(question);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.pdfPage > 0)).toBe(true);
    }
  });

  it("maps each question to the expected exam categories", () => {
    for (const question of PHASE5_CH4_QUESTIONS) {
      expect(question.examCategoryCodes).toEqual(EXPECTED_EXAM_CODES[question.slug]);
    }
  });

  it("only uses active Chapter 4 confusion pairs", () => {
    const activeKeys = new Set(
      CHAPTER_4_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const question of PHASE5_CH4_QUESTIONS) {
      const key = pairKeyForQuestion(question);
      expect(key).toBeTruthy();
      expect(activeKeys.has(key!)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const text = PHASE5_CH4_QUESTIONS.map(
      (question) =>
        `${question.stem} ${question.options.map((option) => option.body).join(" ")} ${question.remediationWhyMissed} ${question.remediationDistinction}`,
    ).join(" ");
    expect(text).not.toMatch(/wis\.?\s*stat/i);
    expect(text).not.toMatch(/\$\d/);
  });
});
