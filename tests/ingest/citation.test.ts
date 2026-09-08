import { describe, expect, it } from "vitest";
import { formatPageCitation, formatSourceCitation } from "@/lib/ingest/citation";

describe("citations", () => {
  it("prefers printed page numbers when present", () => {
    expect(
      formatPageCitation({
        printedPageStart: 211,
        printedPageEnd: 228,
        pdfPageStart: 215,
        pdfPageEnd: 232,
      }),
    ).toBe("pp. 211–228");
  });

  it("falls back to PDF page numbers", () => {
    expect(
      formatPageCitation({
        printedPageStart: null,
        printedPageEnd: null,
        pdfPageStart: 3,
        pdfPageEnd: 3,
      }),
    ).toBe("PDF p. 3");
  });

  it("includes document title and heading", () => {
    expect(
      formatSourceCitation({
        documentTitle: "WRA Real Estate Sales Course Book (PUB725)",
        heading: "Chapter 12 Other Approved Forms",
        printedPageStart: 211,
        printedPageEnd: 211,
        pdfPageStart: 215,
        pdfPageEnd: 215,
      }),
    ).toBe(
      "WRA Real Estate Sales Course Book (PUB725), Chapter 12 Other Approved Forms, p. 211",
    );
  });
});
