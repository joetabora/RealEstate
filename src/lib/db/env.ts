import path from "node:path";

export function getSourceMaterialPath(): string {
  return process.env.SOURCE_MATERIAL_PATH ?? path.resolve(process.cwd(), "source-material");
}

/** Local PNG/JPEG page renders. Never commit this directory. */
export function getLocalPageRenderPath(): string {
  return (
    process.env.LOCAL_PAGE_RENDER_PATH ?? path.resolve(process.cwd(), "data", "page-renders")
  );
}

/** Class-miss photo uploads. Never commit this directory. */
export function getLocalClassMissPath(): string {
  return (
    process.env.LOCAL_CLASS_MISS_PATH ?? path.resolve(process.cwd(), "data", "class-miss-photos")
  );
}

/** Local Whisper transcript sidecars. Never commit this directory. */
export function getLocalTranscriptPath(): string {
  return (
    process.env.LOCAL_TRANSCRIPT_PATH ?? path.resolve(process.cwd(), "data", "video-transcripts")
  );
}

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and start Postgres.");
  }
  return url;
}
