import { describe, expect, it } from "vitest";
import {
  inferChapterNumber,
  isDatedUpdatePath,
  isVideoFileName,
  titleFromVideoPath,
  transcriptNoteForComplete,
} from "@/lib/library/video";
import { normalizeTranscript } from "@/lib/library/whisper";

describe("Phase 14 video helpers", () => {
  it("detects video extensions", () => {
    expect(isVideoFileName("Ch1.mp4")).toBe(true);
    expect(isVideoFileName("x.mp4-2000.mp4")).toBe(true);
    expect(isVideoFileName("notes.pdf")).toBe(false);
  });

  it("infers chapter numbers from paths", () => {
    expect(inferChapterNumber("Course/Chapter8/Ch8_pt1.mp4")).toBe(8);
    expect(inferChapterNumber("Course/Chapter1/Spl_2024_Update.mp4")).toBe(1);
    expect(inferChapterNumber("Course/CourseOverview.mp4")).toBeNull();
  });

  it("flags dated-update style filenames", () => {
    expect(isDatedUpdatePath("Course/Chapter1/Spl_2024_Update_Ch1.mp4")).toBe(true);
    expect(isDatedUpdatePath("Course/Chapter10/Spl_Ch10_2024_Lawsuit_Update.mp4")).toBe(true);
    expect(isDatedUpdatePath("Course/Chapter8/Ch8_pt1TranferofTitle.mp4")).toBe(false);
  });

  it("builds readable titles without inventing WI facts", () => {
    expect(titleFromVideoPath("Course/Chapter8/Ch8_pt3WisconsinTransferFee.mp4-2000.mp4")).toBe(
      "Ch8 pt3WisconsinTransferFee",
    );
  });

  it("labels complete dumps as needs_verification", () => {
    expect(transcriptNoteForComplete()).toMatch(/needs_verification/i);
    expect(transcriptNoteForComplete().toLowerCase()).toMatch(/not used by teach me/);
  });

  it("normalizes transcript whitespace", () => {
    expect(normalizeTranscript("a  \n\n\nb\r\nc")).toBe("a\n\nb\nc");
  });
});
