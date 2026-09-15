import type { DraftTarget, QuestionDraft } from "./types";

/**
 * Deterministic draft MCQ from a confusion pair.
 * Uses pair reason + concept names only — never invents statutes, fees, or form lines.
 */
export function buildMockDraft(target: DraftTarget): QuestionDraft {
  const { conceptA: a, conceptB: b, reason, chapterNumber } = target;
  const variant = target.existingDraftCount + 1;

  const stem =
    `Draft review (variant ${variant}) for Chapter ${chapterNumber}: ` +
    `"${a.name}" versus "${b.name}". The course treats these as a confusion pair ` +
    `because: ${trimReason(reason)}. Which statement matches that distinction?`;

  const correct =
    `"${a.name}" and "${b.name}" are distinct course terms; ${trimReason(reason)}`;

  const options = [
    {
      key: "A" as const,
      body: `"${a.name}" and "${b.name}" are interchangeable labels for the same idea.`,
      isCorrect: false,
    },
    {
      key: "B" as const,
      body: correct.slice(0, 280),
      isCorrect: true,
    },
    {
      key: "C" as const,
      body: `Only "${a.name}" appears in the course; "${b.name}" is not a separate heading.`,
      isCorrect: false,
    },
    {
      key: "D" as const,
      body: `The pair exists only for exam tricks and has no course heading support.`,
      isCorrect: false,
    },
  ];

  return {
    stem,
    options,
    remediationWhyMissed:
      `That choice collapses or invents the relationship between "${a.name}" and "${b.name}" ` +
      `instead of following the seeded confusion-pair reason.`,
    remediationDistinction: trimReason(reason),
    informationClass: "course_sourced",
    provider: "mock",
  };
}

function trimReason(reason: string): string {
  const cleaned = reason.replace(/\s+/g, " ").trim();
  if (cleaned.length >= 12) return cleaned.slice(0, 240);
  return "the course keeps these as separate, easily confused ideas";
}
