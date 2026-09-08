import { describe, expect, it } from "vitest";
import { buildSections } from "@/lib/ingest/sections";
import { estimateTokens, MAX_SECTION_TOKENS, type ParsedPage } from "@/lib/ingest/types";

function page(pdfPage: number, text: string, printedPage: number | null = pdfPage): ParsedPage {
  return { pdfPage, printedPage, text, charCount: text.length };
}

describe("heading-aware sections", () => {
  it("splits on detected headings and keeps page citations", () => {
    const pages = [
      page(
        5,
        "1 Chapter Overview This sample chapter is original fixture prose about a made-up agency example for tests.",
        1,
      ),
      page(
        6,
        "THE NATURE OF THE AGENCY Agency is a legal relationship in this fixture and is not copied from the course book.",
        2,
      ),
    ];

    const sections = buildSections({
      pages,
      headings: [
        { pdfPage: 5, heading: "Chapter Overview", depth: 0, offset: 2 },
        { pdfPage: 6, heading: "THE NATURE OF THE AGENCY", depth: 0, offset: 0 },
      ],
      defaultHeading: "Fixture book",
    });

    expect(sections.map((section) => section.heading)).toEqual(
      expect.arrayContaining(["Chapter Overview", "THE NATURE OF THE AGENCY"]),
    );
    for (const section of sections) {
      expect(section.pdfPageStart).toBeGreaterThan(0);
    }
  });

  it("marks low-text pages as needing OCR instead of inventing content", () => {
    const sections = buildSections({
      pages: [page(249, "247", 245)],
      headings: [],
      defaultHeading: "Forms appendix",
      forcePageSections: true,
    });

    expect(sections).toHaveLength(1);
    expect(sections[0]?.needsOcr).toBe(true);
    expect(sections[0]?.kind).toBe("page");
  });

  it("splits oversized heading bodies on the 800-token budget", () => {
    const long = "word ".repeat(MAX_SECTION_TOKENS * 2);
    const pages = [page(10, `Heading\n${long}`), page(11, long)];
    const sections = buildSections({
      pages,
      headings: [{ pdfPage: 10, heading: "Heading", depth: 0, offset: 0 }],
      defaultHeading: "Fixture",
    });

    expect(sections.length).toBeGreaterThan(1);
    expect(Math.max(...sections.map((section) => section.tokenEstimate))).toBeLessThanOrEqual(
      estimateTokens(long) + 50,
    );
  });
});
