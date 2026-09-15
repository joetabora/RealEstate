import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getLocalClassMissPath } from "@/lib/db/env";
import { prisma } from "@/lib/db/prisma";
import { getLocalLearner } from "@/lib/learner";
import { resolveSafeClassMissFile } from "@/lib/mistakes/class-miss";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const learner = await getLocalLearner(prisma);
    const row = await prisma.classMissCapture.findFirst({
      where: { id, learnerId: learner.id },
      select: { filePath: true, mimeType: true },
    });
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const absolute = path.join(getLocalClassMissPath(), row.filePath);
    const safe = resolveSafeClassMissFile(absolute);
    if (!safe) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const bytes = await readFile(safe);
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": row.mimeType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
}
