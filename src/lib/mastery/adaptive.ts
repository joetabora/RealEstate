import type { PrismaClient } from "@prisma/client";
import type { SessionDraft, SessionItemDraft } from "@/lib/session";

export const ADAPTIVE_PREFIX_CAP = 3;

export type AdaptiveSignal =
  | { kind: "mistake"; conceptId: string; pairId: string | null }
  | { kind: "overdue"; conceptId: string }
  | { kind: "overconfidence"; conceptId: string; pairId: string | null };

export type AdaptiveAssetCandidate = {
  id: string;
  conceptId: string | null;
  pairId: string | null;
  kind: string;
};

/**
 * Collect deterministic adaptive targets for a chapter sitting.
 * Priority: open mistakes → overdue SM-2 cards → recent overconfidence misses.
 */
export async function collectAdaptiveSignals(input: {
  prisma: PrismaClient;
  learnerId: string;
  chapterNumber: number;
  now?: Date;
}): Promise<AdaptiveSignal[]> {
  const now = input.now ?? new Date();
  const chapterConcepts = await input.prisma.concept.findMany({
    where: { chapterNumber: input.chapterNumber },
    select: { id: true },
  });
  const chapterConceptIds = new Set(chapterConcepts.map((row) => row.id));
  if (chapterConceptIds.size === 0) return [];

  const signals: AdaptiveSignal[] = [];
  const seenConcepts = new Set<string>();

  const mistakes = await input.prisma.mistake.findMany({
    where: {
      learnerId: input.learnerId,
      resolvedAt: null,
      OR: [
        { conceptId: { in: [...chapterConceptIds] } },
        {
          pair: {
            OR: [
              { conceptAId: { in: [...chapterConceptIds] } },
              { conceptBId: { in: [...chapterConceptIds] } },
            ],
          },
        },
      ],
    },
    select: {
      conceptId: true,
      pairId: true,
      pair: { select: { conceptAId: true, conceptBId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  for (const row of mistakes) {
    const candidates = [
      row.conceptId,
      row.pair?.conceptAId,
      row.pair?.conceptBId,
    ].filter((id): id is string => typeof id === "string" && chapterConceptIds.has(id));
    const conceptId = candidates.find((id) => !seenConcepts.has(id));
    if (!conceptId) continue;
    seenConcepts.add(conceptId);
    signals.push({ kind: "mistake", conceptId, pairId: row.pairId });
  }

  const overdue = await input.prisma.reviewSchedule.findMany({
    where: {
      learnerId: input.learnerId,
      dueAt: { lte: now },
      conceptId: { in: [...chapterConceptIds] },
    },
    select: { conceptId: true },
    orderBy: { dueAt: "asc" },
    take: 20,
  });

  for (const row of overdue) {
    if (seenConcepts.has(row.conceptId)) continue;
    seenConcepts.add(row.conceptId);
    signals.push({ kind: "overdue", conceptId: row.conceptId });
  }

  const overconfident = await input.prisma.questionAttempt.findMany({
    where: {
      learnerId: input.learnerId,
      correct: false,
      errorCategory: "overconfidence",
      question: {
        OR: [
          { conceptId: { in: [...chapterConceptIds] } },
          {
            pair: {
              OR: [
                { conceptAId: { in: [...chapterConceptIds] } },
                { conceptBId: { in: [...chapterConceptIds] } },
              ],
            },
          },
        ],
      },
    },
    select: {
      question: {
        select: {
          conceptId: true,
          pairId: true,
          pair: { select: { conceptAId: true, conceptBId: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  for (const row of overconfident) {
    const candidates = [
      row.question.conceptId,
      row.question.pair?.conceptAId,
      row.question.pair?.conceptBId,
    ].filter((id): id is string => typeof id === "string" && chapterConceptIds.has(id));
    const conceptId = candidates.find((id) => !seenConcepts.has(id));
    if (!conceptId) continue;
    seenConcepts.add(conceptId);
    signals.push({
      kind: "overconfidence",
      conceptId,
      pairId: row.question.pairId,
    });
  }

  return signals;
}

export function pickAdaptiveRepairAssets(
  signals: readonly AdaptiveSignal[],
  assets: readonly AdaptiveAssetCandidate[],
  cap: number = ADAPTIVE_PREFIX_CAP,
): Array<{ asset: AdaptiveAssetCandidate; reasonCodes: string[] }> {
  const picks: Array<{ asset: AdaptiveAssetCandidate; reasonCodes: string[] }> = [];
  const usedAssetIds = new Set<string>();

  for (const signal of signals) {
    if (picks.length >= cap) break;
    const asset = matchAssetForSignal(signal, assets, usedAssetIds);
    if (!asset) continue;
    usedAssetIds.add(asset.id);
    picks.push({
      asset,
      reasonCodes: reasonCodesFor(signal),
    });
  }

  return picks;
}

function reasonCodesFor(signal: AdaptiveSignal): string[] {
  if (signal.kind === "mistake") return ["adaptive_mistake", "repair"];
  if (signal.kind === "overdue") return ["adaptive_overdue", "review"];
  return ["adaptive_overconfidence", "repair"];
}

function matchAssetForSignal(
  signal: AdaptiveSignal,
  assets: readonly AdaptiveAssetCandidate[],
  usedAssetIds: Set<string>,
): AdaptiveAssetCandidate | null {
  const available = assets.filter((asset) => !usedAssetIds.has(asset.id));
  if (available.length === 0) return null;

  if (signal.kind !== "overdue" && signal.pairId) {
    const pairComparison = available.find(
      (asset) => asset.pairId === signal.pairId && asset.kind === "comparison",
    );
    if (pairComparison) return pairComparison;
    const anyPair = available.find((asset) => asset.pairId === signal.pairId);
    if (anyPair) return anyPair;
  }

  const conceptComparison = available.find(
    (asset) => asset.conceptId === signal.conceptId && asset.kind === "comparison",
  );
  if (conceptComparison) return conceptComparison;

  const conceptAny = available.find((asset) => asset.conceptId === signal.conceptId);
  if (conceptAny) return conceptAny;

  return null;
}

/** Prepend adaptive repair/review items; renumber sortOrder. Dedupes by assetId. */
export function prependAdaptiveItems(
  draft: SessionDraft,
  picks: Array<{ asset: AdaptiveAssetCandidate; reasonCodes: string[] }>,
): SessionDraft {
  if (picks.length === 0) return draft;

  const existingAssetIds = new Set(
    draft.items.map((item) => item.assetId).filter((id): id is string => Boolean(id)),
  );

  const prefix: SessionItemDraft[] = [];
  for (const pick of picks) {
    if (existingAssetIds.has(pick.asset.id)) continue;
    prefix.push({
      sortOrder: prefix.length,
      kind: pick.reasonCodes.includes("adaptive_overdue") ? "review" : "repair",
      reasonCodes: pick.reasonCodes,
      conceptId: pick.asset.conceptId ?? undefined,
      assetId: pick.asset.id,
    });
  }

  if (prefix.length === 0) return draft;

  const items = [
    ...prefix,
    ...draft.items.map((item, index) => ({
      ...item,
      sortOrder: prefix.length + index,
    })),
  ];

  return {
    ...draft,
    objective: `${draft.objective} · adaptive repair prefix (${prefix.length})`,
    items,
  };
}

export async function buildAdaptiveTeachMeDraft(input: {
  prisma: PrismaClient;
  learnerId: string;
  chapterNumber: number;
  draft: SessionDraft;
  assets: readonly AdaptiveAssetCandidate[];
  now?: Date;
}): Promise<SessionDraft> {
  const signals = await collectAdaptiveSignals({
    prisma: input.prisma,
    learnerId: input.learnerId,
    chapterNumber: input.chapterNumber,
    now: input.now,
  });
  const picks = pickAdaptiveRepairAssets(signals, input.assets);
  return prependAdaptiveItems(input.draft, picks);
}
