import { describe, expect, it } from "vitest";
import { PHASE5_CH3_QUESTIONS } from "@/lib/questions/chapter3";
import {
  citationsForQuestion,
  pairKeyForQuestion,
} from "@/lib/questions/catalog";
import { CHAPTER_3_CONFUSION_PAIRS, canonicalPairKey } from "@/lib/knowledge";

const EXPECTED_EXAM_CODES: Record<string, readonly string[]> = {
  "ch3-q-buyer-vs-seller-in-transaction": ["IV"],
  "ch3-q-wb1-included-vs-not-included": ["VI"],
  "ch3-q-protected-buyer-vs-extension-of-listing": ["IV", "VI"],
  "ch3-q-wb1-residential-vs-wb4-condo": ["IV", "VI"],
  "ch3-q-wb1-listing-vs-wb36-buyer-agency": ["IV", "VI"],
  "ch3-q-protected-buyer-vs-protected-property": ["IV", "VI"],
  "ch3-q-extension-listing-vs-extension-agreement-term": ["VI"],
  "ch3-q-limited-common-elements-vs-association-fee": ["VI"],
};

describe("Phase 5 Chapter 3 questions", () => {
  it("covers every Chapter 3 confusion pair with citations and one correct option", () => {
    expect(PHASE5_CH3_QUESTIONS).toHaveLength(CHAPTER_3_CONFUSION_PAIRS.length);
    for (const question of PHASE5_CH3_QUESTIONS) {
      expect(question.chapterNumber).toBe(3);
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
      const citations = citationsForQuestion(question);
      expect(citations.length).toBeGreaterThan(0);
      expect(citations.every((citation) => citation.pdfPage > 0)).toBe(true);
    }
  });

  it("maps each question to the expected exam categories", () => {
    for (const question of PHASE5_CH3_QUESTIONS) {
      expect(question.examCategoryCodes).toEqual(EXPECTED_EXAM_CODES[question.slug]);
    }
  });

  it("only uses active Chapter 3 confusion pairs", () => {
    const activeKeys = new Set(
      CHAPTER_3_CONFUSION_PAIRS.map((pair) => canonicalPairKey(pair.a, pair.b)),
    );
    for (const question of PHASE5_CH3_QUESTIONS) {
      const key = pairKeyForQuestion(question);
      expect(key).toBeTruthy();
      expect(activeKeys.has(key!)).toBe(true);
    }
  });

  it("does not invent Wisconsin statute numbers or dollar fees", () => {
    const text = PHASE5_CH3_QUESTIONS.map(
      (question) =>
        `${question.stem} ${question.options.map((option) => option.body).join(" ")} ${question.remediationWhyMissed} ${question.remediationDistinction}`,
    ).join(" ");
    expect(text).not.toMatch(/wis\.?\s*stat/i);
    expect(text).not.toMatch(/\$\d/);
  });
});
