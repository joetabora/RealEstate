import { getTutorEnvConfig } from "./config";
import type { TutorCitation } from "./types";
import type { TutorProviderReply } from "./mock";

const SYSTEM_PROMPT = `You are the optional Socratic tutor for a personal Wisconsin real estate salesperson exam coach.

Rules (binding):
- Be Socratic: ask questions, probe distinctions, check confidence. Do not dump long lectures.
- Never invent Wisconsin statutes, fees, deadlines, form-line text, or protected-class lists.
- If a Wisconsin-specific fact is needed and you do not have a cited course heading in the conversation, say you need verification and tell the learner to open Library or Teach Me for a citation.
- Label uncertain claims as needs_verification.
- Do not invent the study plan, mastery percentages, or exam score predictions.
- Prefer pointing the learner back to Teach Me, Practice, Mistakes, or Library.
- Keep replies short (under ~120 words) unless the learner asks for more.`;

export async function replyWithOpenAiTutor(input: {
  userMessage: string;
  history: Array<{ role: "user" | "assistant"; body: string }>;
}): Promise<TutorProviderReply> {
  const env = getTutorEnvConfig();
  if (!env.apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...input.history.slice(-12).map((message) => ({
      role: message.role,
      content: message.body,
    })),
    { role: "user", content: input.userMessage },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.model,
      temperature: 0.4,
      max_tokens: 400,
      messages,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${detail.slice(0, 240)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  };

  const body =
    data.choices?.[0]?.message?.content?.trim() ||
    "I could not generate a reply. Try again, or switch to mock mode.";

  const tokenEstimate =
    data.usage?.total_tokens ??
    Math.ceil(
      (SYSTEM_PROMPT.length +
        input.history.reduce((sum, row) => sum + row.body.length, 0) +
        input.userMessage.length +
        body.length) /
        4,
    );

  const citations: TutorCitation[] = [
    { label: "Library", href: "/library" },
    { label: "Teach Me", href: "/" },
  ];

  return {
    provider: "openai",
    body,
    citations,
    tokenEstimate,
  };
}
