import { describe, expect, it } from "vitest";
import {
  planAgencySession,
  planChapter2Session,
  planChapter3Session,
  planTeachMeSitting,
  selectTeachMeSitting,
} from "@/lib/teach-me/planner";
import { PHASE4_SESSION_STEPS } from "@/lib/teach-me/assets";
import { PHASE4_CH2_SESSION_STEPS } from "@/lib/teach-me/chapter2-assets";
import { PHASE4_CH3_SESSION_STEPS } from "@/lib/teach-me/chapter3-assets";
import {
  PLANNER_VERSION_CH1,
  PLANNER_VERSION_CH2,
  PLANNER_VERSION_CH3,
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
    expect(draft.items).toHaveLength(PHASE4_SESSION_STEPS.length);
  });

  it("does not open Chapter 2 or 3 while Chapter 1 is incomplete", () => {
    expect(
      selectTeachMeSitting({ chapter1Complete: false, chapter2Complete: false }),
    ).toBe("chapter1");
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
      ...PHASE4_CH3_SESSION_STEPS.map((step, index) => ({
        slug: step.assetSlug,
        id: `ch3-${index}`,
        conceptId: null,
        pairId: null,
      })),
    ];
    const draft = planTeachMeSitting(assets, {
      chapter1Complete: false,
      chapter2Complete: false,
    });
    expect(draft.plannerVersion).toBe(PLANNER_VERSION_CH1);
  });

  it("does not open Chapter 3 while Chapter 2 is incomplete", () => {
    expect(
      selectTeachMeSitting({ chapter1Complete: true, chapter2Complete: false }),
    ).toBe("chapter2");
    const assets = PHASE4_CH2_SESSION_STEPS.map((step, index) => ({
      slug: step.assetSlug,
      id: `ch2-${index}`,
      conceptId: null,
      pairId: null,
    }));
    const draft = planTeachMeSitting(assets, {
      chapter1Complete: true,
      chapter2Complete: false,
    });
    expect(draft.plannerVersion).toBe(PLANNER_VERSION_CH2);
  });

  it("starts Chapter 3 only after Chapters 1 and 2 are complete", () => {
    expect(
      selectTeachMeSitting({ chapter1Complete: true, chapter2Complete: true }),
    ).toBe("chapter3");
    const assets = PHASE4_CH3_SESSION_STEPS.map((step, index) => ({
      slug: step.assetSlug,
      id: `ch3-${index}`,
      conceptId: null,
      pairId: null,
    }));
    const draft = planChapter3Session(assets);
    expect(draft.plannerVersion).toBe(PLANNER_VERSION_CH3);
    expect(draft.items).toHaveLength(PHASE4_CH3_SESSION_STEPS.length);
  });

  it("throws when a required Chapter 1 asset was not seeded", () => {
    expect(() => planAgencySession([])).toThrow(/licensee-explanation/);
  });
});
