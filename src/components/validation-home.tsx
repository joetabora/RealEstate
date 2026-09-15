import {
  activateValidatedAction,
  advanceValidationAction,
  runPipelineAction,
} from "@/lib/validation/actions";
import { generateDraftsAction } from "@/lib/generation/actions";
import type { ValidationHomeData } from "@/lib/validation/queries";

export function ValidationHome({
  data,
  error,
  generated,
  genError,
}: {
  data: ValidationHomeData;
  error?: boolean;
  generated?: boolean;
  genError?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Phase 13 · Drafts + gates
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Validation</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Optional draft MCQs enter as <span className="text-ink">generated</span>, then pass
        source → structural → answer → ambiguity → WI-fact before an explicit activate.
        Teach Me and Practice still use active only. Generators never invent Wisconsin cites.
      </p>

      {!data.databaseConnected ? (
        <div className="card mt-8 p-8">
          <p className="text-sm text-muted">Postgres is not connected.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {error ? (
            <p className="text-sm text-ink">Could not advance that item.</p>
          ) : null}
          {genError ? (
            <p className="text-sm text-ink">
              Could not generate drafts. Check live key / spend cap, or use mock.
            </p>
          ) : null}
          {generated ? (
            <p className="text-sm text-ink">Drafts created as generated — run gates before activate.</p>
          ) : null}

          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Generate drafts</h2>
            <p className="mt-3 text-sm text-muted">
              Mock builds deterministic pair-based drafts offline. Live is optional and shares
              the tutor daily spend cap ({data.generation.remainingTodayUsd.toFixed(2)} USD left
              of {data.generation.dailySpendCapUsd.toFixed(2)}). Citations come from existing
              concepts only.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <form action={generateDraftsAction}>
                <input type="hidden" name="mode" value="mock" />
                <input type="hidden" name="limit" value="3" />
                <button type="submit" className="text-sm text-accent underline">
                  Generate 3 mock drafts
                </button>
              </form>
              <form action={generateDraftsAction}>
                <input type="hidden" name="mode" value="live" />
                <input type="hidden" name="limit" value="2" />
                <input type="hidden" name="online" value="1" />
                <button
                  type="submit"
                  className="text-sm text-accent underline disabled:opacity-40"
                  disabled={!data.generation.liveAvailable}
                >
                  Generate 2 live drafts
                </button>
              </form>
            </div>
            {!data.generation.liveConfigured ? (
              <p className="mt-3 text-xs text-muted">
                Live needs OPENAI_API_KEY. Model: {data.generation.model}.
              </p>
            ) : null}
          </section>

          <section className="card p-6">
            <h2 className="font-display text-2xl text-ink">Counts</h2>
            <p className="mt-3 text-sm text-muted">
              Pipeline {data.counts.inPipeline} · validated {data.counts.validated} ·
              rejected {data.counts.rejected} · active {data.counts.active}
            </p>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Queue</h2>
            {data.queue.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                No generated/in-pipeline items. Hand-seeded content is already active.
                Use Generate drafts above to create <code className="text-ink">generated</code>{" "}
                rows.
              </p>
            ) : (
              <ul className="mt-5 space-y-4">
                {data.queue.map((item) => (
                  <li
                    key={`${item.kind}-${item.id}`}
                    className="rounded-lg bg-paper px-4 py-3 ring-1 ring-line"
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-muted">
                      {item.kind} · {item.lifecycle} · {item.informationClass}
                      {item.chapterNumber != null ? ` · ch ${item.chapterNumber}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-ink">{item.title}</p>
                    <p className="mt-1 font-mono text-xs text-muted">{item.slug}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {item.lifecycle !== "validated" &&
                      item.lifecycle !== "rejected" &&
                      item.lifecycle !== "active" ? (
                        <>
                          <form action={advanceValidationAction}>
                            <input type="hidden" name="kind" value={item.kind} />
                            <input type="hidden" name="id" value={item.id} />
                            <button type="submit" className="text-sm text-accent underline">
                              Run next gate
                            </button>
                          </form>
                          {item.kind === "question" ? (
                            <form action={runPipelineAction}>
                              <input type="hidden" name="id" value={item.id} />
                              <button type="submit" className="text-sm text-accent underline">
                                Run full pipeline
                              </button>
                            </form>
                          ) : null}
                        </>
                      ) : null}
                      {item.lifecycle === "validated" ? (
                        <form action={activateValidatedAction}>
                          <input type="hidden" name="kind" value={item.kind} />
                          <input type="hidden" name="id" value={item.id} />
                          <button type="submit" className="text-sm text-accent underline">
                            Activate for study
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {data.recentEvents.length > 0 ? (
            <section className="card p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">Recent gate events</h2>
              <ul className="mt-4 space-y-2">
                {data.recentEvents.map((event) => (
                  <li key={event.id} className="text-sm text-muted">
                    <span className="text-ink">
                      {event.gate} · {event.passed ? "pass" : "fail"}
                    </span>
                    {" · "}
                    {event.fromLifecycle} → {event.toLifecycle}
                    {event.reasons.length > 0 ? ` · ${event.reasons.join("; ")}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
