"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PracticeSessionView } from "@/lib/questions/queries";
import { submitPracticeAnswerAction } from "@/lib/questions/actions";

export function PracticeRunner({
  session,
  missBanner,
}: {
  session: PracticeSessionView;
  missBanner?: { why: string; distinction: string } | null;
}) {
  const [optionId, setOptionId] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(3);
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    setOptionId("");
    setConfidence(3);
  }, [session.item?.id]);

  if (session.completed || !session.item) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          Practice complete
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">
          {session.sittingLabel} done
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">{session.objective}</p>
        <p className="mt-4 text-sm leading-6 text-muted">
          {session.recommendedNext ?? "Review Mistakes for any open repairs."}
        </p>
        <p className="mt-8 flex flex-wrap gap-4">
          <Link href="/practice" className="btn-primary">
            Back to Practice
          </Link>
          <Link href="/mistakes" className="text-sm text-accent underline self-center">
            Mistakes
          </Link>
          <Link href="/" className="text-sm text-accent underline self-center">
            Teach Me
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
      <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
        {session.sittingLabel}
      </h1>
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

      {missBanner ? (
        <section className="mt-6 rounded-lg bg-paper p-5 ring-1 ring-line">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Remediation · retest queued
          </p>
          <p className="mt-2 text-sm leading-6 text-ink">{missBanner.why}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{missBanner.distinction}</p>
        </section>
      ) : null}

      <section className="card mt-8 p-6 sm:p-8">
        <p className="text-base leading-7 text-ink">{item.stem}</p>

        <form action={submitPracticeAnswerAction} className="mt-8 space-y-6">
          <input type="hidden" name="sessionId" value={session.id} />
          <input type="hidden" name="itemId" value={item.id} />
          <input type="hidden" name="optionId" value={optionId} />
          <input type="hidden" name="confidence" value={confidence} />
          <input type="hidden" name="latencyMs" value={Math.max(0, Date.now() - startedAt)} />

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-ink">Choose one</legend>
            {item.options.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer gap-3 rounded-lg px-4 py-3 text-sm leading-6 ring-1 ${
                  optionId === option.id
                    ? "bg-paper text-ink ring-accent"
                    : "bg-transparent text-muted ring-line hover:ring-accent/40"
                }`}
              >
                <input
                  type="radio"
                  name="optionChoice"
                  className="mt-1"
                  checked={optionId === option.id}
                  onChange={() => setOptionId(option.id)}
                />
                <span>
                  <span className="font-medium text-ink">{option.key}.</span> {option.body}
                </span>
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium text-ink">
              Confidence (1 = guess, 5 = certain)
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setConfidence(value)}
                  className={`min-w-10 rounded-lg px-3 py-2 text-sm ring-1 ${
                    confidence === value
                      ? "bg-ink text-paper ring-ink"
                      : "bg-transparent text-ink ring-line"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="btn-primary" disabled={!optionId}>
            Check answer
          </button>
        </form>
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
    </div>
  );
}
