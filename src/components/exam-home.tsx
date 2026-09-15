import Link from "next/link";
import { startExamSimulationAction } from "@/lib/exam/actions";
import type { ExamHomeData } from "@/lib/exam/queries";

export function ExamHome({ data }: { data: ExamHomeData }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Phase 9 · Simulation
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Exam</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Timed, blueprint-balanced sitting from your seeded MCQs. Seat counts follow the
        Pearson salesperson outline weights, capped by what is actually in the database.
        {` ${data.disclaimer}`}
      </p>

      {!data.databaseConnected ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            Postgres is not connected. Exam simulation needs the local database and seeded
            questions.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">This sitting</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Planned items:{" "}
              <span className="text-ink">{data.plannedItemCount}</span> of blueprint{" "}
              {data.blueprintTotal}
              {" · "}
              about {data.targetMinutes} minutes ({data.plannedItemCount > 0 ? "90s/item" : "—"})
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {data.openSessionId ? (
                <Link href={`/exam/session/${data.openSessionId}`} className="btn-primary">
                  Resume simulation
                </Link>
              ) : data.canStart ? (
                <form action={startExamSimulationAction}>
                  <button type="submit" className="btn-primary">
                    Start simulation
                  </button>
                </form>
              ) : (
                <p className="text-sm text-muted">
                  No active questions yet. Run{" "}
                  <code className="text-ink">npx prisma db seed</code>.
                </p>
              )}
            </div>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Blueprint seats</h2>
            <p className="mt-2 text-sm text-muted">
              Weight → available inventory → seats for this sitting.
            </p>
            <ul className="mt-5 space-y-2">
              {data.quotas.map((row) => (
                <li
                  key={row.code}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg bg-paper px-4 py-3 text-sm ring-1 ring-line"
                >
                  <span className="text-ink">
                    {row.code}. {row.name}
                  </span>
                  <span className="tabular-nums text-muted">
                    w{row.blueprintWeight} · avail {row.available} · seats {row.seats}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <p className="text-sm text-muted">
            Prefer chapter drills?{" "}
            <Link href="/practice" className="text-accent underline">
              Practice
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
