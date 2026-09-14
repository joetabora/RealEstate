import { describe, expect, it } from "vitest";
import { planAgencySession } from "@/lib/teach-me/planner";
import { PHASE4_SESSION_STEPS } from "@/lib/teach-me/assets";
import { PLANNER_VERSION } from "@/lib/teach-me/types";

describe("Phase 4 Agency planner", () => {
  it("sequences learn before the client-customer repair", () => {
    const assets = PHASE4_SESSION_STEPS.map((step, index) => ({
      slug: step.assetSlug,
      id: `asset-${index}`,
      conceptId: `concept-${index}`,
      pairId: null,
    }));
    const draft = planAgencySession(assets);
    expect(draft.plannerVersion).toBe(PLANNER_VERSION);
    expect(draft.items).toHaveLength(PHASE4_SESSION_STEPS.length);
    expect(draft.items[0]?.kind).toBe("learn");

    const clientLearn = draft.items.findIndex(
      (_, index) => PHASE4_SESSION_STEPS[index]?.assetSlug === "client-explanation",
    );
    const customerLearn = draft.items.findIndex(
      (_, index) => PHASE4_SESSION_STEPS[index]?.assetSlug === "customer-explanation",
    );
    const repair = draft.items.findIndex(
      (_, index) => PHASE4_SESSION_STEPS[index]?.assetSlug === "client-customer-comparison",
    );
    expect(clientLearn).toBeGreaterThanOrEqual(0);
    expect(customerLearn).toBeGreaterThan(clientLearn);
    expect(repair).toBeGreaterThan(customerLearn);
    expect(draft.items[repair]?.kind).toBe("repair");
  });

  it("throws when a required asset was not seeded", () => {
    expect(() => planAgencySession([])).toThrow(/licensee-explanation/);
  });
});
