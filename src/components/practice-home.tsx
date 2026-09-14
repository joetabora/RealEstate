import Link from "next/link";
import { startChapterPracticeAction } from "@/lib/questions/actions";
import type { PracticeHomeData } from "@/lib/questions/queries";

export function PracticeHome({ data }: { data: PracticeHomeData }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Sourced questions
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Practice</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Phase 5 practice MCQs are built from seeded confusion pairs and heading citations.
        Confidence is required. Misses store remediation and queue an immediate retest.
        Teach Me stays the home loop.
      </p>

      {!data.databaseConnected ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            Postgres is not connected. Seeded questions and attempts need the local
            database.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {data.openMistakes > 0 ? (
            <p className="text-sm text-muted">
              <Link href="/mistakes" className="text-accent underline">
                {data.openMistakes} open mistake{data.openMistakes === 1 ? "" : "s"}
              </Link>
            </p>
          ) : null}

          {data.chapters.map((chapter) => (
            <section key={chapter.chapterNumber} className="card p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">{chapter.label}</h2>
              <p className="mt-2 text-sm text-muted">
                Active questions: <span className="text-ink">{chapter.questionCount}</span>
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {chapter.openSessionId ? (
                  <Link
                    href={`/practice/session/${chapter.openSessionId}`}
                    className="btn-primary"
                  >
                    Resume {chapter.shortLabel}
                  </Link>
                ) : chapter.canStart ? (
                  <form action={startChapterPracticeAction}>
                    <input type="hidden" name="chapterNumber" value={chapter.chapterNumber} />
                    <button type="submit" className="btn-primary">
                      Start {chapter.shortLabel} practice
                    </button>
                  </form>
                ) : (
                  <p className="text-sm text-muted">
                    No questions seeded yet. Run{" "}
                    <code className="text-ink">npx prisma db seed</code>.
                  </p>
                )}
              </div>
            </section>
          ))}

          <p className="pt-2">
            <Link href="/mistakes" className="text-sm text-accent underline">
              Mistakes
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
