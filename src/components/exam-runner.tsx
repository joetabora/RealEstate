"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { finishExamEarlyAction, submitExamAnswerAction } from "@/lib/exam/actions";
import type { ExamSessionView } from "@/lib/exam/queries";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function ExamRunner({ session }: { session: ExamSessionView }) {
  const [optionId, setOptionId] = useState("");
  const [itemStartedAt, setItemStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const timeoutFormRef = useRef<HTMLFormElement>(null);
  const autoEndedRef = useRef(false);

  useEffect(() => {
    setOptionId("");
    setItemStartedAt(Date.now());
  }, [session.item?.id]);

  useEffect(() => {
    if (!session.endsAt || session.completed) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [session.endsAt, session.completed]);

  const remainingMs = session.endsAt ? Math.max(0, new Date(session.endsAt).getTime() - now) : null;
  const timedOut = remainingMs != null && remainingMs <= 0 && !session.completed;

  useEffect(() => {
    if (!timedOut || autoEndedRef.current) return;
    autoEndedRef.current = true;
    timeoutFormRef.current?.requestSubmit();
  }, [timedOut]);

  if (session.completed || !session.item) {
    const results = session.results;
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          Simulation complete
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">
          {session.sittingLabel}
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">{session.objective}</p>
        {results ? (
          <section className="card mt-8 p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Score</h2>
            <p className="mt-3 text-sm text-muted">
              {results.correct} correct of {results.answered} answered
              {results.answered !== results.total
                ? ` · ${results.total - results.answered} unanswered`
                : ""}
              {results.endedEarly ? " · ended early / timed out" : ""}
            </p>
            <p className="mt-2 text-base text-ink">
              Overall{" "}
              <span className="font-medium">
                {results.answered > 0
                  ? `${Math.round((results.correct / results.answered) * 100)}%`
                  : "—"}
              </span>{" "}
              of answered items
            </p>
            {results.byCategory.length > 0 ? (
              <ul className="mt-5 space-y-2">
                {results.byCategory.map((row) => (
                  <li
                    key={row.code}
                    className="flex flex-wrap justify-between gap-2 rounded-lg bg-paper px-4 py-3 text-sm ring-1 ring-line"
                  >
                    <span className="text-ink">
                      {row.code}. {row.name}
                    </span>
                    <span className="tabular-nums text-muted">
                      {row.correct}/{row.answered}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}
        <p className="mt-4 text-sm leading-6 text-muted">
          {session.recommendedNext ?? "Return to Exam or Practice."}
        </p>
        <p className="mt-8 flex flex-wrap gap-4">
          <Link href="/exam" className="btn-primary">
            Back to Exam
          </Link>
          <Link href="/mistakes" className="text-sm text-accent underline self-center">
            Mistakes
          </Link>
          <Link href="/practice" className="text-sm text-accent underline self-center">
            Practice
          </Link>
        </p>
      </div>
    );
  }

  const item = session.item;
  const stepLabel = `${session.currentIndex + 1} of ${session.total}`;

  return (
    <div className="mx-auto max-w-3xl">
      <form ref={timeoutFormRef} action={finishExamEarlyAction} className="hidden">
        <input type="hidden" name="sessionId" value={session.id} />
      </form>

      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          Exam · {stepLabel}
        </p>
        {remainingMs != null ? (
          <p
            className={`font-mono text-sm tabular-nums ${
              timedOut || remainingMs < 60_000 ? "text-ink" : "text-muted"
            }`}
          >
            {timedOut ? "Time up" : formatRemaining(remainingMs)}
          </p>
        ) : null}
      </div>
      <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
        {session.sittingLabel}
      </h1>
      <p className="mt-3 text-sm text-muted">
        No mid-exam remediation. Study simulation only — not a licensing exam.
      </p>

      {timedOut ? (
        <section className="card mt-6 p-6">
          <p className="text-sm leading-6 text-muted">
            Time expired. Scoring answered items…
          </p>
        </section>
      ) : (
        <section className="card mt-8 p-6 sm:p-8">
          <p className="text-base leading-7 text-ink">{item.stem}</p>
          <form action={submitExamAnswerAction} className="mt-8 space-y-6">
            <input type="hidden" name="sessionId" value={session.id} />
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="optionId" value={optionId} />
            <input
              type="hidden"
              name="latencyMs"
              value={Math.max(0, Date.now() - itemStartedAt)}
            />

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-ink">Choose one</legend>
              {item.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer gap-3 rounded-lg px-4 py-3 text-sm ring-1 transition ${
                    optionId === option.id
                      ? "bg-accent-soft ring-accent text-ink"
                      : "bg-paper ring-line text-muted hover:text-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="choice"
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

            <button type="submit" className="btn-primary" disabled={!optionId}>
              Submit answer
            </button>
          </form>
          <form action={finishExamEarlyAction} className="mt-4">
            <input type="hidden" name="sessionId" value={session.id} />
            <button type="submit" className="text-sm text-muted underline">
              End early
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
