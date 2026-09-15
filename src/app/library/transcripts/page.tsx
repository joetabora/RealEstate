import { AppShell } from "@/components/app-shell";
import { LibraryTranscriptQueue } from "@/components/library-transcript-queue";
import { getTranscriptQueue } from "@/lib/library";

export const dynamic = "force-dynamic";

export default async function LibraryTranscriptsPage() {
  const data = await getTranscriptQueue();
  return (
    <AppShell>
      <LibraryTranscriptQueue data={data} />
    </AppShell>
  );
}
