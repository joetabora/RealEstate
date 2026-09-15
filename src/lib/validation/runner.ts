import type { PrismaClient } from "@prisma/client";
import {
  lifecycleAfterPassingGate,
  nextGateForLifecycle,
  runAssetGate,
  runQuestionGate,
  type ContentGate,
  type ContentLifecycle,
  type GateResult,
} from "./gates";

export type AdvanceResult = {
  targetKind: "question" | "learning_asset";
  targetId: string;
  fromLifecycle: string;
  toLifecycle: string;
  gate: ContentGate | null;
  result: GateResult | null;
};

async function recordEvent(
  prisma: PrismaClient,
  input: {
    targetKind: "question" | "learning_asset";
    targetId: string;
    gate: string;
    fromLifecycle: string;
    toLifecycle: string;
    passed: boolean;
    reasons: string[];
  },
) {
  await prisma.contentGateEvent.create({
    data: {
      targetKind: input.targetKind,
      targetId: input.targetId,
      gate: input.gate,
      fromLifecycle: input.fromLifecycle,
      toLifecycle: input.toLifecycle,
      passed: input.passed,
      reasons: input.reasons,
    },
  });
}

export async function advanceQuestionGate(
  prisma: PrismaClient,
  questionId: string,
): Promise<AdvanceResult> {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      options: { orderBy: { sortOrder: "asc" } },
      citations: true,
    },
  });
  if (!question) throw new Error("Question not found.");

  const from = question.lifecycle;
  if (from === "active" || from === "validated" || from === "rejected") {
    return {
      targetKind: "question",
      targetId: questionId,
      fromLifecycle: from,
      toLifecycle: from,
      gate: null,
      result: null,
    };
  }

  const gate = nextGateForLifecycle(from);
  if (!gate) {
    return {
      targetKind: "question",
      targetId: questionId,
      fromLifecycle: from,
      toLifecycle: from,
      gate: null,
      result: null,
    };
  }

  const result = runQuestionGate(gate, {
    stem: question.stem,
    informationClass: question.informationClass,
    remediationWhyMissed: question.remediationWhyMissed,
    remediationDistinction: question.remediationDistinction,
    citationCount: question.citations.length,
    options: question.options.map((o) => ({
      key: o.key,
      body: o.body,
      isCorrect: o.isCorrect,
    })),
  });

  const toLifecycle: ContentLifecycle = result.passed
    ? lifecycleAfterPassingGate(gate)
    : "rejected";

  await prisma.question.update({
    where: { id: questionId },
    data: { lifecycle: toLifecycle },
  });
  await recordEvent(prisma, {
    targetKind: "question",
    targetId: questionId,
    gate,
    fromLifecycle: from,
    toLifecycle,
    passed: result.passed,
    reasons: result.reasons,
  });

  return {
    targetKind: "question",
    targetId: questionId,
    fromLifecycle: from,
    toLifecycle,
    gate,
    result,
  };
}

export async function advanceAssetGate(
  prisma: PrismaClient,
  assetId: string,
): Promise<AdvanceResult> {
  const asset = await prisma.learningAsset.findUnique({
    where: { id: assetId },
    include: { citations: true },
  });
  if (!asset) throw new Error("Learning asset not found.");

  const from = asset.lifecycle;
  if (from === "active" || from === "validated" || from === "rejected") {
    return {
      targetKind: "learning_asset",
      targetId: assetId,
      fromLifecycle: from,
      toLifecycle: from,
      gate: null,
      result: null,
    };
  }

  const gate = nextGateForLifecycle(from);
  if (!gate) {
    return {
      targetKind: "learning_asset",
      targetId: assetId,
      fromLifecycle: from,
      toLifecycle: from,
      gate: null,
      result: null,
    };
  }

  const result = runAssetGate(gate, {
    title: asset.title,
    body: asset.body,
    kind: asset.kind,
    informationClass: asset.informationClass,
    citationCount: asset.citations.length,
  });

  const toLifecycle: ContentLifecycle = result.passed
    ? lifecycleAfterPassingGate(gate)
    : "rejected";

  await prisma.learningAsset.update({
    where: { id: assetId },
    data: { lifecycle: toLifecycle },
  });
  await recordEvent(prisma, {
    targetKind: "learning_asset",
    targetId: assetId,
    gate,
    fromLifecycle: from,
    toLifecycle,
    passed: result.passed,
    reasons: result.reasons,
  });

  return {
    targetKind: "learning_asset",
    targetId: assetId,
    fromLifecycle: from,
    toLifecycle,
    gate,
    result,
  };
}

/** Run gates until validated, rejected, or stuck. Does not auto-activate. */
export async function runQuestionPipeline(
  prisma: PrismaClient,
  questionId: string,
  maxSteps = 8,
): Promise<AdvanceResult[]> {
  const steps: AdvanceResult[] = [];
  for (let i = 0; i < maxSteps; i += 1) {
    const step = await advanceQuestionGate(prisma, questionId);
    steps.push(step);
    if (!step.gate || !step.result?.passed || step.toLifecycle === "validated") break;
    if (step.toLifecycle === "rejected") break;
  }
  return steps;
}

export async function activateValidatedQuestion(
  prisma: PrismaClient,
  questionId: string,
): Promise<void> {
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) throw new Error("Question not found.");
  if (question.lifecycle !== "validated") {
    throw new Error("Only validated questions can be activated for Teach Me / Practice.");
  }
  await prisma.question.update({
    where: { id: questionId },
    data: { lifecycle: "active" },
  });
  await recordEvent(prisma, {
    targetKind: "question",
    targetId: questionId,
    gate: "activate",
    fromLifecycle: "validated",
    toLifecycle: "active",
    passed: true,
    reasons: [],
  });
}

export async function activateValidatedAsset(
  prisma: PrismaClient,
  assetId: string,
): Promise<void> {
  const asset = await prisma.learningAsset.findUnique({ where: { id: assetId } });
  if (!asset) throw new Error("Learning asset not found.");
  if (asset.lifecycle !== "validated") {
    throw new Error("Only validated assets can be activated for Teach Me.");
  }
  await prisma.learningAsset.update({
    where: { id: assetId },
    data: { lifecycle: "active" },
  });
  await recordEvent(prisma, {
    targetKind: "learning_asset",
    targetId: assetId,
    gate: "activate",
    fromLifecycle: "validated",
    toLifecycle: "active",
    passed: true,
    reasons: [],
  });
}
