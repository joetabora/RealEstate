import type { SessionDraft, SessionItemDraft } from "@/lib/session";
import { PHASE4_ASSETS, PHASE4_SESSION_STEPS } from "./assets";
import { PLANNER_VERSION, SESSION_TARGET_MINUTES } from "./types";

export type PlannedAsset = {
  slug: string;
  id: string;
  conceptId: string | null;
  pairId: string | null;
};

export function planAgencySession(assets: PlannedAsset[]): SessionDraft {
  const bySlug = new Map(assets.map((asset) => [asset.slug, asset]));
  const items: SessionItemDraft[] = [];

  for (const step of PHASE4_SESSION_STEPS) {
    const asset = bySlug.get(step.assetSlug);
    if (!asset) {
      throw new Error(`Planner is missing seeded asset ${step.assetSlug}. Run prisma db seed.`);
    }
    items.push({
      sortOrder: items.length,
      kind: step.kind,
      reasonCodes: [...step.reasonCodes],
      conceptId: asset.conceptId ?? undefined,
      assetId: asset.id,
    });
  }

  if (PHASE4_ASSETS.length !== PHASE4_SESSION_STEPS.length) {
    throw new Error("Every Phase 4 asset must appear once in the session steps.");
  }

  return {
    objective: "Agency: client vs customer, designated agency, and the two duty headings",
    targetMinutes: SESSION_TARGET_MINUTES,
    plannerVersion: PLANNER_VERSION,
    items,
  };
}
