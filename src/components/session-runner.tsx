import Link from "next/link";
import type { SessionView } from "@/lib/teach-me/queries";
import { completeCurrentItem } from "@/lib/teach-me/actions";

export function SessionRunner({ session }: { session: SessionView }) {
  if (session.completed || !session.item) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          Session complete
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Agency sitting done</h1>
        <p className="mt-4 text-base leading-7 text-muted">{session.objective}</p>
        <p className="mt-4 text-sm leading-6 text-muted">
          {session.recommendedNext ??
            "Review Agency concepts on Progress. Sourced questions come in the next phase."}
        </p>
        <p className="mt-8 flex gap-4">
          <Link href="/" className="btn-primary">
            Back to Teach Me
          </Link>
          <Link href="/progress" className="text-sm text-accent underline self-center">
            Progress
          </Link>
        </p>
      </div>
    );
  }

  const item = session.item;
  const stepLabel = `${session.currentIndex + 1} of ${session.total}`;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        {item.kind} · {stepLabel} · about {session.targetMinutes} min
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">{item.title}</h1>
      {item.conceptName ? (
        <p className="mt-3 text-sm text-muted">
          {item.conceptSlug ? (
            <Link href={`/concepts/${item.conceptSlug}`} className="text-accent underline">
              {item.conceptName}
            </Link>
          ) : (
            item.conceptName
          )}
          {" · "}
          {item.informationClass.replace(/_/g, " ")}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted">{item.informationClass.replace(/_/g, " ")}</p>
      )}

      <section className="card mt-8 p-6 sm:p-8">
        <p className="text-base leading-7 text-ink">{item.body}</p>
      </section>

      {item.citations.length > 0 ? (
        <section className="mt-6">
          <h2 className="font-display text-xl text-ink">Citations</h2>
          <ul className="mt-3 space-y-2">
            {item.citations.map((citation) => (
              <li key={`${citation.heading}-${citation.citation}`}>
                {citation.href ? (
                  <Link href={citation.href} className="text-sm text-accent hover:underline">
                    {citation.heading} — {citation.citation}
                  </Link>
                ) : (
                  <span className="text-sm text-ink">
                    {citation.heading} — {citation.citation}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <form action={completeCurrentItem} className="mt-8">
        <input type="hidden" name="sessionId" value={session.id} />
        <input type="hidden" name="itemId" value={item.id} />
        <button type="submit" className="btn-primary">
          {item.kind === "teachback" || item.kind === "recall" ? "I said it — continue" : "Continue"}
        </button>
      </form>
    </div>
  );
}
