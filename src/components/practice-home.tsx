import Link from "next/link";
import { startChapter1PracticeAction } from "@/lib/questions/actions";
import type { PracticeHomeData } from "@/lib/questions/queries";

export function PracticeHome({ data }: { data: PracticeHomeData }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Sourced questions
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Practice</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Phase 5 starts with Chapter 1 Agency MCQs built from seeded confusion pairs and
        heading citations. Confidence is required. Misses store remediation and queue an
        immediate retest. Teach Me stays the home loop.
      </p>

      {!data.databaseConnected ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            Postgres is not connected. Seeded questions and attempts need the local
            database.
          </p>
        </div>
      ) : (
        <section className="card mt-8 p-6 sm:p-8">
          <p className="text-sm text-muted">
            Chapter 1 active questions:{" "}
            <span className="text-ink">{data.questionCount}</span>
            {data.openMistakes > 0 ? (
              <>
                {" · "}
                <Link href="/mistakes" className="text-accent underline">
                  {data.openMistakes} open mistake{data.openMistakes === 1 ? "" : "s"}
                </Link>
              </>
            ) : null}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {data.openSessionId ? (
              <Link href={`/practice/session/${data.openSessionId}`} className="btn-primary">
                Resume Chapter 1 practice
              </Link>
            ) : data.canStart ? (
              <form action={startChapter1PracticeAction}>
                <button type="submit" className="btn-primary">
                  Start Chapter 1 practice
                </button>
              </form>
            ) : (
              <p className="text-sm text-muted">
                No questions seeded yet. Run{" "}
                <code className="text-ink">npx prisma db seed</code>.
              </p>
            )}
            <Link href="/mistakes" className="text-sm text-accent underline self-center">
              Mistakes
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
