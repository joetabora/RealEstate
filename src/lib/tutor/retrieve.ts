import type { PrismaClient } from "@prisma/client";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { formatPageCitation } from "@/lib/ingest/citation";
import type { TutorCitation } from "./types";

export type TutorContextHit = {
  kind: "concept" | "asset" | "section" | "learner";
  title: string;
  snippet: string;
  href: string;
};

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "is",
  "are",
  "what",
  "how",
  "why",
  "when",
  "where",
  "who",
  "with",
  "from",
  "about",
  "does",
  "do",
  "can",
  "i",
  "my",
  "me",
  "you",
  "vs",
  "versus",
]);

/** Extract searchable tokens from a tutor question (no embeddings). */
export function tokenizeTutorQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token))
    .slice(0, 8);
}

export function hitsToCitations(hits: readonly TutorContextHit[]): TutorCitation[] {
  return hits.map((hit) => ({ label: hit.title, href: hit.href }));
}

export function formatContextBlock(hits: readonly TutorContextHit[]): string {
  if (hits.length === 0) {
    return "No local course matches were found for this question.";
  }
  return hits
    .map(
      (hit, index) =>
        `${index + 1}. [${hit.kind}] ${hit.title}\n   ${hit.snippet}\n   link: ${hit.href}`,
    )
    .join("\n");
}

/**
 * Deterministic keyword retrieval over concepts, Teach Me assets, and library sections.
 * Not embeddings / RAG — citation pointers only.
 */
export async function retrieveTutorContext(input: {
  prisma: PrismaClient;
  query: string;
  editionSlug?: string;
  limit?: number;
}): Promise<TutorContextHit[]> {
  const tokens = tokenizeTutorQuery(input.query);
  if (tokens.length === 0) return [];

  const editionSlug = input.editionSlug ?? COURSE_EDITION_SEED.slug;
  const limit = input.limit ?? 5;
  const edition = await input.prisma.courseEdition.findUnique({
    where: { slug: editionSlug },
    select: { id: true },
  });
  if (!edition) return [];

  const hits: TutorContextHit[] = [];
  const seen = new Set<string>();

  const concepts = await input.prisma.concept.findMany({
    where: {
      editionId: edition.id,
      OR: tokens.flatMap((token) => [
        { name: { contains: token, mode: "insensitive" as const } },
        { slug: { contains: token, mode: "insensitive" as const } },
      ]),
    },
    include: {
      citations: { orderBy: { createdAt: "asc" }, take: 1 },
    },
    orderBy: [{ chapterNumber: "asc" }, { sortOrder: "asc" }],
    take: 8,
  });

  for (const concept of concepts) {
    const key = `concept:${concept.id}`;
    if (seen.has(key) || hits.length >= limit) continue;
    seen.add(key);
    const citation = concept.citations[0];
    const cite = citation
      ? formatPageCitation({
          printedPageStart: citation.printedPage,
          printedPageEnd: citation.printedPage,
          pdfPageStart: citation.pdfPage,
          pdfPageEnd: citation.pdfPage,
        })
      : "Uncited";
    hits.push({
      kind: "concept",
      title: concept.name,
      snippet: `Chapter ${concept.chapterNumber} · ${cite}`,
      href: `/concepts/${concept.slug}`,
    });
  }

  if (hits.length < limit) {
    const assets = await input.prisma.learningAsset.findMany({
      where: {
        editionId: edition.id,
        lifecycle: "active",
        OR: tokens.flatMap((token) => [
          { title: { contains: token, mode: "insensitive" as const } },
          { slug: { contains: token, mode: "insensitive" as const } },
        ]),
      },
      include: { concept: { select: { slug: true } } },
      orderBy: { sortOrder: "asc" },
      take: 6,
    });
    for (const asset of assets) {
      const key = `asset:${asset.id}`;
      if (seen.has(key) || hits.length >= limit) continue;
      seen.add(key);
      hits.push({
        kind: "asset",
        title: asset.title,
        snippet: `${asset.kind.replaceAll("_", " ")} · open Teach Me for the sitting that uses this asset`,
        href: asset.concept?.slug ? `/concepts/${asset.concept.slug}` : "/",
      });
    }
  }

  if (hits.length < limit) {
    const sections = await input.prisma.sourceSection.findMany({
      where: {
        document: { editionId: edition.id },
        OR: tokens.map((token) => ({
          heading: { contains: token, mode: "insensitive" as const },
        })),
      },
      include: { document: { select: { slug: true } } },
      orderBy: { sortOrder: "asc" },
      take: 6,
    });
    for (const section of sections) {
      const key = `section:${section.id}`;
      if (seen.has(key) || hits.length >= limit) continue;
      seen.add(key);
      hits.push({
        kind: "section",
        title: section.heading,
        snippet: formatPageCitation({
          printedPageStart: section.printedPageStart,
          printedPageEnd: section.printedPageEnd,
          pdfPageStart: section.pdfPageStart,
          pdfPageEnd: section.pdfPageEnd,
        }),
        href: `/library/${section.document.slug}/${section.id}`,
      });
    }
  }

  return hits.slice(0, limit);
}

/**
 * Learner-state lane: open mistakes + overdue review concepts (no mastery %).
 */
export async function retrieveLearnerStateContext(input: {
  prisma: PrismaClient;
  learnerId: string;
  now?: Date;
  limit?: number;
}): Promise<TutorContextHit[]> {
  const now = input.now ?? new Date();
  const limit = input.limit ?? 4;
  const hits: TutorContextHit[] = [];

  const openMistakes = await input.prisma.mistake.count({
    where: { learnerId: input.learnerId, resolvedAt: null },
  });
  if (openMistakes > 0) {
    hits.push({
      kind: "learner",
      title: `${openMistakes} open mistake${openMistakes === 1 ? "" : "s"}`,
      snippet: "Practice repair queue — open Mistakes for why-missed notes",
      href: "/mistakes",
    });
  }

  const overdue = await input.prisma.reviewSchedule.findMany({
    where: { learnerId: input.learnerId, dueAt: { lte: now } },
    orderBy: { dueAt: "asc" },
    take: Math.max(limit - hits.length, 0),
    include: { concept: { select: { name: true, slug: true, chapterNumber: true } } },
  });

  for (const row of overdue) {
    if (hits.length >= limit) break;
    hits.push({
      kind: "learner",
      title: `Overdue: ${row.concept.name}`,
      snippet: `Chapter ${row.concept.chapterNumber} · due ${row.dueAt.toISOString().slice(0, 10)}`,
      href: `/concepts/${row.concept.slug}`,
    });
  }

  if (overdue.length > 0 && hits.length < limit) {
    hits.push({
      kind: "learner",
      title: "Due review practice",
      snippet: "Cross-chapter MCQs for overdue SM-2 concepts",
      href: "/practice",
    });
  }

  return hits.slice(0, limit);
}

/** Merge learner-state hits ahead of keyword content hits. */
export async function buildTutorContext(input: {
  prisma: PrismaClient;
  learnerId: string;
  query: string;
}): Promise<TutorContextHit[]> {
  const [learnerHits, contentHits] = await Promise.all([
    retrieveLearnerStateContext({
      prisma: input.prisma,
      learnerId: input.learnerId,
      limit: 3,
    }),
    retrieveTutorContext({
      prisma: input.prisma,
      query: input.query,
      limit: 4,
    }),
  ]);

  const merged: TutorContextHit[] = [];
  const seen = new Set<string>();
  for (const hit of [...learnerHits, ...contentHits]) {
    const key = `${hit.kind}:${hit.href}:${hit.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(hit);
    if (merged.length >= 7) break;
  }
  return merged;
}
