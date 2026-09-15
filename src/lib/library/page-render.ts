import { access, mkdir } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import type { PrismaClient } from "@prisma/client";
import { getLocalPageRenderPath, getSourceMaterialPath } from "@/lib/db/env";

export function relativeRenderPath(documentSlug: string, pdfPage: number): string {
  const safeSlug = documentSlug.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return path.join(safeSlug, `p${pdfPage}.png`);
}

export function absoluteRenderPath(documentSlug: string, pdfPage: number): string {
  return path.join(getLocalPageRenderPath(), relativeRenderPath(documentSlug, pdfPage));
}

/**
 * Ensure a candidate path stays inside the local render root (no traversal).
 */
export function resolveSafeRenderFile(absolutePath: string): string | null {
  const root = path.resolve(getLocalPageRenderPath());
  const resolved = path.resolve(absolutePath);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    return null;
  }
  return resolved;
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

export async function findPdftoppm(): Promise<string | null> {
  return new Promise((resolve) => {
    const child = spawn("which", ["pdftoppm"]);
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

export async function runPdftoppm(input: {
  pdfPath: string;
  outputPrefix: string;
  pdfPage: number;
  pdftoppmPath: string;
}): Promise<void> {
  await mkdir(path.dirname(input.outputPrefix), { recursive: true });
  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      input.pdftoppmPath,
      [
        "-f",
        String(input.pdfPage),
        "-l",
        String(input.pdfPage),
        "-png",
        "-singlefile",
        input.pdfPath,
        input.outputPrefix,
      ],
      { stdio: "ignore" },
    );
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`pdftoppm exited with code ${code}`));
    });
  });
}

export type PageRenderResult = {
  assetId: string;
  documentSlug: string;
  pdfPage: number;
  status: "rendered" | "already_present" | "skipped_no_tool" | "skipped_missing_pdf" | "dry_run";
  relativePath: string | null;
};

/**
 * Rasterize pending OCR page assets locally with pdftoppm when available.
 * Never invents OCR text; only writes gitignored PNGs and updates filePath/status.
 */
export async function renderPendingOcrPages(input: {
  prisma: PrismaClient;
  limit?: number;
  dryRun?: boolean;
}): Promise<{ results: PageRenderResult[]; pdftoppm: string | null }> {
  const limit = input.limit ?? 20;
  const dryRun = input.dryRun ?? false;
  const sourceRoot = getSourceMaterialPath();
  const pdftoppm = await findPdftoppm();

  const assets = await input.prisma.sourceAsset.findMany({
    where: {
      kind: { in: ["page_render", "form_pdf_page"] },
      pdfPage: { not: null },
      OR: [{ filePath: null }, { filePath: "" }],
    },
    take: limit,
    orderBy: { createdAt: "asc" },
    include: {
      document: { select: { id: true, slug: true, relativePath: true } },
      anchors: { select: { id: true }, take: 5 },
    },
  });

  const results: PageRenderResult[] = [];

  for (const asset of assets) {
    const pdfPage = asset.pdfPage;
    if (pdfPage == null) continue;
    const relative = relativeRenderPath(asset.document.slug, pdfPage);
    const absolute = absoluteRenderPath(asset.document.slug, pdfPage);
    const pdfRelative = asset.document.relativePath;
    const pdfAbsolute = pdfRelative ? path.resolve(sourceRoot, pdfRelative) : null;

    if (await fileExists(absolute)) {
      if (!dryRun) {
        await markRenderReady(input.prisma, {
          assetId: asset.id,
          documentId: asset.document.id,
          pdfPage,
          relativePath: relative,
          anchorIds: asset.anchors.map((a) => a.id),
        });
      }
      results.push({
        assetId: asset.id,
        documentSlug: asset.document.slug,
        pdfPage,
        status: "already_present",
        relativePath: relative,
      });
      continue;
    }

    if (!pdfAbsolute || !(await fileExists(pdfAbsolute))) {
      results.push({
        assetId: asset.id,
        documentSlug: asset.document.slug,
        pdfPage,
        status: "skipped_missing_pdf",
        relativePath: null,
      });
      continue;
    }

    if (!pdftoppm) {
      results.push({
        assetId: asset.id,
        documentSlug: asset.document.slug,
        pdfPage,
        status: "skipped_no_tool",
        relativePath: null,
      });
      continue;
    }

    if (dryRun) {
      results.push({
        assetId: asset.id,
        documentSlug: asset.document.slug,
        pdfPage,
        status: "dry_run",
        relativePath: relative,
      });
      continue;
    }

    const outputPrefix = absolute.replace(/\.png$/i, "");
    await runPdftoppm({
      pdfPath: pdfAbsolute,
      outputPrefix,
      pdfPage,
      pdftoppmPath: pdftoppm,
    });
    await markRenderReady(input.prisma, {
      assetId: asset.id,
      documentId: asset.document.id,
      pdfPage,
      relativePath: relative,
      anchorIds: asset.anchors.map((a) => a.id),
    });
    results.push({
      assetId: asset.id,
      documentSlug: asset.document.slug,
      pdfPage,
      status: "rendered",
      relativePath: relative,
    });
  }

  return { results, pdftoppm };
}

async function markRenderReady(
  prisma: PrismaClient,
  input: {
    assetId: string;
    documentId: string;
    pdfPage: number;
    relativePath: string;
    anchorIds: string[];
  },
) {
  await prisma.sourceAsset.update({
    where: { id: input.assetId },
    data: {
      filePath: input.relativePath,
      mimeType: "image/png",
    },
  });
  await prisma.visualAnchor.updateMany({
    where: {
      OR: [
        { id: { in: input.anchorIds } },
        {
          pdfPage: input.pdfPage,
          section: { documentId: input.documentId, needsOcr: true },
        },
      ],
    },
    data: {
      assetId: input.assetId,
      ocrStatus: "render_queued",
      ocrNote:
        "Local page PNG recorded. OCR text not extracted — do not invent form/statute lines from the image alone.",
    },
  });
}
