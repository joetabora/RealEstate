import { describe, expect, it } from "vitest";
import { replyWithMockTutor } from "@/lib/tutor/mock";
import { formatContextBlock, tokenizeTutorQuery } from "@/lib/tutor/retrieve";
import { isTutorMode } from "@/lib/tutor/types";

describe("mock tutor", () => {
  it("refuses to invent Wisconsin facts", () => {
    const reply = replyWithMockTutor("What is the Wisconsin earnest money deadline?");
    expect(reply.provider).toBe("mock");
    expect(reply.body.toLowerCase()).toContain("cannot invent");
    expect(reply.citations.some((citation) => citation.href === "/library")).toBe(true);
  });

  it("points at retrieved course hits instead of inventing an answer", () => {
    const reply = replyWithMockTutor("Explain agency", [
      {
        kind: "concept",
        title: "The nature of the agency",
        snippet: "Chapter 1 · p. 12",
        href: "/concepts/nature-of-agency",
      },
    ]);
    expect(reply.body).toContain("The nature of the agency");
    expect(reply.citations.some((c) => c.href === "/concepts/nature-of-agency")).toBe(true);
  });

  it("asks for the learner's distinction on confusion prompts", () => {
    const reply = replyWithMockTutor("I'm confused about client vs customer");
    expect(reply.body.toLowerCase()).toContain("two ideas");
  });
});

describe("tutor retrieval helpers", () => {
  it("tokenizes queries without stop words", () => {
    expect(tokenizeTutorQuery("What is the nature of agency?")).toEqual(
      expect.arrayContaining(["nature", "agency"]),
    );
    expect(tokenizeTutorQuery("What is the nature of agency?")).not.toContain("the");
  });

  it("formats an empty context block honestly", () => {
    expect(formatContextBlock([])).toContain("No local course matches");
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
