import { spawn } from "node:child_process";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import { getLocalPageRenderPath } from "@/lib/db/env";
import { fileExists, resolveSafeRenderFile } from "./page-render";

export async function findTesseract(): Promise<string | null> {
  return new Promise((resolve) => {
    const child = spawn("which", ["tesseract"]);
    let out = "";
    child.stdout.on("data", (chunk) => {
      out += String(chunk);
    });
    child.on("close", (code) => {
      if (code === 0 && out.trim()) resolve(out.trim());
      else resolve(null);
    });
    child.on("error", () => resolve(null));
  });
}

export async function runTesseract(input: {
  tesseractPath: string;
  imagePath: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(input.tesseractPath, [input.imagePath, "stdout", "-l", "eng"], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(stderr.trim() || `tesseract exited with code ${code}`));
    });
  });
}

export function normalizeOcrText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export type OcrTextResult = {
  anchorId: string;
  documentSlug: string;
  pdfPage: number;
  status: "ocr_complete" | "already_complete" | "skipped_no_tool" | "skipped_no_image" | "dry_run";
  charCount: number;
};

/**
 * Run local Tesseract on anchors that already have a page render.
 * Stored text is always ocrVerified=false / needs_verification — never Teach Me truth.
 */
export async function ocrRenderedPages(input: {
  prisma: PrismaClient;
  limit?: number;
  dryRun?: boolean;
}): Promise<{ results: OcrTextResult[]; tesseract: string | null }> {
  const limit = input.limit ?? 20;
  const dryRun = input.dryRun ?? false;
  const tesseract = await findTesseract();
  const renderRoot = getLocalPageRenderPath();

  const anchors = await input.prisma.visualAnchor.findMany({
    where: {
      ocrStatus: { in: ["render_queued", "complete"] },
      asset: {
        filePath: { not: null },
        kind: { in: ["page_render", "form_pdf_page"] },
      },
      OR: [{ ocrText: null }, { ocrText: "" }],
    },
    take: limit,
    orderBy: { updatedAt: "asc" },
    include: {
      asset: { select: { filePath: true } },
      section: { select: { document: { select: { slug: true } } } },
    },
  });

  const results: OcrTextResult[] = [];

  for (const anchor of anchors) {
    const documentSlug = anchor.section?.document.slug ?? "unknown";
    const relative = anchor.asset?.filePath;
    if (!relative) {
      results.push({
        anchorId: anchor.id,
        documentSlug,
        pdfPage: anchor.pdfPage,
        status: "skipped_no_image",
        charCount: 0,
      });
      continue;
    }

    if (anchor.ocrText && anchor.ocrText.trim().length > 0) {
      results.push({
        anchorId: anchor.id,
        documentSlug,
        pdfPage: anchor.pdfPage,
        status: "already_complete",
        charCount: anchor.ocrText.length,
      });
      continue;
    }

    const absolute = path.join(renderRoot, relative);
    const safe = resolveSafeRenderFile(absolute);
    if (!safe || !(await fileExists(safe))) {
      results.push({
        anchorId: anchor.id,
        documentSlug,
        pdfPage: anchor.pdfPage,
        status: "skipped_no_image",
        charCount: 0,
      });
      continue;
    }

    if (!tesseract) {
      results.push({
        anchorId: anchor.id,
        documentSlug,
        pdfPage: anchor.pdfPage,
        status: "skipped_no_tool",
        charCount: 0,
      });
      continue;
    }

    if (dryRun) {
      results.push({
        anchorId: anchor.id,
        documentSlug,
        pdfPage: anchor.pdfPage,
        status: "dry_run",
        charCount: 0,
      });
      continue;
    }

    const raw = await runTesseract({ tesseractPath: tesseract, imagePath: safe });
    const text = normalizeOcrText(raw);
    await input.prisma.visualAnchor.update({
      where: { id: anchor.id },
      data: {
        ocrText: text || null,
        ocrVerified: false,
        ocrStatus: "complete",
        ocrNote:
          "Local Tesseract dump only. needs_verification — not Wisconsin course truth and not used by Teach Me.",
      },
    });
    results.push({
      anchorId: anchor.id,
      documentSlug,
      pdfPage: anchor.pdfPage,
      status: "ocr_complete",
      charCount: text.length,
    });
  }

  return { results, tesseract };
}
