import { describe, expect, it } from "vitest";
import { replyWithMockTutor } from "@/lib/tutor/mock";
import { isTutorMode } from "@/lib/tutor/types";

describe("mock tutor", () => {
  it("refuses to invent Wisconsin facts", () => {
    const reply = replyWithMockTutor("What is the Wisconsin earnest money deadline?");
    expect(reply.provider).toBe("mock");
    expect(reply.body.toLowerCase()).toContain("cannot invent");
    expect(reply.citations.some((citation) => citation.href === "/library")).toBe(true);
  });

  it("asks for the learner's distinction on confusion prompts", () => {
    const reply = replyWithMockTutor("I'm confused about client vs customer");
    expect(reply.body.toLowerCase()).toContain("two ideas");
  });
});

describe("tutor modes", () => {
  it("accepts only off, mock, and live", () => {
    expect(isTutorMode("off")).toBe(true);
    expect(isTutorMode("mock")).toBe(true);
    expect(isTutorMode("live")).toBe(true);
    expect(isTutorMode("on")).toBe(false);
  });
});
