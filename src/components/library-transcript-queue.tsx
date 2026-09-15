import Link from "next/link";
import type { TranscriptQueueData } from "@/lib/library";

export function LibraryTranscriptQueue({ data }: { data: TranscriptQueueData }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        <Link href="/library" className="hover:underline">
          Library
        </Link>
        <span className="text-muted"> / Transcripts</span>
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Video transcripts</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Local lecture inventory under <code className="text-ink">source-material/</code>.
        Optional Whisper dumps stay <span className="text-ink">needs_verification</span> —
        never Teach Me truth and never invented Wisconsin statutes. Catalog with{" "}
        <code className="text-ink">npm run catalog:videos</code>; transcribe one at a time with{" "}
        <code className="text-ink">npm run transcript:videos</code>.
      </p>

      {!data.databaseConnected ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            Postgres is not connected. The transcript queue needs the local database.
          </p>
        </div>
      ) : data.items.length === 0 ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            No videos cataloged yet. Run <code className="text-ink">npm run catalog:videos</code>{" "}
            with course files present under SOURCE_MATERIAL_PATH.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted">
            {data.videoCount} videos · {data.pendingCount} pending · {data.completeCount} complete
            (unverified)
          </p>
          <ul className="mt-6 space-y-3">
            {data.items.map((item) => (
              <li key={item.id} className="card p-5">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  {item.chapterNumber != null ? `Chapter ${item.chapterNumber}` : "Course"}
                  {item.isDatedUpdate ? " · dated update" : ""}
                </p>
                <h2 className="mt-2 font-display text-xl text-ink">{item.title}</h2>
                <p className="mt-2 font-mono text-xs text-muted">{item.relativePath}</p>
                <p className="mt-2 text-sm text-muted">{item.transcriptStatusLabel}</p>
                {item.preview ? (
                  <p className="mt-3 text-sm leading-6 text-ink/80">
                    {item.preview}
                    {item.hasTranscriptText && item.preview.length >= 180 ? "…" : ""}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
