import { describe, expect, it } from "vitest";
import {
  COURSE_CHAPTERS,
  PUB725_PARTS,
  chapterAtPdfPage,
  chapterPdfEnd,
  printedPageForPdfPage,
} from "@/lib/ingest/catalog";

describe("PUB725 catalog", () => {
  it("lists fourteen course chapters including 12–14", () => {
    expect(COURSE_CHAPTERS).toHaveLength(14);
    expect(COURSE_CHAPTERS.map((chapter) => chapter.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    ]);
    expect(COURSE_CHAPTERS[11]).toMatchObject({
      number: 12,
      title: "Other Approved Forms",
      pdfStart: 215,
    });
    expect(COURSE_CHAPTERS[12]?.title).toBe("Contract Law");
    expect(COURSE_CHAPTERS[13]?.title).toBe("Trust Accounts");
  });

  it("keeps printed page 1 on PDF page 5", () => {
    expect(printedPageForPdfPage(1)).toBeNull();
    expect(printedPageForPdfPage(5)).toBe(1);
    expect(printedPageForPdfPage(215)).toBe(211);
    expect(printedPageForPdfPage(450)).toBe(446);
  });

  it("maps chapter 12–14 page ranges inside the course book part", () => {
    const book = PUB725_PARTS.find((part) => part.slug === "pub725-course-book");
    expect(book).toMatchObject({ pdfStart: 5, pdfEnd: 248 });
    expect(chapterAtPdfPage(215)?.number).toBe(12);
    expect(chapterAtPdfPage(233)?.number).toBe(13);
    expect(chapterAtPdfPage(243)?.number).toBe(14);
    expect(chapterPdfEnd(COURSE_CHAPTERS[11])).toBe(232);
    expect(chapterPdfEnd(COURSE_CHAPTERS[13])).toBe(248);
  });

  it("marks the course practice exam hidden in the UI", () => {
    const exam = PUB725_PARTS.find((part) => part.slug === "pub725-practice-exam");
    expect(exam?.hideBodyInUi).toBe(true);
    expect(exam?.layer).toBe("practice_exam");
  });
});
