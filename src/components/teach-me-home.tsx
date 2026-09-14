import { AppShell } from "@/components/app-shell";
import { TeachMeSessionControls } from "@/components/teach-me-session-controls";
import { SALESPERSON_EXAM_ITEM_TOTAL } from "@/lib/blueprint";
import type { TeachMeHomeData } from "@/lib/teach-me/home-data";

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
            You should not have to pick a chapter. Teach Me runs sequential
            sittings through all 14 chapters — Agency through Trust Accounts.
            Wisconsin facts stay cited.
          </p>
        </header>

        <section className="card mt-10 p-6 sm:p-8">
          <TeachMeSessionControls />

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
              Progress lists Chapters 1–14 concepts. Start session finishes each
              sitting in order before opening the next chapter.
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
