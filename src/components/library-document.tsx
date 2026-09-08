import Link from "next/link";
import type { LibraryDocumentData } from "@/lib/library/queries";

export function LibraryDocumentView({ data }: { data: LibraryDocumentData }) {
  if (!data.databaseConnected) {
    return (
      <Empty title="Library" message="Postgres is not connected on this host." />
    );
  }

  if (!data.document) {
    return (
      <Empty
        title="Not found"
        message="That source document is not ingested. Run npm run ingest locally."
      />
    );
  }

  const document = data.document;
  const chapterQuery = data.selectedChapter
    ? `?chapter=${data.selectedChapter}`
    : "";

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        <Link href="/library" className="hover:underline">
          Library
        </Link>
        <span className="text-muted"> / {document.layerLabel}</span>
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">
        {document.title}
      </h1>
      <p className="mt-4 text-sm leading-6 text-muted">
        {document.hideBodyInUi
          ? "This layer is stored locally. Question stems are not displayed."
          : "Headings and page citations only reconstruct a map of the source, not the book in git."}
      </p>

      {data.chapters.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl text-ink">Chapters 1–14</h2>
          <ol className="mt-4 space-y-2">
            {data.chapters.map((chapter) => {
              const active = data.selectedChapter === chapter.number;
              return (
                <li key={chapter.number}>
                  <Link
                    href={`/library/${document.slug}?chapter=${chapter.number}`}
                    className={`card flex items-baseline justify-between gap-4 p-4 text-sm ${
                      active ? "ring-1 ring-accent/40" : ""
                    }`}
                  >
                    <span className="text-ink">
                      {chapter.number}. {chapter.title}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-muted">
                      {chapter.citation}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      {data.chapters.length === 0 || data.selectedChapter != null ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-ink">
            {data.selectedChapter
              ? `Chapter ${data.selectedChapter} sections`
              : "Sections"}
          </h2>
          {data.sections.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No sections in this view.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {data.sections.map((section) => (
                <li key={section.id}>
                  <Link
                    href={`/library/${document.slug}/${section.id}${chapterQuery}`}
                    className="card block p-4"
                  >
                    <p className="text-sm font-medium text-ink">{section.heading}</p>
                    <p className="mt-1 text-xs text-muted">
                      {section.citation}
                      {section.needsOcr ? " · needs OCR" : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <p className="mt-8 text-sm text-muted">
          Open a chapter to see heading-level citations. Chapters 12–14 exist
          only in this book, not in the chapter-folder notes.
        </p>
      )}
    </div>
  );
}

function Empty({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl text-ink">{title}</h1>
      <p className="mt-4 text-sm text-muted">{message}</p>
    </div>
  );
}
