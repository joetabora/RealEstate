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

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and start Postgres.");
  }
  return url;
}
