import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { getSourceMaterialPath } from "@/lib/db/env";
import {
  inferChapterNumber,
  isDatedUpdatePath,
  isVideoFileName,
  titleFromVideoPath,
} from "./video";

export type CatalogVideoResult = {
  relativePath: string;
  status: "created" | "updated" | "unchanged" | "dry_run";
  chapterNumber: number | null;
  isDatedUpdate: boolean;
};

/**
 * Walk SOURCE_MATERIAL_PATH for video files and upsert VideoSource rows.
 * Does not transcribe. Does not invent Wisconsin facts.
 */
export async function catalogVideos(input: {
  prisma: PrismaClient;
  dryRun?: boolean;
}): Promise<{ results: CatalogVideoResult[]; root: string }> {
  const dryRun = input.dryRun ?? false;
  const root = getSourceMaterialPath();
  const edition = await input.prisma.courseEdition.findUnique({
    where: { slug: COURSE_EDITION_SEED.slug },
  });
  if (!edition) {
    throw new Error("Course edition missing. Run seed first.");
  }

  const files = await walkVideos(root);
  const results: CatalogVideoResult[] = [];

  for (const absolute of files) {
    const relativePath = path.relative(root, absolute).split(path.sep).join("/");
    const fileName = path.basename(absolute);
    const title = titleFromVideoPath(relativePath);
    const chapterNumber = inferChapterNumber(relativePath);
    const isDatedUpdate = isDatedUpdatePath(relativePath);
    let byteSize: bigint | null = null;
    try {
      const stat = await fs.stat(absolute);
      byteSize = BigInt(stat.size);
    } catch {
      byteSize = null;
    }

    if (dryRun) {
      results.push({
        relativePath,
        status: "dry_run",
        chapterNumber,
        isDatedUpdate,
      });
      continue;
    }

    const existing = await input.prisma.videoSource.findUnique({
      where: {
        editionId_relativePath: {
          editionId: edition.id,
          relativePath,
        },
      },
    });

    if (!existing) {
      await input.prisma.videoSource.create({
        data: {
          editionId: edition.id,
          relativePath,
          fileName,
          title,
          chapterNumber,
          isDatedUpdate,
          transcriptStatus: "pending",
          byteSize: byteSize ?? undefined,
        },
      });
      results.push({ relativePath, status: "created", chapterNumber, isDatedUpdate });
      continue;
    }

    await input.prisma.videoSource.update({
      where: { id: existing.id },
      data: {
        fileName,
        title,
        chapterNumber,
        isDatedUpdate,
        byteSize: byteSize ?? undefined,
      },
    });
    results.push({
      relativePath,
      status: "updated",
      chapterNumber,
      isDatedUpdate,
    });
  }

  return { results, root };
}

async function walkVideos(root: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(dir: string) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
        await walk(full);
      } else if (entry.isFile() && isVideoFileName(entry.name)) {
        out.push(full);
      }
    }
  }
  await walk(root);
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

/** Stable short id for transcript sidecar filenames (not a security hash). */
export function transcriptSidecarSlug(relativePath: string): string {
  return createHash("sha1").update(relativePath).digest("hex").slice(0, 12);
}
