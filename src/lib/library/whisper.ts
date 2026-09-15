import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import { COURSE_EDITION_SEED } from "@/lib/blueprint";
import { getLocalTranscriptPath, getSourceMaterialPath } from "@/lib/db/env";
import { transcriptSidecarSlug } from "./catalog-videos";
import { transcriptNoteForComplete } from "./video";

export async function findWhisper(): Promise<string | null> {
  return new Promise((resolve) => {
    const child = spawn("which", ["whisper"]);
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

export function getWhisperModel(): string {
  return process.env.WHISPER_MODEL?.trim() || "tiny";
}

export type TranscriptRunResult = {
  id: string;
  relativePath: string;
  status:
    | "transcribed"
    | "already_complete"
    | "skipped_no_tool"
    | "skipped_missing_file"
    | "dry_run"
    | "failed";
  charCount: number;
  note?: string;
};

/**
 * Run local Whisper on pending VideoSource rows.
 * Prefer dated-update / smaller files first. Default limit is 1 (Architecture Lock:
 * do not gate on full 17h transcription).
 * Dumps are always transcriptVerified=false / needs_verification.
 */
export async function transcribePendingVideos(input: {
  prisma: PrismaClient;
  limit?: number;
  dryRun?: boolean;
}): Promise<{ results: TranscriptRunResult[]; whisper: string | null; model: string }> {
  const limit = Math.min(Math.max(input.limit ?? 1, 1), 5);
  const dryRun = input.dryRun ?? false;
  const whisper = await findWhisper();
  const model = getWhisperModel();
  const sourceRoot = getSourceMaterialPath();
  const transcriptRoot = getLocalTranscriptPath();

  const edition = await input.prisma.courseEdition.findUnique({
    where: { slug: COURSE_EDITION_SEED.slug },
  });
  if (!edition) {
    throw new Error("Course edition missing. Run seed first.");
  }

  const pending = await input.prisma.videoSource.findMany({
    where: {
      editionId: edition.id,
      transcriptStatus: { in: ["pending", "skipped_no_tool"] },
      OR: [{ transcriptText: null }, { transcriptText: "" }],
    },
    orderBy: [{ isDatedUpdate: "desc" }, { byteSize: "asc" }, { relativePath: "asc" }],
    take: limit,
  });

  const results: TranscriptRunResult[] = [];

  if (!whisper) {
    for (const row of pending) {
      if (!dryRun) {
        await input.prisma.videoSource.update({
          where: { id: row.id },
          data: {
            transcriptStatus: "skipped_no_tool",
            transcriptNote: "whisper CLI not found (brew install openai-whisper)",
            transcriptVerified: false,
          },
        });
      }
      results.push({
        id: row.id,
        relativePath: row.relativePath,
        status: "skipped_no_tool",
        charCount: 0,
      });
    }
    return { results, whisper: null, model };
  }

  await fs.mkdir(transcriptRoot, { recursive: true });

  for (const row of pending) {
    const absolute = path.resolve(sourceRoot, row.relativePath);
    if (!absolute.startsWith(path.resolve(sourceRoot) + path.sep) && absolute !== path.resolve(sourceRoot)) {
      results.push({
        id: row.id,
        relativePath: row.relativePath,
        status: "failed",
        charCount: 0,
        note: "path escape blocked",
      });
      continue;
    }

    let exists = false;
    try {
      await fs.access(absolute);
      exists = true;
    } catch {
      exists = false;
    }
    if (!exists) {
      if (!dryRun) {
        await input.prisma.videoSource.update({
          where: { id: row.id },
          data: {
            transcriptStatus: "unavailable",
            transcriptNote: "Video file missing under SOURCE_MATERIAL_PATH",
            transcriptVerified: false,
          },
        });
      }
      results.push({
        id: row.id,
        relativePath: row.relativePath,
        status: "skipped_missing_file",
        charCount: 0,
      });
      continue;
    }

    if (dryRun) {
      results.push({
        id: row.id,
        relativePath: row.relativePath,
        status: "dry_run",
        charCount: 0,
      });
      continue;
    }

    const slug = transcriptSidecarSlug(row.relativePath);
    const outDir = path.join(transcriptRoot, slug);
    try {
      await fs.mkdir(outDir, { recursive: true });
      const text = await runWhisper({
        whisperPath: whisper,
        videoPath: absolute,
        outputDir: outDir,
        model,
      });
      const normalized = normalizeTranscript(text);
      const sidecar = path.join(outDir, `${slug}.txt`);
      await fs.writeFile(sidecar, normalized, "utf8");
      const relativeSidecar = path.relative(transcriptRoot, sidecar).split(path.sep).join("/");

      await input.prisma.videoSource.update({
        where: { id: row.id },
        data: {
          transcriptStatus: "complete",
          transcriptText: normalized,
          transcriptVerified: false,
          transcriptNote: transcriptNoteForComplete(),
          transcriptFilePath: relativeSidecar,
        },
      });

      results.push({
        id: row.id,
        relativePath: row.relativePath,
        status: "transcribed",
        charCount: normalized.length,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "whisper failed";
      await input.prisma.videoSource.update({
        where: { id: row.id },
        data: {
          transcriptStatus: "pending",
          transcriptNote: `whisper failed: ${message.slice(0, 200)}`,
          transcriptVerified: false,
        },
      });
      results.push({
        id: row.id,
        relativePath: row.relativePath,
        status: "failed",
        charCount: 0,
        note: message.slice(0, 120),
      });
    }
  }

  return { results, whisper, model };
}

export function normalizeTranscript(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function runWhisper(input: {
  whisperPath: string;
  videoPath: string;
  outputDir: string;
  model: string;
}): Promise<string> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      input.whisperPath,
      [
        input.videoPath,
        "--model",
        input.model,
        "--output_format",
        "txt",
        "--output_dir",
        input.outputDir,
        "--fp16",
        "False",
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.trim().slice(0, 400) || `whisper exited ${code}`));
    });
  });

  const entries = await fs.readdir(input.outputDir);
  const txt = entries.find((name) => name.toLowerCase().endsWith(".txt"));
  if (!txt) {
    throw new Error("Whisper produced no .txt output");
  }
  return fs.readFile(path.join(input.outputDir, txt), "utf8");
}
