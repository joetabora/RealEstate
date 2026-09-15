import Link from "next/link";
import type { OcrQueueData } from "@/lib/library";

export function LibraryOcrQueue({ data }: { data: OcrQueueData }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        <Link href="/library" className="hover:underline">
          Library
        </Link>
        <span className="text-muted"> / OCR</span>
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">OCR queue</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Sections flagged <span className="text-ink">needsOcr</span> during ingest.
        Status tracks local render readiness only — no cloud OCR and no invented
        Wisconsin form lines.
      </p>

      {!data.databaseConnected ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            Postgres is not connected. The OCR queue needs the local database.
          </p>
        </div>
      ) : data.items.length === 0 ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            No image-heavy sections are queued. Re-run ingest after adding forms or
            low-text pages if you expect placeholders here.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {data.items.map((item) => (
            <li key={item.sectionId}>
              <Link
                href={item.href}
                className="card block p-5 transition hover:ring-1 hover:ring-accent/30"
              >
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  {item.documentTitle}
                  {item.formNumber ? ` · ${item.formNumber}` : ""}
                </p>
                <h2 className="mt-2 font-display text-xl text-ink">{item.heading}</h2>
                <p className="mt-2 text-sm text-muted">
                  {item.citation} · {item.ocrStatusLabel}
                  {item.hasLocalRender ? " · local render on disk" : " · no local render yet"}
                  {item.hasOcrText ? " · OCR text (unverified)" : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
