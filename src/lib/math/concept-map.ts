import { mathTemplateById } from "./catalog";
import type { MathTemplate } from "./types";

/**
 * Deterministic concept slug → math template id.
 * Only map headings where a Phase 8 solver is the right repair drill.
 */
export const CONCEPT_MATH_TEMPLATE_IDS: Readonly<Record<string, string>> = {
  commission: "commission-gross",
  "calculating-commissions": "commission-gross",
  "dividing-commissions": "commission-gross",
  "commission-cooperating-firms": "commission-gross",
  "commission-in-house-sale": "commission-gross",
  "other-commission-issues": "commission-gross",
  "wb-1-commission": "commission-gross",
  "tax-calculations": "daily-proration",
  "calculating-buyer-mortgage-payment": "simple-interest",
};

export const MATH_TEMPLATE_REASON_PREFIX = "math_template:";

export function mathTemplateIdForConceptSlug(slug: string): string | null {
  return CONCEPT_MATH_TEMPLATE_IDS[slug] ?? null;
}

export function mathTemplateForConceptSlug(slug: string): MathTemplate | null {
  const id = mathTemplateIdForConceptSlug(slug);
  return id ? mathTemplateById(id) : null;
}

export function mathTemplateIdFromReasonCodes(reasonCodes: readonly string[]): string | null {
  for (const code of reasonCodes) {
    if (code.startsWith(MATH_TEMPLATE_REASON_PREFIX)) {
      return code.slice(MATH_TEMPLATE_REASON_PREFIX.length) || null;
    }
  }
  return null;
}

export function mathTemplateReasonCode(templateId: string): string {
  return `${MATH_TEMPLATE_REASON_PREFIX}${templateId}`;
}
