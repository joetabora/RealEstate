import { describe, expect, it } from "vitest";
import {
  planAgencySession,
  planChapter10Session,
  planTeachMeSitting,
  selectTeachMeSitting,
} from "@/lib/teach-me/planner";
import { PHASE4_SESSION_STEPS } from "@/lib/teach-me/assets";
import { PHASE4_CH10_SESSION_STEPS } from "@/lib/teach-me/chapter10-assets";
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
        ]),
      }),
    ).toBe("chapter10");
  });

  it("does not open Chapter 10 while Chapter 9 is incomplete", () => {
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
        ]),
      }),
    ).toBe("chapter9");
  });

  it("starts Chapter 10 after Chapters 1–9 are complete", () => {
    const assets = PHASE4_CH10_SESSION_STEPS.map((step, index) => ({
      slug: step.assetSlug,
      id: `ch10-${index}`,
      conceptId: null,
      pairId: null,
    }));
    expect(planChapter10Session(assets).plannerVersion).toBe(PLANNER_VERSION_CH10);
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
        ]),
      }).plannerVersion,
    ).toBe(PLANNER_VERSION_CH10);
    expect(planChapter10Session(assets).items).toHaveLength(PHASE4_CH10_SESSION_STEPS.length);
  });

  it("throws when a required Chapter 1 asset was not seeded", () => {
    expect(() => planAgencySession([])).toThrow(/licensee-explanation/);
  });
});
