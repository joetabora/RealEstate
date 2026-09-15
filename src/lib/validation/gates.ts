export const CONTENT_LIFECYCLES = [
  "generated",
  "source_check",
  "structural_check",
  "answer_check",
  "ambiguity_check",
  "wi_fact_check",
  "validated",
  "active",
  "rejected",
] as const;

export type ContentLifecycle = (typeof CONTENT_LIFECYCLES)[number];

export const CONTENT_GATES = [
  "source_check",
  "structural_check",
  "answer_check",
  "ambiguity_check",
  "wi_fact_check",
] as const;

export type ContentGate = (typeof CONTENT_GATES)[number];

/** Order of gates after `generated`. */
export const GATE_PIPELINE: readonly ContentGate[] = [
  "source_check",
  "structural_check",
  "answer_check",
  "ambiguity_check",
  "wi_fact_check",
];

export function isContentLifecycle(value: string): value is ContentLifecycle {
  return (CONTENT_LIFECYCLES as readonly string[]).includes(value);
}

export function nextGateForLifecycle(lifecycle: string): ContentGate | null {
  if (lifecycle === "generated") return "source_check";
  if (lifecycle === "source_check") return "structural_check";
  if (lifecycle === "structural_check") return "answer_check";
  if (lifecycle === "answer_check") return "ambiguity_check";
  if (lifecycle === "ambiguity_check") return "wi_fact_check";
  if (lifecycle === "wi_fact_check") return null; // success advances to validated
  return null;
}

export function lifecycleAfterPassingGate(gate: ContentGate): ContentLifecycle {
  if (gate === "source_check") return "source_check";
  if (gate === "structural_check") return "structural_check";
  if (gate === "answer_check") return "answer_check";
  if (gate === "ambiguity_check") return "ambiguity_check";
  return "validated"; // wi_fact_check passed
}

/**
 * WI-ish claim markers that require a citation when informationClass is not course_sourced.
 * Detection only — never invents a statute cite.
 */
export const WI_CLAIM_PATTERN =
  /\b(wis\.?\s*stat|wisconsin|§|wb-?\d+|reeb|dspse|iberta|transfer fee)\b/i;

export type GateResult = {
  gate: ContentGate;
  passed: boolean;
  reasons: string[];
};

export type QuestionGateInput = {
  stem: string;
  informationClass: string;
  remediationWhyMissed: string;
  remediationDistinction: string;
  citationCount: number;
  options: Array<{ key: string; body: string; isCorrect: boolean }>;
};

export type AssetGateInput = {
  title: string;
  body: string;
  kind: string;
  informationClass: string;
  citationCount: number;
};

export function runQuestionGate(gate: ContentGate, input: QuestionGateInput): GateResult {
  const reasons: string[] = [];
  if (gate === "source_check") {
    if (input.citationCount < 1) reasons.push("Question needs at least one citation.");
    if (input.informationClass === "course_sourced" && input.citationCount < 1) {
      reasons.push("course_sourced items must cite a source heading/page.");
    }
  }
  if (gate === "structural_check") {
    if (input.stem.trim().length < 12) reasons.push("Stem is too short.");
    if (input.options.length < 2) reasons.push("Need at least two options.");
    if (input.options.length > 6) reasons.push("Too many options (max 6).");
    const keys = new Set(input.options.map((o) => o.key));
    if (keys.size !== input.options.length) reasons.push("Option keys must be unique.");
    if (input.remediationWhyMissed.trim().length < 8) {
      reasons.push("remediationWhyMissed is missing or too short.");
    }
    if (input.remediationDistinction.trim().length < 8) {
      reasons.push("remediationDistinction is missing or too short.");
    }
  }
  if (gate === "answer_check") {
    const correct = input.options.filter((o) => o.isCorrect);
    if (correct.length !== 1) reasons.push("Exactly one option must be marked correct.");
  }
  if (gate === "ambiguity_check") {
    const bodies = input.options.map((o) => o.body.trim().toLowerCase());
    if (new Set(bodies).size !== bodies.length) {
      reasons.push("Option bodies must not be duplicates.");
    }
    const empty = input.options.some((o) => o.body.trim().length < 2);
    if (empty) reasons.push("Option bodies must not be empty.");
  }
  if (gate === "wi_fact_check") {
    const blob = `${input.stem}\n${input.options.map((o) => o.body).join("\n")}`;
    if (WI_CLAIM_PATTERN.test(blob) && input.citationCount < 1) {
      reasons.push(
        "Wisconsin/form/statute-like language requires a citation — do not invent cites.",
      );
    }
    if (input.informationClass === "needs_verification") {
      reasons.push("needs_verification items cannot pass wi_fact_check until reclassified.");
    }
  }
  return { gate, passed: reasons.length === 0, reasons };
}

export function runAssetGate(gate: ContentGate, input: AssetGateInput): GateResult {
  const reasons: string[] = [];
  if (gate === "source_check") {
    if (input.citationCount < 1 && input.informationClass === "course_sourced") {
      reasons.push("course_sourced assets must cite a source heading/page.");
    }
  }
  if (gate === "structural_check") {
    if (input.title.trim().length < 3) reasons.push("Title is too short.");
    if (input.body.trim().length < 20) reasons.push("Body is too short.");
    if (!input.kind.trim()) reasons.push("Asset kind is required.");
  }
  if (gate === "answer_check") {
    // Learning assets are not scored items — gate is a no-op pass.
  }
  if (gate === "ambiguity_check") {
    if (/\?\?\?|TBD|lorem ipsum/i.test(input.body)) {
      reasons.push("Body still looks like a placeholder.");
    }
  }
  if (gate === "wi_fact_check") {
    if (WI_CLAIM_PATTERN.test(input.body) && input.citationCount < 1) {
      reasons.push(
        "Wisconsin/form/statute-like language requires a citation — do not invent cites.",
      );
    }
    if (input.informationClass === "needs_verification") {
      reasons.push("needs_verification items cannot pass wi_fact_check until reclassified.");
    }
  }
  return { gate, passed: reasons.length === 0, reasons };
}
