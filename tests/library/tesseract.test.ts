import { describe, expect, it } from "vitest";
import { normalizeOcrText } from "@/lib/library/tesseract";

describe("normalizeOcrText", () => {
  it("collapses noisy whitespace without inventing content", () => {
    expect(normalizeOcrText("  WB-11\n\n\nOffer  \n")).toBe("WB-11\n\nOffer");
  });
});
