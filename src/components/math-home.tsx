"use client";

import { useMemo, useState } from "react";
import {
  PHASE8_MATH_TEMPLATES,
  classifyMathMiss,
  mathErrorMessage,
  mathTemplateById,
  nearlyEqual,
  type MathSolveResult,
} from "@/lib/math";

function formatAnswer(value: number, unit: "dollar" | "percent" | "number" | "years") {
  if (unit === "dollar") {
    return value.toLocaleString(undefined, { style: "currency", currency: "USD" });
  }
  if (unit === "percent") return `${value}%`;
  if (unit === "years") return `${value} yr`;
  return String(value);
}

export function MathHome() {
  const [templateId, setTemplateId] = useState(PHASE8_MATH_TEMPLATES[0]!.id);
  const template = mathTemplateById(templateId) ?? PHASE8_MATH_TEMPLATES[0]!;
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [solved, setSolved] = useState<MathSolveResult | null>(null);
  const [attempt, setAttempt] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputValues = useMemo(() => {
    const values: Record<string, number> = {};
    for (const field of template.inputs) {
      const raw = draft[field.key];
      if (raw == null || raw.trim() === "") continue;
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) values[field.key] = parsed;
    }
    return values;
  }, [draft, template.inputs]);

  function selectTemplate(id: string) {
    setTemplateId(id);
    setDraft({});
    setSolved(null);
    setAttempt("");
    setFeedback(null);
    setError(null);
  }

  function runSolve() {
    setError(null);
    setFeedback(null);
    try {
      for (const field of template.inputs) {
        if (inputValues[field.key] == null) {
          throw new Error(`Enter ${field.label}.`);
        }
      }
      setSolved(template.solve(inputValues));
      setAttempt("");
    } catch (err) {
      setSolved(null);
      setError(err instanceof Error ? err.message : "Could not solve.");
    }
  }

  function checkAttempt() {
    if (!solved) return;
    const value = Number(attempt);
    if (!Number.isFinite(value)) {
      setFeedback("Enter a numeric attempt.");
      return;
    }
    const tol = solved.unit === "percent" ? 0.05 : 0.01;
    if (nearlyEqual(value, solved.answer, tol)) {
      setFeedback("Correct — matches the deterministic solver.");
      return;
    }
    const kind = classifyMathMiss({
      expected: solved,
      attempt: value,
      rawInputs: inputValues,
    });
    setFeedback(mathErrorMessage(kind));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Deterministic solvers
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Math</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Commission, financing, prorations, and transfer-fee arithmetic use fixed formulas.
        Enter cited rates yourself — this page does not invent Wisconsin fee schedules.
        Language models never own the numeric answer.
      </p>

      <section className="card mt-8 p-6 sm:p-8">
        <h2 className="font-display text-2xl text-ink">Template</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {PHASE8_MATH_TEMPLATES.map((row) => {
            const active = row.id === template.id;
            return (
              <button
                key={row.id}
                type="button"
                onClick={() => selectTemplate(row.id)}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-accent text-white"
                    : "bg-paper text-muted ring-1 ring-line hover:text-ink"
                }`}
              >
                {row.title}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">{template.summary}</p>
        <p className="mt-2 font-mono text-xs text-ink">{template.formula}</p>
      </section>

      <section className="card mt-6 p-6 sm:p-8">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {template.inputs.map((field) => (
            <label key={field.key} className="block text-sm text-muted">
              {field.label}
              <span className="ml-1 text-xs">({field.unit})</span>
              <input
                type="number"
                step="any"
                value={draft[field.key] ?? ""}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, [field.key]: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-accent focus:ring-2"
              />
            </label>
          ))}
        </div>
        <button type="button" className="btn-primary mt-5" onClick={runSolve}>
          Solve
        </button>
        {error ? <p className="mt-3 text-sm text-ink">{error}</p> : null}
      </section>

      {solved ? (
        <section className="card mt-6 p-6 sm:p-8">
          <h2 className="font-display text-2xl text-ink">Solution</h2>
          <ol className="mt-4 space-y-3">
            {solved.steps.map((step) => (
              <li
                key={step.label}
                className="rounded-lg bg-paper px-4 py-3 text-sm ring-1 ring-line"
              >
                <p className="font-medium text-ink">{step.label}</p>
                <p className="mt-1 font-mono text-xs text-muted">{step.expression}</p>
                <p className="mt-1 tabular-nums text-ink">{step.value}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-base text-ink">
            <span className="text-muted">{solved.answerLabel}: </span>
            <span className="font-medium">{formatAnswer(solved.answer, solved.unit)}</span>
          </p>

          <div className="mt-6 border-t border-line pt-6">
            <h3 className="font-display text-xl text-ink">Check your attempt</h3>
            <p className="mt-2 text-sm text-muted">
              Enter the number you calculated, then compare it to the solver key.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <input
                type="number"
                step="any"
                value={attempt}
                onChange={(event) => setAttempt(event.target.value)}
                className="w-40 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-accent focus:ring-2"
                placeholder="Your number"
              />
              <button type="button" className="btn-primary" onClick={checkAttempt}>
                Check
              </button>
            </div>
            {feedback ? <p className="mt-3 text-sm text-ink">{feedback}</p> : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
