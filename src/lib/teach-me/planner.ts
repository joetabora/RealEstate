import type { SessionDraft, SessionItemDraft } from "@/lib/session";
import { PHASE4_ASSETS, PHASE4_SESSION_STEPS } from "./assets";
import { PHASE4_CH2_ASSETS, PHASE4_CH2_SESSION_STEPS } from "./chapter2-assets";
import {
  PLANNER_VERSION_CH1,
  PLANNER_VERSION_CH2,
  SESSION_TARGET_MINUTES,
} from "./types";

export type PlannedAsset = {
  slug: string;
  id: string;
  conceptId: string | null;
  pairId: string | null;
};

function planFromSteps(
  assets: PlannedAsset[],
  steps: typeof PHASE4_SESSION_STEPS | typeof PHASE4_CH2_SESSION_STEPS,
  catalogLength: number,
  objective: string,
  plannerVersion: string,
): SessionDraft {
  const bySlug = new Map(assets.map((asset) => [asset.slug, asset]));
  const items: SessionItemDraft[] = [];

  for (const step of steps) {
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

  if (catalogLength !== steps.length) {
    throw new Error("Every sitting asset must appear once in the session steps.");
  }

  return {
    objective,
    targetMinutes: SESSION_TARGET_MINUTES,
    plannerVersion,
    items,
  };
}

/** Chapter 1 Agency Relationships sitting (`phase4-agency-v1`). */
export function planAgencySession(assets: PlannedAsset[]): SessionDraft {
  return planFromSteps(
    assets,
    PHASE4_SESSION_STEPS,
    PHASE4_ASSETS.length,
    "Agency: client vs customer, designated agency, and the two duty headings",
    PLANNER_VERSION_CH1,
  );
}

/** Chapter 2 Agency Issues sitting (`phase4-ch2-v1`). */
export function planChapter2Session(assets: PlannedAsset[]): SessionDraft {
  return planFromSteps(
    assets,
    PHASE4_CH2_SESSION_STEPS,
    PHASE4_CH2_ASSETS.length,
    "Agency Issues: listing types, buyer agency, commission, antitrust, and payment headings",
    PLANNER_VERSION_CH2,
  );
}

/**
 * Sequential sittings: Chapter 2 only after a completed Chapter 1 sitting.
 * Open-session resume is handled in session.ts before this runs.
 */
export function selectTeachMeSitting(chapter1Complete: boolean): "chapter1" | "chapter2" {
  return chapter1Complete ? "chapter2" : "chapter1";
}

export function planTeachMeSitting(
  assets: PlannedAsset[],
  chapter1Complete: boolean,
): SessionDraft {
  return selectTeachMeSitting(chapter1Complete) === "chapter2"
    ? planChapter2Session(assets)
    : planAgencySession(assets);
}
