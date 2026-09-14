import { describe, expect, it } from "vitest";
import {
  planAgencySession,
  planChapter2Session,
  planTeachMeSitting,
  selectTeachMeSitting,
} from "@/lib/teach-me/planner";
import { PHASE4_SESSION_STEPS } from "@/lib/teach-me/assets";
import { PHASE4_CH2_SESSION_STEPS } from "@/lib/teach-me/chapter2-assets";
import { PLANNER_VERSION_CH1, PLANNER_VERSION_CH2 } from "@/lib/teach-me/types";

describe("Teach Me sequential planner", () => {
  it("keeps Chapter 1 sitting on phase4-agency-v1", () => {
    const assets = PHASE4_SESSION_STEPS.map((step, index) => ({
      slug: step.assetSlug,
      id: `asset-${index}`,
      conceptId: `concept-${index}`,
      pairId: null,
    }));
    const draft = planAgencySession(assets);
    expect(draft.plannerVersion).toBe(PLANNER_VERSION_CH1);
    expect(draft.items).toHaveLength(PHASE4_SESSION_STEPS.length);
    expect(draft.items[0]?.kind).toBe("learn");
  });

  it("does not open Chapter 2 while Chapter 1 is incomplete", () => {
    expect(selectTeachMeSitting(false)).toBe("chapter1");
    const assets = [
      ...PHASE4_SESSION_STEPS.map((step, index) => ({
        slug: step.assetSlug,
        id: `ch1-${index}`,
        conceptId: null,
        pairId: null,
      })),
      ...PHASE4_CH2_SESSION_STEPS.map((step, index) => ({
        slug: step.assetSlug,
        id: `ch2-${index}`,
        conceptId: null,
        pairId: null,
      })),
    ];
    const draft = planTeachMeSitting(assets, false);
    expect(draft.plannerVersion).toBe(PLANNER_VERSION_CH1);
    expect(draft.items.some((item) => item.assetId?.startsWith("ch2-"))).toBe(false);
  });

  it("starts Chapter 2 only after Chapter 1 is complete", () => {
    expect(selectTeachMeSitting(true)).toBe("chapter2");
    const assets = PHASE4_CH2_SESSION_STEPS.map((step, index) => ({
      slug: step.assetSlug,
      id: `ch2-${index}`,
      conceptId: null,
      pairId: null,
    }));
    const draft = planChapter2Session(assets);
    expect(draft.plannerVersion).toBe(PLANNER_VERSION_CH2);
    expect(draft.items).toHaveLength(PHASE4_CH2_SESSION_STEPS.length);
    const exclusiveRepair = draft.items.findIndex(
      (_, index) =>
        PHASE4_CH2_SESSION_STEPS[index]?.assetSlug === "ch2-exclusive-listings-comparison",
    );
    expect(exclusiveRepair).toBeGreaterThan(0);
    expect(draft.items[exclusiveRepair]?.kind).toBe("repair");
  });

  it("throws when a required Chapter 1 asset was not seeded", () => {
    expect(() => planAgencySession([])).toThrow(/licensee-explanation/);
  });
});
