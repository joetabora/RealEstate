export function PlaceholderPage({
  title,
  summary,
  next,
}: {
  title: string;
  summary: string;
  next: string;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Coming in a later phase
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">{title}</h1>
      <div className="card mt-8 p-8">
        <p className="text-base leading-7 text-muted">{summary}</p>
        <p className="mt-4 text-sm leading-6 text-ink/80">{next}</p>
      </div>
    </div>
  );
}
