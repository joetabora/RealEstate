import { describe, expect, it } from "vitest";
import {
  mathTemplateIdForConceptSlug,
  mathTemplateIdFromReasonCodes,
  mathTemplateReasonCode,
} from "@/lib/math";

describe("concept math map", () => {
  it("maps commission concepts to gross commission", () => {
    expect(mathTemplateIdForConceptSlug("calculating-commissions")).toBe("commission-gross");
    expect(mathTemplateIdForConceptSlug("tax-calculations")).toBe("daily-proration");
  });

  it("round-trips math_template reason codes", () => {
    const code = mathTemplateReasonCode("ltv-ratio");
    expect(mathTemplateIdFromReasonCodes([code, "math_repair"])).toBe("ltv-ratio");
  });
});
