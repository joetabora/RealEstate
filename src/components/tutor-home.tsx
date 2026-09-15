"use client";

import Link from "next/link";
import { useEffect, useState, useTransition, type FormEvent } from "react";
import {
  loadTutorStatusAction,
  sendTutorMessageAction,
  setTutorModeAction,
} from "@/lib/tutor/actions";
import type { TutorMode, TutorStatus } from "@/lib/tutor/types";

const MODE_HELP: Record<TutorMode, string> = {
  off: "Tutor is fully off. Teach Me, Practice, and Library still work.",
  mock: "No API spend. Socratic coaching with local course pointers — never invents Wisconsin facts.",
  live: "Uses OPENAI_API_KEY when set and online. Soft daily spend cap applies.",
};

export function TutorHome({ initial }: { initial: TutorStatus }) {
  const [status, setStatus] = useState(initial);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState(true);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    loadTutorStatusAction()
      .then((next) => {
        if (!cancelled) setStatus(next);
      })
      .catch(() => {
        /* keep SSR initial */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const sync = () => setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  function changeMode(mode: TutorMode) {
    setError(null);
    startTransition(async () => {
      try {
        const next = await setTutorModeAction(mode);
        setStatus(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not change tutor mode.");
      }
    });
  }

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setError(null);
    startTransition(async () => {
      try {
        const next = await sendTutorMessageAction(text, online);
        setStatus(next);
        setDraft("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not send message.");
      }
    });
  }

  const liveBlockedOffline = status.mode === "live" && !online;
  const chatEnabled =
    status.mode === "mock" ||
    (status.mode === "live" && status.liveAvailable && online);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Optional overlay
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Tutor</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Socratic help you can turn off. Core study never depends on an API key.
        Replies can point at matching concepts and Library headings — they still must not invent
        Wisconsin facts.
      </p>

      {!online ? (
        <p className="mt-4 text-sm text-ink/80">
          You are offline. Live mode is disabled — use Mock, or continue Teach Me / Practice /
          Library.
        </p>
      ) : null}

      {!status.databaseConnected ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            Postgres is not connected. Tutor modes and chat need the local database.
          </p>
        </div>
      ) : (
        <>
          <section className="card mt-8 p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Mode</h2>
            <p className="mt-2 text-sm text-muted">{MODE_HELP[status.mode]}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(["off", "mock", "live"] as const).map((mode) => {
                const disabled = (mode === "live" && !status.liveConfigured) || pending;
                const active = status.mode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    disabled={disabled}
                    onClick={() => changeMode(mode)}
                    className={`rounded-lg px-4 py-2 text-sm capitalize transition ${
                      active
                        ? "bg-accent text-white"
                        : "bg-paper text-muted ring-1 ring-line hover:text-ink"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
            <ul className="mt-5 space-y-1 text-sm text-muted">
              <li>
                Live API key:{" "}
                <span className="text-ink">
                  {status.liveConfigured ? "configured" : "not set"}
                </span>
                {!status.liveConfigured ? (
                  <>
                    {" "}
                    — add <code className="text-ink">OPENAI_API_KEY</code> to{" "}
                    <code className="text-ink">.env</code> when you have one.
                  </>
                ) : null}
              </li>
              <li>
                Network:{" "}
                <span className="text-ink">{online ? "online" : "offline"}</span>
              </li>
              <li>
                Model: <span className="text-ink">{status.model}</span>
              </li>
              <li>
                Soft spend today:{" "}
                <span className="text-ink">
                  ${status.spentTodayUsd.toFixed(2)} / ${status.dailySpendCapUsd.toFixed(2)}
                </span>
              </li>
            </ul>
          </section>

          <section className="card mt-6 p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Chat</h2>
            {status.mode === "off" ? (
              <p className="mt-3 text-sm text-muted">
                Switch to Mock (free / works offline) or Live (needs API key + network) to open the
                chat.
              </p>
            ) : (
              <>
                <div className="mt-5 max-h-[28rem] space-y-4 overflow-y-auto">
                  {status.messages.length === 0 ? (
                    <p className="text-sm text-muted">
                      Ask about a concept you already studied. Matching course links may appear as
                      citations under the reply.
                    </p>
                  ) : (
                    status.messages.map((message) => (
                      <article
                        key={message.id}
                        className={`rounded-lg px-4 py-3 text-sm leading-6 ring-1 ring-line ${
                          message.role === "user"
                            ? "bg-paper text-ink"
                            : "bg-accent-soft text-ink"
                        }`}
                      >
                        <p className="text-xs uppercase tracking-[0.14em] text-muted">
                          {message.role}
                          {message.role === "assistant" ? ` · ${message.provider}` : ""}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap">{message.body}</p>
                        {message.citations.length > 0 ? (
                          <p className="mt-3 flex flex-wrap gap-3 text-xs">
                            {message.citations.map((citation) =>
                              citation.href ? (
                                <Link
                                  key={`${message.id}-${citation.label}-${citation.href}`}
                                  href={citation.href}
                                  className="text-accent underline-offset-2 hover:underline"
                                >
                                  {citation.label}
                                </Link>
                              ) : (
                                <span key={`${message.id}-${citation.label}`}>
                                  {citation.label}
                                </span>
                              ),
                            )}
                          </p>
                        ) : null}
                      </article>
                    ))
                  )}
                </div>

                <form onSubmit={sendMessage} className="mt-6 space-y-3">
                  <label className="block text-sm text-muted" htmlFor="tutor-message">
                    Your question
                  </label>
                  <textarea
                    id="tutor-message"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={3}
                    disabled={!chatEnabled || pending}
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-accent focus:ring-2 disabled:opacity-60"
                    placeholder="Example: I'm mixing up client vs customer — help me check my distinction."
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={!chatEnabled || pending || draft.trim().length === 0}
                  >
                    {pending ? "Sending…" : "Send"}
                  </button>
                  {liveBlockedOffline ? (
                    <p className="text-sm text-muted">
                      Live chat is paused offline. Switch to Mock to keep coaching without the API.
                    </p>
                  ) : null}
                  {status.mode === "live" && online && !status.liveAvailable ? (
                    <p className="text-sm text-muted">
                      Live chat is unavailable (missing key or daily spend cap reached). Use Mock.
                    </p>
                  ) : null}
                </form>
              </>
            )}
            {error ? <p className="mt-4 text-sm text-ink">{error}</p> : null}
          </section>
        </>
      )}
    </div>
  );
}
