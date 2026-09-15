"use client";

import { useEffect, useState } from "react";
import type { TeachMeLiveStatus } from "@/lib/teach-me/queries";

export function TeachMeSessionControls() {
  const [status, setStatus] = useState<TeachMeLiveStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/teach-me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: TeachMeLiveStatus | null) => {
        if (!cancelled && data) {
          setStatus(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus({
            databaseConnected: false,
            canStart: false,
            openSessionId: null,
            completedSessionCount: 0,
            assetCount: 0,
            completedPlannerVersions: [],
            nextSittingLabel: "Chapter 1 — Agency Relationships",
            nextSittingShort: "Agency Relationships",
            nextSittingHint: "Start with Chapter 1 — Agency Relationships.",
            overdueCount: 0,
            openMistakeCount: 0,
            adaptiveHint: null,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ready = status?.canStart === true;
  const resumeHref = status?.openSessionId ? `/session/${status.openSessionId}` : null;
  const title = resumeHref
    ? "Session in progress"
    : status?.nextSittingShort
      ? `Next: ${status.nextSittingShort}`
      : "Agency Relationships";
  const hint =
    status?.nextSittingHint ??
    "Start with Chapter 1. After each sitting is complete, Teach Me opens the next chapter.";

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
          {hint} Sourced learn / repair / teach-back / recall — practice is on the
          Practice route.
          {status?.nextSittingLabel ? (
            <>
              {" "}
              Sitting: <span className="text-ink">{status.nextSittingLabel}</span>.
            </>
          ) : null}
        </p>
        {status?.adaptiveHint ? (
          <p className="mt-3 text-sm leading-6 text-ink/80">{status.adaptiveHint}</p>
        ) : null}
        {status && !status.databaseConnected ? (
          <p className="mt-3 text-sm text-ink/80">
            Postgres is not connected, so a session cannot be saved. See the README.
          </p>
        ) : null}
        {status?.databaseConnected && !status.canStart ? (
          <p className="mt-3 text-sm text-ink/80">
            Teaching assets are not seeded. Run <code>npx prisma db seed</code>.
          </p>
        ) : null}
      </div>
      {resumeHref ? (
        <a href={resumeHref} className="btn-primary self-start">
          Resume session
        </a>
      ) : (
        <form action="/session/start" method="POST">
          <button type="submit" className="btn-primary self-start" disabled={!ready}>
            Start session
          </button>
        </form>
      )}
    </div>
  );
}
