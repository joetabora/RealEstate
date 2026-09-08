import { describe, expect, it } from "vitest";
import { toSectionRow } from "@/lib/library/view-models";

describe("library view models", () => {
  it("keeps citations on hidden practice-exam rows without exposing a body flag as text", () => {
    const row = toSectionRow({
      id: "sec_1",
      heading: "Course practice exam — PDF p. 391",
      headingPath: ["Course practice exam"],
      kind: "page",
      chapterNumber: null,
      printedPageStart: 387,
      printedPageEnd: 387,
      pdfPageStart: 391,
      pdfPageEnd: 391,
      needsOcr: false,
      hideBody: true,
      documentTitle: "Course practice exam",
    });

    expect(row.hideBody).toBe(true);
    expect(row.citation).toContain("p. 387");
    expect(row.heading).not.toMatch(/All the following would be considered/);
  });
});
