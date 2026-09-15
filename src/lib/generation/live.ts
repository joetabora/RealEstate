import { getTutorEnvConfig } from "@/lib/tutor/config";
import type { DraftTarget, QuestionDraft } from "./types";

const SYSTEM_PROMPT = `You draft one multiple-choice review item for a personal Wisconsin real estate exam coach.

Binding rules:
- Output ONLY valid JSON matching the schema. No markdown fences.
- Use the provided concept names and confusion reason only.
- Never invent Wisconsin statutes, fees, deadlines, form-line text, REEB rules, or protected-class lists.
- Do not invent numeric keys, transfer-fee schedules, or form numbers (WB-xx).
- Stem and options must test the distinction between the two concepts.
- Exactly one option isCorrect=true.
- Keep language general ("course headings", "chapter") — do not assert uncited Wisconsin law.

JSON schema:
{
  "stem": string,
  "options": [
    { "key": "A"|"B"|"C"|"D", "body": string, "isCorrect": boolean }
  ],
  "remediationWhyMissed": string,
  "remediationDistinction": string
}`;

export type LiveDraftResult = {
  draft: QuestionDraft;
  tokenEstimate: number;
};

export async function buildLiveDraft(target: DraftTarget): Promise<LiveDraftResult> {
  const env = getTutorEnvConfig();
  if (!env.apiKey) {
    throw new Error("Live generation needs OPENAI_API_KEY in .env.");
  }

  const userPayload = {
    chapterNumber: target.chapterNumber,
    conceptA: { slug: target.conceptA.slug, name: target.conceptA.name },
    conceptB: { slug: target.conceptB.slug, name: target.conceptB.name },
    confusionReason: target.reason,
    variant: target.existingDraftCount + 1,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.model,
      temperature: 0.3,
      max_tokens: 700,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Draft variant JSON for this confusion pair:\n${JSON.stringify(userPayload, null, 2)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${detail.slice(0, 240)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { total_tokens?: number };
  };

  const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
  const draft = parseDraftJson(raw);
  const tokenEstimate =
    data.usage?.total_tokens ??
    Math.ceil((SYSTEM_PROMPT.length + JSON.stringify(userPayload).length + raw.length) / 4);

  return { draft, tokenEstimate };
}

function parseDraftJson(raw: string): QuestionDraft {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Live generation returned non-JSON content.");
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Live generation JSON must be an object.");
  }
  const row = parsed as Record<string, unknown>;
  const stem = typeof row.stem === "string" ? row.stem.trim() : "";
  const why =
    typeof row.remediationWhyMissed === "string" ? row.remediationWhyMissed.trim() : "";
  const distinction =
    typeof row.remediationDistinction === "string"
      ? row.remediationDistinction.trim()
      : "";
  if (stem.length < 12 || why.length < 8 || distinction.length < 8) {
    throw new Error("Live generation missing stem or remediation fields.");
  }
  if (!Array.isArray(row.options) || row.options.length < 2 || row.options.length > 6) {
    throw new Error("Live generation must include 2–6 options.");
  }

  const keys = new Set<string>();
  const options: QuestionDraft["options"] = [];
  for (const option of row.options) {
    if (!option || typeof option !== "object") continue;
    const o = option as Record<string, unknown>;
    const key = o.key;
    const body = typeof o.body === "string" ? o.body.trim() : "";
    const isCorrect = o.isCorrect === true;
    if (key !== "A" && key !== "B" && key !== "C" && key !== "D") {
      throw new Error("Live generation option keys must be A–D.");
    }
    if (!body) throw new Error("Live generation options need bodies.");
    if (keys.has(key)) throw new Error("Live generation option keys must be unique.");
    keys.add(key);
    options.push({ key, body, isCorrect });
  }
  if (options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error("Live generation must mark exactly one correct option.");
  }

  return {
    stem,
    options,
    remediationWhyMissed: why,
    remediationDistinction: distinction,
    informationClass: "course_sourced",
    provider: "live",
  };
}
