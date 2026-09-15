import type { PrismaClient } from "@prisma/client";
import { resolveCitedSectionId } from "@/lib/knowledge/seed";
import type { DraftTarget, QuestionDraft } from "./types";

export async function persistGeneratedQuestion(
  prisma: PrismaClient,
  input: {
    editionId: string;
    target: DraftTarget;
    draft: QuestionDraft;
    sortOrder: number;
  },
): Promise<{ id: string; slug: string; lifecycle: string }> {
  const slug = buildDraftSlug(input.target);
  const examCodes = uniqueCodes([
    ...input.target.conceptA.examCategoryCodes,
    ...input.target.conceptB.examCategoryCodes,
  ]);

  const categories = await prisma.examCategory.findMany({
    where: { editionId: input.editionId, code: { in: examCodes } },
    select: { id: true, code: true },
  });
  const categoryIds = categories.map((c) => c.id);

  const conceptCitations = await prisma.conceptCitation.findMany({
    where: {
      conceptId: { in: [input.target.conceptA.id, input.target.conceptB.id] },
    },
    orderBy: { pdfPage: "asc" },
  });

  const seen = new Set<string>();
  const citations = [];
  for (const citation of conceptCitations) {
    const key = `${citation.documentSlug}|${citation.heading}|${citation.pdfPage}`;
    if (seen.has(key)) continue;
    seen.add(key);
    citations.push(citation);
    if (citations.length >= 4) break;
  }
  if (citations.length === 0) {
    throw new Error(`No citations available for pair ${input.target.canonicalKey}.`);
  }

  const question = await prisma.question.create({
    data: {
      editionId: input.editionId,
      slug,
      kind: "mcq",
      informationClass: input.draft.informationClass,
      lifecycle: "generated",
      chapterNumber: input.target.chapterNumber,
      stem: input.draft.stem,
      remediationWhyMissed: input.draft.remediationWhyMissed,
      remediationDistinction: input.draft.remediationDistinction,
      conceptId: input.target.conceptA.id,
      pairId: input.target.pairId,
      sortOrder: input.sortOrder,
      options: {
        create: input.draft.options.map((option, index) => ({
          key: option.key,
          body: option.body,
          isCorrect: option.isCorrect,
          sortOrder: index + 1,
        })),
      },
      examCategories: {
        create: categoryIds.map((examCategoryId) => ({ examCategoryId })),
      },
    },
  });

  for (const citation of citations) {
    const sectionId = await resolveCitedSectionId(prisma, {
      documentSlug: citation.documentSlug,
      heading: citation.heading,
      chapterNumber: input.target.chapterNumber,
    });

    await prisma.questionCitation.create({
      data: {
        questionId: question.id,
        sectionId,
        documentSlug: citation.documentSlug,
        heading: citation.heading,
        pdfPage: citation.pdfPage,
        printedPage: citation.printedPage,
        layer: citation.layer,
      },
    });
  }

  return { id: question.id, slug: question.slug, lifecycle: question.lifecycle };
}

function buildDraftSlug(target: DraftTarget): string {
  const key = target.canonicalKey
    .replace(/\|/g, "--")
    .replace(/[^a-z0-9-]/gi, "")
    .slice(0, 48);
  const n = target.existingDraftCount + 1;
  const stamp = Date.now().toString(36).slice(-4);
  return `gen-${key}-v${n}-${stamp}`.toLowerCase();
}

function uniqueCodes(codes: string[]): string[] {
  return [...new Set(codes.filter(Boolean))];
}
