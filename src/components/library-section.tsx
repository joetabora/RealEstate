import Link from "next/link";
import type { LibrarySectionDetail } from "@/lib/library/view-models";

export function LibrarySectionView({
  section,
}: {
  section: LibrarySectionDetail | null;
}) {
  if (!section) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl text-ink">Section not found</h1>
        <p className="mt-4 text-sm text-muted">
          That citation is missing. Return to{" "}
          <Link href="/library" className="text-accent underline">
            Library
          </Link>
          .
        </p>
      </div>
    );
  }

  const backHref = section.chapterNumber
    ? `/library/${section.documentSlug}?chapter=${section.chapterNumber}`
    : `/library/${section.documentSlug}`;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        <Link href="/library" className="hover:underline">
          Library
        </Link>
        <span className="text-muted"> / </span>
        <Link href={backHref} className="hover:underline">
          {section.documentTitle}
        </Link>
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">
        {section.heading}
      </h1>
      <p className="mt-3 text-sm text-muted">{section.citation}</p>
      {section.visualAnchorLabel ? (
        <p className="mt-2 text-xs text-muted">Anchor: {section.visualAnchorLabel}</p>
      ) : null}

      {section.needsOcr || section.ocrStatus ? (
        <section className="card mt-6 p-5">
          <h2 className="font-display text-lg text-ink">Visual / OCR</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {section.ocrStatusLabel ?? "Status unknown"}
            {section.formNumber ? ` · form ${section.formNumber}` : ""}
            {section.hasLocalRender ? " · local render path recorded" : ""}
          </p>
          <p className="mt-3 text-sm">
            <Link href="/library/ocr" className="text-accent underline">
              OCR queue
            </Link>
          </p>
        </section>
      ) : null}

      <article className="card mt-8 p-6 sm:p-8">
        {section.withheldReason ? (
          <p className="text-sm leading-7 text-muted">{section.withheldReason}</p>
        ) : (
          <div className="whitespace-pre-wrap text-sm leading-7 text-ink/90">
            {section.body || "No extractable text on this page."}
          </div>
        )}
      </article>
    </div>
  );
}
