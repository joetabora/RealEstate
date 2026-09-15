export const OCR_STATUSES = [
  "not_needed",
  "pending",
  "render_queued",
  "complete",
  "unavailable",
] as const;

export type OcrStatus = (typeof OCR_STATUSES)[number];

export const OCR_STATUS_LABELS: Record<OcrStatus, string> = {
  not_needed: "Text extractable — OCR not required",
  pending: "Pending local page render / OCR",
  render_queued: "Local page render on disk (OCR text not extracted)",
  complete: "Local OCR complete",
  unavailable: "Unavailable on this machine",
};

export function ocrStatusForNeedsOcr(needsOcr: boolean): OcrStatus {
  return needsOcr ? "pending" : "not_needed";
}

/**
 * Pull a form id from an already-extracted heading (e.g. WB-11).
 * Returns null when the heading does not contain a clear form token — never invents one.
 */
export function inferFormNumberFromHeading(heading: string): string | null {
  const match = heading.match(/\b(WB-?\d+[A-Z]?)\b/i);
  if (!match?.[1]) return null;
  const raw = match[1].toUpperCase();
  return raw.startsWith("WB-") ? raw : raw.replace(/^WB/, "WB-");
}

export function visualAnchorLabel(input: {
  needsOcr: boolean;
  pdfPage: number;
  printedPage: number | null;
  formNumber: string | null;
}): string {
  const pageBit =
    input.printedPage != null
      ? `printed p. ${input.printedPage} / PDF p. ${input.pdfPage}`
      : `PDF p. ${input.pdfPage}`;
  const formBit = input.formNumber ? `${input.formNumber} · ` : "";
  if (input.needsOcr) {
    return `${formBit}Page image placeholder (OCR pending) — ${pageBit}`;
  }
  return `${formBit}Page ${pageBit}`;
}
