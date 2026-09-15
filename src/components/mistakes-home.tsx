import Link from "next/link";
import {
  discardClassMissAction,
  linkClassMissAction,
  uploadClassMissAction,
} from "@/lib/mistakes/actions";
import type { ClassMissCaptureView } from "@/lib/mistakes";
import type { MistakeListItem } from "@/lib/questions/queries";

export function MistakesHome({
  databaseConnected,
  items,
  classMissCaptures,
  conceptOptions,
  uploadStatus,
}: {
  databaseConnected: boolean;
  items: MistakeListItem[];
  classMissCaptures: ClassMissCaptureView[];
  conceptOptions: Array<{ slug: string; name: string }>;
  uploadStatus?: string | null;
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
        Practice misses keep why-missed notes and distinctions. Class-quiz photos stay on
        this machine — optional OCR is needs_verification only, never Teach Me truth.
      </p>

      {!databaseConnected ? (
        <div className="card mt-8 p-8">
          <p className="text-sm leading-6 text-muted">
            Postgres is not connected. Attempts and mistakes need the local database.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Class-miss photo</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Upload a quiz/class miss photo. Files go under gitignored{" "}
              <code className="text-ink">data/class-miss-photos/</code>. No cloud upload.
            </p>
            {uploadStatus === "ok" ? (
              <p className="mt-3 text-sm text-ink">Photo saved.</p>
            ) : null}
            {uploadStatus === "empty" || uploadStatus === "error" ? (
              <p className="mt-3 text-sm text-ink">Upload failed — try a JPEG/PNG under 12MB.</p>
            ) : null}
            <form action={uploadClassMissAction} className="mt-5 space-y-4" encType="multipart/form-data">
              <label className="block text-sm text-muted">
                Photo
                <input
                  type="file"
                  name="photo"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  className="mt-1 block w-full text-sm text-ink"
                />
              </label>
              <label className="block text-sm text-muted">
                Note (what you missed)
                <textarea
                  name="note"
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-accent focus:ring-2"
                  placeholder="Optional caption"
                />
              </label>
              <label className="block text-sm text-muted">
                Related concept (optional)
                <select
                  name="conceptSlug"
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-accent focus:ring-2"
                  defaultValue=""
                >
                  <option value="">None</option>
                  {conceptOptions.map((concept) => (
                    <option key={concept.slug} value={concept.slug}>
                      {concept.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" name="runOcr" value="on" defaultChecked />
                Run local Tesseract if installed (unverified)
              </label>
              <button type="submit" className="btn-primary">
                Save photo
              </button>
            </form>
          </section>

          {classMissCaptures.length > 0 ? (
            <section>
              <h2 className="font-display text-2xl text-ink">Photo captures</h2>
              <ul className="mt-4 space-y-4">
                {classMissCaptures.map((capture) => (
                  <li key={capture.id} className="card p-5 sm:p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={capture.imageHref}
                      alt={capture.note ?? "Class miss photo"}
                      className="max-h-64 w-full rounded-lg object-contain bg-paper ring-1 ring-line"
                    />
                    {capture.note ? (
                      <p className="mt-3 text-sm leading-6 text-ink">{capture.note}</p>
                    ) : null}
                    {capture.ocrText ? (
                      <div className="mt-3 rounded-lg bg-paper px-3 py-2 ring-1 ring-line">
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                          Local OCR · needs verification
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                          {capture.ocrText}
                        </p>
                      </div>
                    ) : null}
                    <p className="mt-3 text-xs text-muted">
                      {new Date(capture.createdAt).toLocaleString()} · {capture.status}
                      {capture.conceptName ? (
                        <>
                          {" · "}
                          <Link
                            href={`/concepts/${capture.conceptSlug}`}
                            className="text-accent underline"
                          >
                            {capture.conceptName}
                          </Link>
                        </>
                      ) : null}
                      {capture.linkedMistakeLabel
                        ? ` · linked: ${capture.linkedMistakeLabel}`
                        : ""}
                    </p>
                    <div className="mt-4 flex flex-wrap items-end gap-3">
                      {open.length > 0 && capture.status !== "linked" ? (
                        <form action={linkClassMissAction} className="flex flex-wrap items-end gap-2">
                          <input type="hidden" name="captureId" value={capture.id} />
                          <label className="block text-xs text-muted">
                            Link to open practice miss
                            <select
                              name="mistakeId"
                              required
                              className="mt-1 block max-w-xs rounded-lg border border-line bg-paper px-2 py-1.5 text-sm text-ink"
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Choose…
                              </option>
                              {open.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.stem.length > 60
                                    ? `${item.stem.slice(0, 57)}…`
                                    : item.stem}
                                </option>
                              ))}
                            </select>
                          </label>
                          <button type="submit" className="text-sm text-accent underline">
                            Link
                          </button>
                        </form>
                      ) : null}
                      <form action={discardClassMissAction}>
                        <input type="hidden" name="captureId" value={capture.id} />
                        <button type="submit" className="text-sm text-muted underline">
                          Discard
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <MistakeGroup title="Open" items={open} empty="No open practice mistakes." />
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
