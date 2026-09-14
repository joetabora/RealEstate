import type { ConceptCitationSeed } from "@/lib/knowledge/types";
import { canonicalPairKey } from "@/lib/knowledge/types";
import { ALL_CONCEPT_CATALOGS } from "@/lib/knowledge/seed";

export type QuestionOptionSeed = {
  key: "A" | "B" | "C" | "D";
  body: string;
  isCorrect: boolean;
};

export type QuestionSeed = {
  slug: string;
  stem: string;
  informationClass: "course_sourced" | "general_explanation" | "needs_verification";
  chapterNumber: number;
  examCategoryCodes: readonly string[];
  conceptSlug?: string;
  pair?: { a: string; b: string };
  citationSlugs: readonly string[];
  options: readonly QuestionOptionSeed[];
  remediationWhyMissed: string;
  remediationDistinction: string;
};

export type QuestionCitationSeed = ConceptCitationSeed & { chapterNumber: number };

function citationsFor(slug: string): readonly QuestionCitationSeed[] {
  const concept = ALL_CONCEPT_CATALOGS.find((row) => row.slug === slug);
  if (!concept) {
    throw new Error(`Question citation slug is missing from concept catalogs: ${slug}`);
  }
  return concept.citations.map((citation) => ({
    ...citation,
    chapterNumber: concept.chapterNumber,
  }));
}

export function citationsForQuestion(question: QuestionSeed): QuestionCitationSeed[] {
  const seen = new Set<string>();
  const citations: QuestionCitationSeed[] = [];
  for (const slug of question.citationSlugs) {
    for (const citation of citationsFor(slug)) {
      const key = `${citation.documentSlug}|${citation.heading}|${citation.pdfPage}`;
      if (seen.has(key)) continue;
      seen.add(key);
      citations.push(citation);
    }
  }
  return citations;
}

export function pairKeyForQuestion(question: QuestionSeed): string | null {
  if (!question.pair) return null;
  return canonicalPairKey(question.pair.a, question.pair.b);
}
