import Link from "next/link";
import type { ProgressData } from "@/lib/knowledge/queries";

export function ProgressHome({ data }: { data: ProgressData }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Exam-weighted readiness
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Progress</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Concepts are listed before you study them. Nothing is scored yet — there
        are no 0% bars. Teach Me covers Chapters 1–10 in order; more chapters
        follow the same path.
      </p>

      {!data.databaseConnected ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            Postgres is not connected. Concept seeding runs on the local
            database. See the README.
          </p>
        </div>
      ) : null}

      {data.databaseConnected && !data.seeded ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            No concepts yet. Run <code>npx prisma db seed</code> after
            migrations. Chapter concepts are hand-seeded from course headings,
            not generated.
          </p>
        </div>
      ) : null}

      {data.seeded ? (
        <>
          <p className="mt-8 text-sm text-muted">
            {data.conceptCount} concepts across Chapters{" "}
            {data.chapters.map((chapter) => chapter.chapterNumber).join("–")} ·{" "}
            {data.pairCount} active confusion pairs
            {data.learningCount > 0
              ? ` · ${data.learningCount} learning`
              : " · none scored yet"}
            . No 0% bars.
          </p>
          {data.chapters.map((chapter) => (
            <section key={chapter.chapterNumber} className="mt-10">
              <h2 className="font-display text-3xl text-ink">
                Chapter {chapter.chapterNumber} — {chapter.title}
              </h2>
              {chapter.groups.map((group) => (
                <div key={`${chapter.chapterNumber}-${group.id}`} className="mt-6">
                  <h3 className="font-display text-xl text-ink">{group.label}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.concepts.map((concept) => (
                      <li key={concept.slug}>
                        <Link
                          href={`/concepts/${concept.slug}`}
                          className="card flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:justify-between"
                        >
                          <span className="text-sm font-medium text-ink">{concept.name}</span>
                          <span className="text-xs text-muted">
                            {concept.citation}
                            {concept.jurisdictionScope === "wi" ? " · WI" : ""}
                            {" · "}
                            {concept.examCategoryCodes.join(", ")}
                            {" · "}
                            {concept.state.replace("_", " ")}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </>
      ) : null}
    </div>
  );
}
