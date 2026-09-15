import type { TutorCitation } from "./types";
import type { TutorContextHit } from "./retrieve";
import { hitsToCitations } from "./retrieve";

export type TutorProviderReply = {
  body: string;
  citations: TutorCitation[];
  provider: "mock" | "openai";
  tokenEstimate?: number;
};

/**
 * Deterministic mock tutor: Socratic prompts only.
 * Never asserts Wisconsin statutes, fees, deadlines, or form-line text.
 * When local retrieval finds course material, point the learner there.
 */
export function replyWithMockTutor(
  userMessage: string,
  contextHits: readonly TutorContextHit[] = [],
): TutorProviderReply {
  const trimmed = userMessage.trim();
  const lower = trimmed.toLowerCase();
  const contextCitations = hitsToCitations(contextHits);
  const fallbackCitations: TutorCitation[] = [
    { label: "Library", href: "/library" },
    { label: "Teach Me", href: "/" },
  ];

  if (!trimmed) {
    return {
      provider: "mock",
      body: "Ask a study question. In mock mode I will only coach your thinking — I will not invent Wisconsin law facts.",
      citations: fallbackCitations,
    };
  }

  const wantsWiFact =
    lower.includes("statute") ||
    lower.includes("deadline") ||
    lower.includes("fee") ||
    lower.includes("form ") ||
    lower.includes("wb-") ||
    lower.includes("wisconsin") ||
    lower.includes("how many days");

  if (wantsWiFact) {
    if (contextHits.length > 0) {
      const list = contextHits
        .slice(0, 3)
        .map((hit) => `• ${hit.title} (${hit.snippet})`)
        .join("\n");
      return {
        provider: "mock",
        body: `I still will not invent Wisconsin statutes, fees, deadlines, or form-line text. Open one of these cited course links, read the heading, then tell me what it says:\n${list}`,
        citations: [...contextCitations, ...fallbackCitations],
      };
    }
    return {
      provider: "mock",
      body: "I cannot invent Wisconsin statutes, fees, deadlines, or form-line text. Open Library or a Teach Me citation for that fact, then tell me what the cited page says and we can reason from it.",
      citations: fallbackCitations,
    };
  }

  if (contextHits.length > 0) {
    const list = contextHits
      .slice(0, 3)
      .map((hit) => `• ${hit.title} — ${hit.snippet}`)
      .join("\n");
    return {
      provider: "mock",
      body: `I found related course material (pointers only, not an answer):\n${list}\n\nOpen one link, paraphrase the cited heading in your own words, and I'll stress-test that understanding.`,
      citations: [...contextCitations, { label: "Practice", href: "/practice" }],
    };
  }

  if (lower.includes("confused") || lower.includes("difference") || lower.includes("vs")) {
    return {
      provider: "mock",
      body: "Name the two ideas you are mixing up in your own words. Then open the comparison asset or Practice distinction for that pair. What one sentence separates them?",
      citations: [
        { label: "Practice", href: "/practice" },
        { label: "Mistakes", href: "/mistakes" },
      ],
    };
  }

  return {
    provider: "mock",
    body: "Before any answer: what does the course page or Teach Me asset say in your own words? Quote or paraphrase the cited heading, then ask me to stress-test that understanding. Mock mode will not supply Wisconsin facts.",
    citations: [
      { label: "Teach Me", href: "/" },
      { label: "Progress", href: "/progress" },
    ],
  };
}
