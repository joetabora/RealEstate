import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getLocalPageRenderPath } from "@/lib/db/env";
import { prisma } from "@/lib/db/prisma";
import { fileExists, resolveSafeRenderFile } from "@/lib/library/page-render";

export const dynamic = "force-dynamic";

/**
 * Serve a local page-render PNG for a SourceAsset. Paths must stay under
 * LOCAL_PAGE_RENDER_PATH — never serves source PDFs or arbitrary files.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await context.params;
  if (!assetId) {
    return NextResponse.json({ error: "Missing asset id" }, { status: 400 });
  }

  try {
    const asset = await prisma.sourceAsset.findFirst({
      where: {
        id: assetId,
        kind: { in: ["page_render", "form_pdf_page"] },
        filePath: { not: null },
      },
      select: { filePath: true, mimeType: true },
    });
    if (!asset?.filePath) {
      return NextResponse.json({ error: "Render not found" }, { status: 404 });
    }

    const absolute = path.join(getLocalPageRenderPath(), asset.filePath);
    const safe = resolveSafeRenderFile(absolute);
    if (!safe || !(await fileExists(safe))) {
      return NextResponse.json({ error: "Render file missing" }, { status: 404 });
    }

    const bytes = await readFile(safe);
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": asset.mimeType ?? "image/png",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
}
