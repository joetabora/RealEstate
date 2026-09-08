import Link from "next/link";
import type { ConceptDetailData } from "@/lib/knowledge/queries";

export function ConceptDetail({ concept }: { concept: ConceptDetailData | null }) {
  if (!concept) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl text-ink">Concept not found</h1>
        <p className="mt-4 text-sm text-muted">
          Return to{" "}
          <Link href="/progress" className="text-accent underline">
            Progress
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        <Link href="/progress" className="hover:underline">
          Progress
        </Link>
        <span className="text-muted"> / Chapter {concept.chapterNumber}</span>
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">{concept.name}</h1>
      <p className="mt-3 text-sm text-muted">
        {concept.groupLabel}
        {concept.examCategoryCodes.length > 0
          ? ` · exam ${concept.examCategoryCodes.join(", ")}`
          : ""}
        {concept.jurisdictionScope === "wi" ? " · Wisconsin-sourced" : ""}
        {concept.jurisdictionScope === "both" ? " · general term in this WI course" : ""}
        {" · "}
        {concept.state.replace("_", " ")}
      </p>

      <section className="card mt-8 p-6">
        <h2 className="font-display text-xl text-ink">Citations</h2>
        <ul className="mt-4 space-y-3">
          {concept.citations.map((citation) => (
            <li key={`${citation.documentSlug}-${citation.heading}-${citation.citation}`}>
              {citation.libraryHref ? (
                <Link href={citation.libraryHref} className="text-sm text-accent hover:underline">
                  {citation.heading} — {citation.citation}
                </Link>
              ) : (
                <span className="text-sm text-ink">
                  {citation.heading} — {citation.citation}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {concept.prerequisites.length > 0 ? (
        <Related title="Prerequisites" items={concept.prerequisites} />
      ) : null}
      {concept.partOf.length > 0 ? (
        <Related title="Part of" items={concept.partOf} />
      ) : null}
      {concept.requiredBy.length > 0 ? (
        <Related title="Needed for" items={concept.requiredBy} />
      ) : null}

      {concept.confusionPairs.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-xl text-ink">Do not confuse with</h2>
          <ul className="mt-4 space-y-3">
            {concept.confusionPairs.map((pair) => (
              <li key={pair.otherSlug} className="card p-4">
                <Link
                  href={`/concepts/${pair.otherSlug}`}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  {pair.otherName}
                </Link>
                <p className="mt-2 text-sm leading-6 text-muted">{pair.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Related({
  title,
  items,
}: {
  title: string;
  items: Array<{ slug: string; name: string }>;
}) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/concepts/${item.slug}`}
              className="rounded-full bg-accent-soft px-3 py-1.5 text-xs text-accent"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
