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
          {section.renderImageHref ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={section.renderImageHref}
              alt={`Local page render for ${section.heading}`}
              className="mt-4 max-h-[28rem] w-full rounded-lg object-contain ring-1 ring-line bg-paper"
            />
          ) : null}
          {section.ocrText ? (
            <div className="mt-4 rounded-lg bg-paper px-4 py-3 ring-1 ring-line">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                Local OCR · needs verification
                {section.ocrVerified ? "" : " · not course truth"}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                {section.ocrText}
              </p>
            </div>
          ) : null}
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
