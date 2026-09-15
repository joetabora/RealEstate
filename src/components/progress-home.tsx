import Link from "next/link";
import { startDueReviewPracticeAction } from "@/lib/questions/actions";
import type { ProgressData } from "@/lib/knowledge/queries";

export function ProgressHome({ data }: { data: ProgressData }) {
  const hasReviewSignal =
    data.review.overdueCount > 0 || data.review.openMistakeCount > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Exam-weighted readiness
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Progress</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Concepts are listed before you study them. Nothing is scored as a mastery
        percentage — there are no 0% bars. Teach Me covers all 14 chapters in order.
        Practice attempts feed a deterministic review schedule.
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
          <section className="card mt-8 p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
              Review queue
            </p>
            <h2 className="mt-2 font-display text-2xl text-ink">Due recalls</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {data.review.scheduledCount === 0
                ? "No SM-2 schedules yet. Answer practice questions to create them."
                : hasReviewSignal
                  ? `${data.review.overdueCount} overdue · ${data.review.openMistakeCount} open mistakes · ${data.review.scheduledCount} scheduled. Teach Me may prepend repair/review assets for the chapter sitting.`
                  : `${data.review.scheduledCount} scheduled · nothing overdue · ${data.review.openMistakeCount} open mistakes.`}
            </p>
            {data.review.overdueConcepts.length > 0 ? (
              <ul className="mt-5 space-y-2">
                {data.review.overdueConcepts.map((concept) => (
                  <li key={concept.slug}>
                    <Link
                      href={`/concepts/${concept.slug}`}
                      className="flex flex-col gap-1 rounded-lg bg-paper px-4 py-3 text-sm ring-1 ring-line sm:flex-row sm:items-baseline sm:justify-between"
                    >
                      <span className="font-medium text-ink">{concept.name}</span>
                      <span className="text-xs text-muted">
                        Ch {concept.chapterNumber} · due{" "}
                        {new Date(concept.dueAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center gap-4">
              {data.review.overdueCount > 0 ? (
                <form action={startDueReviewPracticeAction}>
                  <button type="submit" className="btn-primary">
                    Practice due reviews
                  </button>
                </form>
              ) : null}
              {data.review.openMistakeCount > 0 ? (
                <Link
                  href="/mistakes"
                  className="text-sm font-medium text-accent underline-offset-2 hover:underline"
                >
                  Open Mistakes ({data.review.openMistakeCount})
                </Link>
              ) : null}
              <Link
                href="/practice"
                className="text-sm text-muted underline-offset-2 hover:underline"
              >
                Practice home
              </Link>
            </div>
          </section>

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
