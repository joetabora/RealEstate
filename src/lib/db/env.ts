import path from "node:path";

export function getSourceMaterialPath(): string {
  return process.env.SOURCE_MATERIAL_PATH ?? path.resolve(process.cwd(), "source-material");
}

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and start Postgres.");
  }
  return url;
}
