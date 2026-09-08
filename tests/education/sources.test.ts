import { describe, expect, it } from "vitest";
import { COURSE_CHAPTERS } from "@/lib/ingest/catalog";
import { courseChapterIndex } from "@/lib/library/view-models";

describe("source index (educational)", () => {
  it("exposes chapters 12–14 in the course book index even before notes exist", () => {
    const index = courseChapterIndex(
      COURSE_CHAPTERS.map((chapter) => ({
        chapterNumber: chapter.number,
        kind: "heading",
        pdfPageStart: chapter.pdfStart,
        pdfPageEnd: chapter.pdfStart + 1,
        printedPageStart: chapter.pdfStart - 4,
        printedPageEnd: chapter.pdfStart - 3,
      })),
    );

    expect(index).toHaveLength(14);
    const late = index.filter((chapter) => chapter.number >= 12);
    expect(late.map((chapter) => chapter.title)).toEqual([
      "Other Approved Forms",
      "Contract Law",
      "Trust Accounts",
    ]);
    expect(late.every((chapter) => chapter.citation.startsWith("pp."))).toBe(true);
  });

  it("does not treat the exam blueprint as course teaching text", () => {
    const titles = COURSE_CHAPTERS.map((chapter) => chapter.title).join(" ");
    expect(titles.toLowerCase()).not.toContain("pearson");
  });
});
