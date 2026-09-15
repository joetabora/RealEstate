import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import { getLocalClassMissPath } from "@/lib/db/env";
import { normalizeOcrText, runTesseract, findTesseract } from "@/lib/library/tesseract";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export function extensionForMime(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/heic" || mimeType === "image/heif") return "heic";
  return "jpg";
}

export function resolveSafeClassMissFile(absolutePath: string): string | null {
  const root = path.resolve(getLocalClassMissPath());
  const resolved = path.resolve(absolutePath);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    return null;
  }
  return resolved;
}

export type ClassMissCaptureView = {
  id: string;
  createdAt: string;
  note: string | null;
  status: string;
  mimeType: string;
  imageHref: string;
  ocrText: string | null;
  ocrVerified: boolean;
  conceptSlug: string | null;
  conceptName: string | null;
};

/**
 * Persist a class-miss photo locally. Optional Tesseract dump is always unverified.
 * Never invents Wisconsin facts or creates Teach Me / Question rows from the image.
 */
export async function createClassMissCapture(input: {
  prisma: PrismaClient;
  learnerId: string;
  bytes: Uint8Array;
  mimeType: string;
  note?: string | null;
  conceptId?: string | null;
  runOcr?: boolean;
}): Promise<ClassMissCaptureView> {
  const mimeType = input.mimeType.toLowerCase();
  if (!ALLOWED_MIME.has(mimeType)) {
    throw new Error("Unsupported image type. Use JPEG, PNG, or WebP.");
  }
  if (input.bytes.byteLength === 0) {
    throw new Error("Empty image upload.");
  }
  if (input.bytes.byteLength > 12 * 1024 * 1024) {
    throw new Error("Image too large (max 12MB).");
  }

  const id = randomUUID();
  const relative = path.join(input.learnerId, `${id}.${extensionForMime(mimeType)}`);
  const absolute = path.join(getLocalClassMissPath(), relative);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, input.bytes);

  let ocrText: string | null = null;
  if (input.runOcr !== false) {
    const tesseract = await findTesseract();
    if (tesseract && (mimeType === "image/jpeg" || mimeType === "image/png" || mimeType === "image/webp")) {
      try {
        const raw = await runTesseract({ tesseractPath: tesseract, imagePath: absolute });
        ocrText = normalizeOcrText(raw) || null;
      } catch {
        ocrText = null;
      }
    }
  }

  const row = await input.prisma.classMissCapture.create({
    data: {
      id,
      learnerId: input.learnerId,
      filePath: relative,
      mimeType,
      note: input.note?.trim() || null,
      status: "needs_review",
      ocrText,
      ocrVerified: false,
      conceptId: input.conceptId ?? null,
    },
    include: { concept: { select: { slug: true, name: true } } },
  });

  return toCaptureView(row);
}

export function toCaptureView(row: {
  id: string;
  createdAt: Date;
  note: string | null;
  status: string;
  mimeType: string;
  ocrText: string | null;
  ocrVerified: boolean;
  concept: { slug: string; name: string } | null;
}): ClassMissCaptureView {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    note: row.note,
    status: row.status,
    mimeType: row.mimeType,
    imageHref: `/api/mistakes/class-miss/${row.id}`,
    ocrText: row.ocrText,
    ocrVerified: row.ocrVerified,
    conceptSlug: row.concept?.slug ?? null,
    conceptName: row.concept?.name ?? null,
  };
}

export async function listClassMissCaptures(input: {
  prisma: PrismaClient;
  learnerId: string;
  take?: number;
}): Promise<ClassMissCaptureView[]> {
  const rows = await input.prisma.classMissCapture.findMany({
    where: {
      learnerId: input.learnerId,
      status: { not: "discarded" },
    },
    orderBy: { createdAt: "desc" },
    take: input.take ?? 30,
    include: { concept: { select: { slug: true, name: true } } },
  });
  return rows.map(toCaptureView);
}
