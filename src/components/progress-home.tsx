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
        are no 0% bars.
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
            migrations. Chapter 1 Agency terms are hand-seeded from course
            headings, not generated.
          </p>
        </div>
      ) : null}

      {data.seeded ? (
        <>
          <p className="mt-8 text-sm text-muted">
            {data.conceptCount} Chapter 1 concepts · {data.pairCount} active
            confusion pairs · exam category IV (Agency). All{" "}
            <span className="text-ink">not started</span>.
          </p>
          {data.groups.map((group) => (
            <section key={group.id} className="mt-8">
              <h2 className="font-display text-2xl text-ink">{group.label}</h2>
              <ul className="mt-4 space-y-2">
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
                        {concept.state.replace("_", " ")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      ) : null}
    </div>
  );
}
