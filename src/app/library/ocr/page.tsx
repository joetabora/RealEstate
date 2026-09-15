import { AppShell } from "@/components/app-shell";
import { LibraryOcrQueue } from "@/components/library-ocr-queue";
import { getOcrQueue } from "@/lib/library";

export const dynamic = "force-dynamic";

export default async function LibraryOcrPage() {
  const data = await getOcrQueue();
  return (
    <AppShell>
      <LibraryOcrQueue data={data} />
    </AppShell>
  );
}
