import type { MistakeListItem } from "@/lib/questions/queries";

export function MistakesHome({
  databaseConnected,
  items,
}: {
  databaseConnected: boolean;
  items: MistakeListItem[];
}) {
  const open = items.filter((item) => !item.resolved);
  const resolved = items.filter((item) => item.resolved);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Repair queue
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Mistakes</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Misses from practice keep the why-missed note, the core distinction, confidence,
        and error category. Class-quiz photo intake is still later.
      </p>

      {!databaseConnected ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            Postgres is not connected. Attempts and mistakes need the local database.
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            No attempts yet. Start Chapter 1 practice to create the first scored items.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          <MistakeGroup title="Open" items={open} empty="No open mistakes." />
          <MistakeGroup title="Resolved" items={resolved} empty="No resolved mistakes yet." />
        </div>
      )}
    </div>
  );
}

function MistakeGroup({
  title,
  items,
  empty,
}: {
  title: string;
  items: MistakeListItem[];
  empty: string;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="card p-5 sm:p-6">
              <p className="text-sm leading-6 text-ink">{item.stem}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{item.whyMissed}</p>
              <p className="mt-2 text-sm leading-6 text-ink">{item.distinction}</p>
              <p className="mt-3 text-xs text-muted">
                {item.conceptName ? `${item.conceptName} · ` : ""}
                {item.errorCategory ?? "miss"}
                {item.confidence != null ? ` · confidence ${item.confidence}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
