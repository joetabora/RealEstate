import type { TutorCitation } from "./types";

export type TutorProviderReply = {
  body: string;
  citations: TutorCitation[];
  provider: "mock" | "openai";
  tokenEstimate?: number;
};

/**
 * Deterministic mock tutor: Socratic prompts only.
 * Never asserts Wisconsin statutes, fees, deadlines, or form-line text.
 */
export function replyWithMockTutor(userMessage: string): TutorProviderReply {
  const trimmed = userMessage.trim();
  const lower = trimmed.toLowerCase();

  if (!trimmed) {
    return {
      provider: "mock",
      body: "Ask a study question. In mock mode I will only coach your thinking — I will not invent Wisconsin law facts.",
      citations: [{ label: "Library", href: "/library" }],
    };
  }

  if (
    lower.includes("statute") ||
    lower.includes("deadline") ||
    lower.includes("fee") ||
    lower.includes("form ") ||
    lower.includes("wb-") ||
    lower.includes("wisconsin") ||
    lower.includes("how many days")
  ) {
    return {
      provider: "mock",
      body:
        "I cannot invent Wisconsin statutes, fees, deadlines, or form-line text. Open Library or a Teach Me citation for that fact, then tell me what the cited page says and we can reason from it.",
      citations: [
        { label: "Library", href: "/library" },
        { label: "Teach Me", href: "/" },
      ],
    };
  }

  if (lower.includes("confused") || lower.includes("difference") || lower.includes("vs")) {
    return {
      provider: "mock",
      body:
        "Name the two ideas you are mixing up in your own words. Then open the comparison asset or Practice distinction for that pair. What one sentence separates them?",
      citations: [
        { label: "Practice", href: "/practice" },
        { label: "Mistakes", href: "/mistakes" },
      ],
    };
  }

  return {
    provider: "mock",
    body:
      "Before any answer: what does the course page or Teach Me asset say in your own words? Quote or paraphrase the cited heading, then ask me to stress-test that understanding. Mock mode will not supply Wisconsin facts.",
    citations: [
      { label: "Teach Me", href: "/" },
      { label: "Progress", href: "/progress" },
    ],
  };
}
