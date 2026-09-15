export const TRANSCRIPT_STATUSES = [
  "pending",
  "complete",
  "unavailable",
  "skipped_no_tool",
] as const;

export type TranscriptStatus = (typeof TRANSCRIPT_STATUSES)[number];

export const TRANSCRIPT_STATUS_LABELS: Record<TranscriptStatus, string> = {
  pending: "Pending local transcription",
  complete: "Local transcript captured (needs verification)",
  unavailable: "Unavailable on this machine",
  skipped_no_tool: "Whisper not found — install locally",
};

const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".m4v", ".webm"]);

export function isVideoFileName(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  for (const ext of VIDEO_EXTENSIONS) {
    if (lower.endsWith(ext)) return true;
  }
  return false;
}

/** Infer chapter from paths like Course/Chapter8/... or Ch1pt2_... */
export function inferChapterNumber(relativePath: string): number | null {
  const chapterFolder = relativePath.match(/Chapter\s*(\d{1,2})/i);
  if (chapterFolder?.[1]) {
    const n = Number(chapterFolder[1]);
    return n >= 1 && n <= 14 ? n : null;
  }
  const file = relativePath.split(/[/\\]/).pop() ?? relativePath;
  const chFile = file.match(/\bCh(?:apter)?\s*(\d{1,2})\b/i);
  if (chFile?.[1]) {
    const n = Number(chFile[1]);
    return n >= 1 && n <= 14 ? n : null;
  }
  return null;
}

export function isDatedUpdatePath(relativePath: string): boolean {
  const name = relativePath.split(/[/\\]/).pop() ?? relativePath;
  return /(^|[_\W])spl([_\W]|$)|lawsuit|update/i.test(name);
}

export function titleFromVideoPath(relativePath: string): string {
  const file = relativePath.split(/[/\\]/).pop() ?? relativePath;
  return file
    .replace(/\.mp4-2000\.mp4$/i, "")
    .replace(/\.(mp4|mov|m4v|webm)$/i, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function transcriptNoteForComplete(): string {
  return "needs_verification — local ASR dump only; not Wisconsin course truth; not used by Teach Me";
}
