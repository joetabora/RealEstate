import { PDFDocument, StandardFonts } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { extractPdfPages } from "@/lib/ingest/pdf-text";
import { buildSections } from "@/lib/ingest/sections";

async function tinyFixturePdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const page1 = doc.addPage([612, 792]);
  page1.drawText("1", { x: 72, y: 740, size: 10, font: regular });
  page1.drawText("Chapter Overview", { x: 72, y: 700, size: 18, font: bold });
  page1.drawText("This fixture introduces a made-up agency example.", {
    x: 72,
    y: 670,
    size: 11,
    font: regular,
  });
  page1.drawText("THE NATURE OF THE AGENCY", { x: 72, y: 620, size: 14, font: bold });
  page1.drawText("Agency in this fixture is a test-only legal label.", {
    x: 72,
    y: 590,
    size: 11,
    font: regular,
  });

  const page2 = doc.addPage([612, 792]);
  page2.drawText("2", { x: 72, y: 740, size: 10, font: regular });
  page2.drawText("Licensee", { x: 72, y: 700, size: 13, font: bold });
  page2.drawText("A licensee in this fixture is an invented test person.", {
    x: 72,
    y: 670,
    size: 11,
    font: regular,
  });

  return doc.save();
}

describe("PDF extraction fixture", () => {
  it("extracts page-cited headings from a tiny original PDF", async () => {
    const data = await tinyFixturePdf();
    const { pages, headings } = await extractPdfPages(data, (pdfPage) => pdfPage);

    expect(pages).toHaveLength(2);
    expect(pages[0]?.text).toMatch(/Chapter Overview/);
    expect(headings.map((heading) => heading.heading)).toEqual(
      expect.arrayContaining(["Chapter Overview", "Licensee"]),
    );

    const sections = buildSections({
      pages,
      headings,
      defaultHeading: "Fixture notes",
    });

    expect(sections.length).toBeGreaterThanOrEqual(2);
    expect(sections.every((section) => section.pdfPageStart >= 1)).toBe(true);
    expect(sections.some((section) => /Wisconsin REALTORS/i.test(section.body))).toBe(false);
  });
});
