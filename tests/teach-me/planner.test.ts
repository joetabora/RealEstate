import { describe, expect, it } from "vitest";
import {
  planAgencySession,
  planChapter7Session,
  planTeachMeSitting,
  selectTeachMeSitting,
} from "@/lib/teach-me/planner";
import { PHASE4_SESSION_STEPS } from "@/lib/teach-me/assets";
import { PHASE4_CH7_SESSION_STEPS } from "@/lib/teach-me/chapter7-assets";
import {
  PLANNER_VERSION_CH1,
  PLANNER_VERSION_CH2,
  PLANNER_VERSION_CH3,
  PLANNER_VERSION_CH4,
  PLANNER_VERSION_CH5,
  PLANNER_VERSION_CH6,
  PLANNER_VERSION_CH7,
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
          PLANNER_VERSION_CH5,
          PLANNER_VERSION_CH6,
        ]),
      }),
    ).toBe("chapter7");
  });

  it("does not open Chapter 7 while Chapter 6 is incomplete", () => {
    expect(
      selectTeachMeSitting({
        completedPlannerVersions: new Set([
          PLANNER_VERSION_CH1,
          PLANNER_VERSION_CH2,
          PLANNER_VERSION_CH3,
          PLANNER_VERSION_CH4,
          PLANNER_VERSION_CH5,
        ]),
      }),
    ).toBe("chapter6");
  });

  it("starts Chapter 7 after Chapters 1–6 are complete", () => {
    const assets = PHASE4_CH7_SESSION_STEPS.map((step, index) => ({
      slug: step.assetSlug,
      id: `ch7-${index}`,
      conceptId: null,
      pairId: null,
    }));
    expect(planChapter7Session(assets).plannerVersion).toBe(PLANNER_VERSION_CH7);
    expect(
      planTeachMeSitting(assets, {
        completedPlannerVersions: new Set([
          PLANNER_VERSION_CH1,
          PLANNER_VERSION_CH2,
          PLANNER_VERSION_CH3,
          PLANNER_VERSION_CH4,
          PLANNER_VERSION_CH5,
          PLANNER_VERSION_CH6,
        ]),
      }).plannerVersion,
    ).toBe(PLANNER_VERSION_CH7);
    expect(planChapter7Session(assets).items).toHaveLength(PHASE4_CH7_SESSION_STEPS.length);
  });

  it("throws when a required Chapter 1 asset was not seeded", () => {
    expect(() => planAgencySession([])).toThrow(/licensee-explanation/);
  });
});
