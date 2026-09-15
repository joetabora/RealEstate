import { describe, expect, it } from "vitest";
import {
  ADAPTIVE_PREFIX_CAP,
  pickAdaptiveRepairAssets,
  prependAdaptiveItems,
  type AdaptiveAssetCandidate,
  type AdaptiveSignal,
} from "@/lib/mastery/adaptive";
import type { SessionDraft } from "@/lib/session";

const assets: AdaptiveAssetCandidate[] = [
  { id: "a-compare", conceptId: "c1", pairId: "p1", kind: "comparison" },
  { id: "a-explain", conceptId: "c1", pairId: null, kind: "explanation" },
  { id: "a-c2", conceptId: "c2", pairId: null, kind: "explanation" },
  { id: "a-c3", conceptId: "c3", pairId: null, kind: "scenario" },
  { id: "a-c4", conceptId: "c4", pairId: null, kind: "recall_prompt" },
];

describe("pickAdaptiveRepairAssets", () => {
  it("prefers pair comparison assets for mistake signals", () => {
    const signals: AdaptiveSignal[] = [
      { kind: "mistake", conceptId: "c1", pairId: "p1" },
    ];
    const picks = pickAdaptiveRepairAssets(signals, assets, 1);
    expect(picks).toHaveLength(1);
    expect(picks[0]?.asset.id).toBe("a-compare");
    expect(picks[0]?.reasonCodes).toContain("adaptive_mistake");
  });

  it("respects priority order and the prefix cap", () => {
    const signals: AdaptiveSignal[] = [
      { kind: "mistake", conceptId: "c1", pairId: "p1" },
      { kind: "overdue", conceptId: "c2" },
      { kind: "overconfidence", conceptId: "c3", pairId: null },
      { kind: "overdue", conceptId: "c4" },
    ];
    const picks = pickAdaptiveRepairAssets(signals, assets);
    expect(picks).toHaveLength(ADAPTIVE_PREFIX_CAP);
    expect(picks.map((pick) => pick.asset.id)).toEqual([
      "a-compare",
      "a-c2",
      "a-c3",
    ]);
  });
});

describe("prependAdaptiveItems", () => {
  it("prepends repair/review items and renumbers sortOrder", () => {
    const draft: SessionDraft = {
      objective: "Chapter 1 Agency",
      targetMinutes: 20,
      plannerVersion: "phase4-agency-v1",
      items: [
        {
          sortOrder: 0,
          kind: "learn",
          reasonCodes: ["chapter_step"],
          assetId: "base-1",
          conceptId: "c9",
        },
      ],
    };

    const next = prependAdaptiveItems(draft, [
      {
        asset: assets[0]!,
        reasonCodes: ["adaptive_mistake", "repair"],
      },
      {
        asset: assets[2]!,
        reasonCodes: ["adaptive_overdue", "review"],
      },
    ]);

    expect(next.items).toHaveLength(3);
    expect(next.items[0]?.kind).toBe("repair");
    expect(next.items[1]?.kind).toBe("review");
    expect(next.items.map((item) => item.sortOrder)).toEqual([0, 1, 2]);
    expect(next.objective).toContain("adaptive repair prefix (2)");
  });

  it("skips assets already present in the sitting", () => {
    const draft: SessionDraft = {
      objective: "Chapter 1 Agency",
      targetMinutes: 20,
      plannerVersion: "phase4-agency-v1",
      items: [
        {
          sortOrder: 0,
          kind: "learn",
          reasonCodes: ["chapter_step"],
          assetId: "a-compare",
        },
      ],
    };

    const next = prependAdaptiveItems(draft, [
      {
        asset: assets[0]!,
        reasonCodes: ["adaptive_mistake", "repair"],
      },
    ]);
    expect(next.items).toHaveLength(1);
    expect(next.objective).toBe(draft.objective);
  });
});
