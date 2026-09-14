import type { PrismaClient } from "@prisma/client";
import { resolveCitedSectionId } from "@/lib/knowledge/seed";
import { citationsForAsset, PHASE4_ASSETS, pairKeyForAsset } from "./assets";
import { PHASE4_CH2_ASSETS } from "./chapter2-assets";
import { PHASE4_CH3_ASSETS } from "./chapter3-assets";
import { PHASE4_CH4_ASSETS } from "./chapter4-assets";
import { PHASE4_CH5_ASSETS } from "./chapter5-assets";
import { PHASE4_CH6_ASSETS } from "./chapter6-assets";
import { PHASE4_CH7_ASSETS } from "./chapter7-assets";
import { PHASE4_CH8_ASSETS } from "./chapter8-assets";
import { PHASE4_CH9_ASSETS } from "./chapter9-assets";
import type { AssetSeed } from "./assets";

const ALL_TEACH_ME_ASSETS: readonly AssetSeed[] = [
  ...PHASE4_ASSETS,
  ...PHASE4_CH2_ASSETS,
  ...PHASE4_CH3_ASSETS,
  ...PHASE4_CH4_ASSETS,
  ...PHASE4_CH5_ASSETS,
  ...PHASE4_CH6_ASSETS,
  ...PHASE4_CH7_ASSETS,
  ...PHASE4_CH8_ASSETS,
  ...PHASE4_CH9_ASSETS,
];

export async function seedPhase4(prisma: PrismaClient, editionId: string) {
  const catalogSlugs = ALL_TEACH_ME_ASSETS.map((asset) => asset.slug);
  const concepts = await prisma.concept.findMany({
    where: { editionId },
    select: { id: true, slug: true },
  });
  const conceptIds = new Map(concepts.map((row) => [row.slug, row.id]));

  const pairs = await prisma.confusionPair.findMany({
    where: { editionId, active: true },
    select: { id: true, canonicalKey: true },
  });
  const pairIds = new Map(pairs.map((row) => [row.canonicalKey, row.id]));

  const assetIds = new Map<string, string>();

  for (const [index, seed] of ALL_TEACH_ME_ASSETS.entries()) {
    const conceptId = seed.conceptSlug ? conceptIds.get(seed.conceptSlug) ?? null : null;
    if (seed.conceptSlug && !conceptId) {
      throw new Error(`Concept ${seed.conceptSlug} is missing. Seed knowledge catalogs first.`);
    }

    const pairKey = pairKeyForAsset(seed);
    const pairId = pairKey ? pairIds.get(pairKey) ?? null : null;
    if (pairKey && !pairId) {
      throw new Error(`Confusion pair ${pairKey} is missing. Seed knowledge catalogs first.`);
    }

    const row = await prisma.learningAsset.upsert({
      where: {
        editionId_slug: {
          editionId,
          slug: seed.slug,
        },
      },
      create: {
        editionId,
        slug: seed.slug,
        kind: seed.kind,
        informationClass: seed.informationClass,
        lifecycle: "active",
        conceptId,
        pairId,
        title: seed.title,
        body: seed.body,
        sortOrder: index + 1,
      },
      update: {
        kind: seed.kind,
        informationClass: seed.informationClass,
        lifecycle: "active",
        conceptId,
        pairId,
        title: seed.title,
        body: seed.body,
        sortOrder: index + 1,
      },
    });
    assetIds.set(seed.slug, row.id);

    await prisma.assetCitation.deleteMany({ where: { assetId: row.id } });
    for (const citation of citationsForAsset(seed)) {
      const sectionId = await resolveCitedSectionId(prisma, citation);
      await prisma.assetCitation.create({
        data: {
          assetId: row.id,
          sectionId,
          documentSlug: citation.documentSlug,
          heading: citation.heading,
          pdfPage: citation.pdfPage,
          printedPage: citation.printedPage ?? null,
          layer: citation.layer,
        },
      });
    }
  }

  await prisma.learningAsset.deleteMany({
    where: {
      editionId,
      slug: { notIn: catalogSlugs },
    },
  });

  return { assetCount: assetIds.size };
}
