import { describe, expect, it } from "vitest";
import {
  inferFormNumberFromHeading,
  ocrStatusForNeedsOcr,
  visualAnchorLabel,
} from "@/lib/library/ocr";

describe("library OCR helpers", () => {
  it("maps needsOcr to pending / not_needed", () => {
    expect(ocrStatusForNeedsOcr(true)).toBe("pending");
    expect(ocrStatusForNeedsOcr(false)).toBe("not_needed");
  });

  it("infers WB form numbers from headings without inventing them", () => {
    expect(inferFormNumberFromHeading("WB-11 Residential Offer")).toBe("WB-11");
    expect(inferFormNumberFromHeading("Using WB36 buyer agency")).toBe("WB-36");
    expect(inferFormNumberFromHeading("Agency relationships")).toBeNull();
  });

  it("labels OCR placeholders explicitly", () => {
    const label = visualAnchorLabel({
      needsOcr: true,
      pdfPage: 12,
      printedPage: 10,
      formNumber: "WB-11",
    });
    expect(label).toContain("OCR pending");
    expect(label).toContain("WB-11");
    expect(label).toContain("PDF p. 12");
  });
});
