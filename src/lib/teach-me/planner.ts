import type { SessionDraft, SessionItemDraft } from "@/lib/session";
import { PHASE4_ASSETS, PHASE4_SESSION_STEPS } from "./assets";
import { PHASE4_CH2_ASSETS, PHASE4_CH2_SESSION_STEPS } from "./chapter2-assets";
import { PHASE4_CH3_ASSETS, PHASE4_CH3_SESSION_STEPS } from "./chapter3-assets";
import { PHASE4_CH4_ASSETS, PHASE4_CH4_SESSION_STEPS } from "./chapter4-assets";
import { PHASE4_CH5_ASSETS, PHASE4_CH5_SESSION_STEPS } from "./chapter5-assets";
import { PHASE4_CH6_ASSETS, PHASE4_CH6_SESSION_STEPS } from "./chapter6-assets";
import {
  PLANNER_VERSION_CH1,
  PLANNER_VERSION_CH2,
  PLANNER_VERSION_CH3,
  PLANNER_VERSION_CH4,
  PLANNER_VERSION_CH5,
  PLANNER_VERSION_CH6,
  SESSION_TARGET_MINUTES,
  TEACH_ME_SITTINGS,
  type TeachMeSittingId,
} from "./types";

export type PlannedAsset = {
  slug: string;
  id: string;
  conceptId: string | null;
  pairId: string | null;
};

type SessionSteps =
  | typeof PHASE4_SESSION_STEPS
  | typeof PHASE4_CH2_SESSION_STEPS
  | typeof PHASE4_CH3_SESSION_STEPS
  | typeof PHASE4_CH4_SESSION_STEPS
  | typeof PHASE4_CH5_SESSION_STEPS
  | typeof PHASE4_CH6_SESSION_STEPS;

function planFromSteps(
  assets: PlannedAsset[],
  steps: SessionSteps,
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

/** Chapter 3 Agency Agreements sitting (`phase4-ch3-v1`). */
export function planChapter3Session(assets: PlannedAsset[]): SessionDraft {
  return planFromSteps(
    assets,
    PHASE4_CH3_SESSION_STEPS,
    PHASE4_CH3_ASSETS.length,
    "Agency Agreements: WB-1, WB-4, WB-36, protected buyer vs protected property",
    PLANNER_VERSION_CH3,
  );
}

/** Chapter 4 Disclosure Obligations sitting (`phase4-ch4-v1`). */
export function planChapter4Session(assets: PlannedAsset[]): SessionDraft {
  return planFromSteps(
    assets,
    PHASE4_CH4_SESSION_STEPS,
    PHASE4_CH4_ASSETS.length,
    "Disclosure: owner vs licensee duties, RECR, as-is, condo disclosure, environmental headings",
    PLANNER_VERSION_CH4,
  );
}

/** Chapter 5 Fair Housing sitting (`phase4-ch5-v1`). */
export function planChapter5Session(assets: PlannedAsset[]): SessionDraft {
  return planFromSteps(
    assets,
    PHASE4_CH5_SESSION_STEPS,
    PHASE4_CH5_ASSETS.length,
    "Fair Housing: protected classes, prohibited vs permissible, ADA, complaints, office procedures",
    PLANNER_VERSION_CH5,
  );
}

/** Chapter 6 Valuation sitting (`phase4-ch6-v1`). */
export function planChapter6Session(assets: PlannedAsset[]): SessionDraft {
  return planFromSteps(
    assets,
    PHASE4_CH6_SESSION_STEPS,
    PHASE4_CH6_ASSETS.length,
    "Valuation: market vs appraised value, principles of value, market data approach",
    PLANNER_VERSION_CH6,
  );
}

export type TeachMeProgress = {
  completedPlannerVersions: ReadonlySet<string>;
};

/**
 * Sequential sittings: Chapter N only after prior sittings are complete.
 * Open-session resume is handled in session.ts before this runs.
 */
export function selectTeachMeSitting(progress: TeachMeProgress): TeachMeSittingId {
  for (const sitting of TEACH_ME_SITTINGS) {
    if (!progress.completedPlannerVersions.has(sitting.plannerVersion)) {
      return sitting.id;
    }
  }
  return TEACH_ME_SITTINGS[TEACH_ME_SITTINGS.length - 1].id;
}

export function planTeachMeSitting(
  assets: PlannedAsset[],
  progress: TeachMeProgress,
): SessionDraft {
  const sitting = selectTeachMeSitting(progress);
  if (sitting === "chapter6") return planChapter6Session(assets);
  if (sitting === "chapter5") return planChapter5Session(assets);
  if (sitting === "chapter4") return planChapter4Session(assets);
  if (sitting === "chapter3") return planChapter3Session(assets);
  if (sitting === "chapter2") return planChapter2Session(assets);
  return planAgencySession(assets);
}
