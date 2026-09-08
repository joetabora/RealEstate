import { AppShell } from "@/components/app-shell";
import { SALESPERSON_EXAM_ITEM_TOTAL } from "@/lib/blueprint";
import type { TeachMeHomeData } from "@/lib/teach-me/home";

const LEARNING_LOOP = [
  "Learn",
  "Understand",
  "Recall",
  "Apply",
  "Err",
  "Diagnose",
  "Remediate",
  "Retest",
  "Mastery",
  "Review",
];

export function TeachMeHome({ data }: { data: TeachMeHomeData }) {
  const plannedStart = data.startingCategory;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Today&apos;s plan
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
            Your session will be chosen for you.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            You should not have to pick a chapter. When the course is in the
            system, Teach Me will assemble overdue reviews, weak concepts,
            Wisconsin-specific gaps, and exam-weighted new material into one
            sitting.
          </p>
        </header>

        <section className="card mt-10 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-display text-2xl text-ink">No session yet</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
                Course content has not been ingested. There is no mastery or
                readiness data — this is a new learner on{" "}
                <span className="text-ink">{data.edition.name}</span>.
              </p>
              {!data.databaseConnected ? (
                <p className="mt-3 text-sm text-ink/80">
                  Postgres is not connected yet, so nothing is persisted. The
                  starting area below still comes from the official exam
                  outline. See the README to start the database.
                </p>
              ) : null}
            </div>
            <button type="button" className="btn-primary self-start" disabled>
              Start session
            </button>
          </div>

          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Review — concepts due to be recalled",
              "Repair — pairs you confuse",
              "Learn — next exam-weighted idea",
              "Teach back — explain it in your own words",
              "Practice — a handful of applications",
              "Recall — two ideas you already know",
            ].map((item, index) => (
              <li
                key={item}
                className="flex gap-3 rounded-lg bg-paper px-4 py-3 text-sm text-muted ring-1 ring-line"
              >
                <span className="font-medium text-accent/70">{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <article className="card p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
              Logical starting area
            </p>
            <h2 className="mt-3 font-display text-3xl capitalize text-ink">
              {plannedStart.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              The Wisconsin salesperson exam is {SALESPERSON_EXAM_ITEM_TOTAL}{" "}
              scored items. {plannedStart.name} is the largest official category
              at {plannedStart.weight} items
              {plannedStart.code ? ` (section ${plannedStart.code})` : ""}.
              Until course material is loaded, this is where study should begin.
            </p>
            <p className="mt-4 text-sm text-ink">
              This is an exam-blueprint recommendation, not a readiness score.
            </p>
          </article>

          <aside className="card p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
              Exam weights
            </p>
            <p className="mt-2 text-sm text-muted">
              {data.examItemTotal} scored items. Bars show outline share, not
              your performance.
            </p>
            <ul className="mt-5 space-y-3">
              {data.categories.map((category) => {
                const pct = (category.weight / data.examItemTotal) * 100;
                const isStart = category.code === plannedStart.code;
                return (
                  <li key={category.code}>
                    <div className="flex items-baseline justify-between gap-3 text-xs">
                      <span className={isStart ? "font-medium text-ink" : "text-muted"}>
                        {category.code}. {category.name}
                      </span>
                      <span className="tabular-nums text-muted">{category.weight}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                      <div
                        className={`h-full rounded-full ${isStart ? "bg-accent" : "bg-ink/25"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </section>

        <p className="mt-10 text-xs leading-6 text-muted">
          Eventual loop: {LEARNING_LOOP.join(" → ")}. Learner {data.learnerKey}.
          Edition {data.edition.slug}.
        </p>
      </div>
    </AppShell>
  );
}
