import { describe, expect, it } from "vitest";
import {
  planAgencySession,
  planChapter14Session,
  planTeachMeSitting,
  selectTeachMeSitting,
} from "@/lib/teach-me/planner";
import { PHASE4_SESSION_STEPS } from "@/lib/teach-me/assets";
import { PHASE4_CH14_SESSION_STEPS } from "@/lib/teach-me/chapter14-assets";
import {
  PLANNER_VERSION_CH1,
  PLANNER_VERSION_CH2,
  PLANNER_VERSION_CH3,
  PLANNER_VERSION_CH4,
  PLANNER_VERSION_CH5,
  PLANNER_VERSION_CH6,
  PLANNER_VERSION_CH7,
  PLANNER_VERSION_CH8,
  PLANNER_VERSION_CH9,
  PLANNER_VERSION_CH10,
  PLANNER_VERSION_CH11,
  PLANNER_VERSION_CH12,
  PLANNER_VERSION_CH13,
  PLANNER_VERSION_CH14,
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
          PLANNER_VERSION_CH7,
          PLANNER_VERSION_CH8,
          PLANNER_VERSION_CH9,
          PLANNER_VERSION_CH10,
          PLANNER_VERSION_CH11,
          PLANNER_VERSION_CH12,
          PLANNER_VERSION_CH13,
        ]),
      }),
    ).toBe("chapter14");
  });

  it("does not open Chapter 14 while Chapter 13 is incomplete", () => {
    expect(
      selectTeachMeSitting({
        completedPlannerVersions: new Set([
          PLANNER_VERSION_CH1,
          PLANNER_VERSION_CH2,
          PLANNER_VERSION_CH3,
          PLANNER_VERSION_CH4,
          PLANNER_VERSION_CH5,
          PLANNER_VERSION_CH6,
          PLANNER_VERSION_CH7,
          PLANNER_VERSION_CH8,
          PLANNER_VERSION_CH9,
          PLANNER_VERSION_CH10,
          PLANNER_VERSION_CH11,
          PLANNER_VERSION_CH12,
        ]),
      }),
    ).toBe("chapter13");
  });

  it("starts Chapter 14 after Chapters 1–13 are complete", () => {
    const assets = PHASE4_CH14_SESSION_STEPS.map((step, index) => ({
      slug: step.assetSlug,
      id: `ch14-${index}`,
      conceptId: null,
      pairId: null,
    }));
    expect(planChapter14Session(assets).plannerVersion).toBe(PLANNER_VERSION_CH14);
    expect(
      planTeachMeSitting(assets, {
        completedPlannerVersions: new Set([
          PLANNER_VERSION_CH1,
          PLANNER_VERSION_CH2,
          PLANNER_VERSION_CH3,
          PLANNER_VERSION_CH4,
          PLANNER_VERSION_CH5,
          PLANNER_VERSION_CH6,
          PLANNER_VERSION_CH7,
          PLANNER_VERSION_CH8,
          PLANNER_VERSION_CH9,
          PLANNER_VERSION_CH10,
          PLANNER_VERSION_CH11,
          PLANNER_VERSION_CH12,
          PLANNER_VERSION_CH13,
        ]),
      }).plannerVersion,
    ).toBe(PLANNER_VERSION_CH14);
    expect(planChapter14Session(assets).items).toHaveLength(PHASE4_CH14_SESSION_STEPS.length);
  });

  it("throws when a required Chapter 1 asset was not seeded", () => {
    expect(() => planAgencySession([])).toThrow(/licensee-explanation/);
  });
});
