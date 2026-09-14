import { describe, expect, it } from "vitest";
import {
  planAgencySession,
  planChapter4Session,
  planTeachMeSitting,
  selectTeachMeSitting,
} from "@/lib/teach-me/planner";
import { PHASE4_SESSION_STEPS } from "@/lib/teach-me/assets";
import { PHASE4_CH4_SESSION_STEPS } from "@/lib/teach-me/chapter4-assets";
import {
  PLANNER_VERSION_CH1,
  PLANNER_VERSION_CH2,
  PLANNER_VERSION_CH3,
  PLANNER_VERSION_CH4,
} from "@/lib/teach-me/types";

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
  });

  it("advances only after prior planner versions are complete", () => {
    expect(selectTeachMeSitting({ completedPlannerVersions: new Set() })).toBe("chapter1");
    expect(
      selectTeachMeSitting({ completedPlannerVersions: new Set([PLANNER_VERSION_CH1]) }),
    ).toBe("chapter2");
    expect(
      selectTeachMeSitting({
        completedPlannerVersions: new Set([PLANNER_VERSION_CH1, PLANNER_VERSION_CH2]),
      }),
    ).toBe("chapter3");
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

  it("does not open Chapter 4 while Chapter 3 is incomplete", () => {
    expect(
      selectTeachMeSitting({
        completedPlannerVersions: new Set([PLANNER_VERSION_CH1, PLANNER_VERSION_CH2]),
      }),
    ).toBe("chapter3");
  });

  it("starts Chapter 4 after Chapters 1–3 are complete", () => {
    const assets = PHASE4_CH4_SESSION_STEPS.map((step, index) => ({
      slug: step.assetSlug,
      id: `ch4-${index}`,
      conceptId: null,
      pairId: null,
    }));
    const draft = planChapter4Session(assets);
    expect(draft.plannerVersion).toBe(PLANNER_VERSION_CH4);
    expect(draft.items).toHaveLength(PHASE4_CH4_SESSION_STEPS.length);
    expect(
      planTeachMeSitting(assets, {
        completedPlannerVersions: new Set([
          PLANNER_VERSION_CH1,
          PLANNER_VERSION_CH2,
          PLANNER_VERSION_CH3,
        ]),
      }).plannerVersion,
    ).toBe(PLANNER_VERSION_CH4);
  });

  it("throws when a required Chapter 1 asset was not seeded", () => {
    expect(() => planAgencySession([])).toThrow(/licensee-explanation/);
  });
});
