import Link from "next/link";
import type { LibraryDocumentCard } from "@/lib/library/view-models";

export function LibraryHome({
  databaseConnected,
  ingested,
  conceptCount,
  documents,
}: {
  databaseConnected: boolean;
  ingested: boolean;
  conceptCount: number;
  documents: LibraryDocumentCard[];
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Reference
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Library</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Cited course sections live here. Teach Me remains the home loop; this
        is a source index, not a replacement for the book. Chapter 1 Agency
        terms are listed on{" "}
        <Link href="/progress" className="text-accent underline">
          Progress
        </Link>
        {conceptCount > 0 ? ` (${conceptCount} concepts)` : ""}.
      </p>

      {!databaseConnected ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            Postgres is not connected. Ingest and Library browsing run on the
            machine that has the local database and <code>source-material/</code>.
          </p>
        </div>
      ) : null}

      {databaseConnected && !ingested ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            No source documents yet. From the project root run{" "}
            <code>npm run ingest</code> after Postgres is up. PDFs stay on this
            machine and are never committed.
          </p>
        </div>
      ) : null}

      {documents.length > 0 ? (
        <ul className="mt-8 space-y-3">
          {documents.map((document) => (
            <li key={document.slug}>
              <Link
                href={`/library/${document.slug}`}
                className="card block p-5 transition hover:ring-1 hover:ring-accent/30"
              >
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  {document.layerLabel}
                </p>
                <h2 className="mt-2 font-display text-xl text-ink">{document.title}</h2>
                <p className="mt-2 text-sm text-muted">
                  {document.sectionCount} sections
                  {document.pageCount > 0 ? ` · ${document.pageCount} pages` : ""}
                  {document.hideBodyInUi ? " · item text hidden" : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
