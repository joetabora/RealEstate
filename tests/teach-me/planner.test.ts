import { describe, expect, it } from "vitest";
import {
  planAgencySession,
  planChapter5Session,
  planTeachMeSitting,
  selectTeachMeSitting,
} from "@/lib/teach-me/planner";
import { PHASE4_SESSION_STEPS } from "@/lib/teach-me/assets";
import { PHASE4_CH5_SESSION_STEPS } from "@/lib/teach-me/chapter5-assets";
import {
  PLANNER_VERSION_CH1,
  PLANNER_VERSION_CH2,
  PLANNER_VERSION_CH3,
  PLANNER_VERSION_CH4,
  PLANNER_VERSION_CH5,
} from "@/lib/teach-me/types";

describe("Teach Me sequential planner", () => {
  it("keeps Chapter 1 sitting on phase4-agency-v1", () => {
    const assets = PHASE4_SESSION_STEPS.map((step, index) => ({
      slug: step.assetSlug,
      id: `asset-${index}`,
      conceptId: `concept-${index}`,
      pairId: null,
    }));
    expect(planAgencySession(assets).plannerVersion).toBe(PLANNER_VERSION_CH1);
  });

  it("advances only after prior planner versions are complete", () => {
    expect(selectTeachMeSitting({ completedPlannerVersions: new Set() })).toBe("chapter1");
    expect(
      selectTeachMeSitting({
        completedPlannerVersions: new Set([
          PLANNER_VERSION_CH1,
          PLANNER_VERSION_CH2,
          PLANNER_VERSION_CH3,
          PLANNER_VERSION_CH4,
        ]),
      }),
    ).toBe("chapter5");
  });

  it("does not open Chapter 5 while Chapter 4 is incomplete", () => {
    expect(
      selectTeachMeSitting({
        completedPlannerVersions: new Set([
          PLANNER_VERSION_CH1,
          PLANNER_VERSION_CH2,
          PLANNER_VERSION_CH3,
        ]),
      }),
    ).toBe("chapter4");
  });

  it("starts Chapter 5 after Chapters 1–4 are complete", () => {
    const assets = PHASE4_CH5_SESSION_STEPS.map((step, index) => ({
      slug: step.assetSlug,
      id: `ch5-${index}`,
      conceptId: null,
      pairId: null,
    }));
    expect(planChapter5Session(assets).plannerVersion).toBe(PLANNER_VERSION_CH5);
    expect(
      planTeachMeSitting(assets, {
        completedPlannerVersions: new Set([
          PLANNER_VERSION_CH1,
          PLANNER_VERSION_CH2,
          PLANNER_VERSION_CH3,
          PLANNER_VERSION_CH4,
        ]),
      }).plannerVersion,
    ).toBe(PLANNER_VERSION_CH5);
    expect(planChapter5Session(assets).items).toHaveLength(PHASE4_CH5_SESSION_STEPS.length);
  });

  it("throws when a required Chapter 1 asset was not seeded", () => {
    expect(() => planAgencySession([])).toThrow(/licensee-explanation/);
  });
});
