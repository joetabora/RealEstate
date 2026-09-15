import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  absoluteRenderPath,
  relativeRenderPath,
  resolveSafeRenderFile,
} from "@/lib/library/page-render";

describe("page render paths", () => {
  const previous = process.env.LOCAL_PAGE_RENDER_PATH;

  afterEach(() => {
    if (previous == null) delete process.env.LOCAL_PAGE_RENDER_PATH;
    else process.env.LOCAL_PAGE_RENDER_PATH = previous;
  });

  it("builds stable relative PNG paths", () => {
    expect(relativeRenderPath("pub725-course-book", 12)).toBe(
      path.join("pub725-course-book", "p12.png"),
    );
  });

  it("rejects traversal outside the render root", () => {
    process.env.LOCAL_PAGE_RENDER_PATH = path.resolve("/tmp/exam-renders-test");
    const inside = absoluteRenderPath("doc", 1);
    expect(resolveSafeRenderFile(inside)).toBe(path.resolve(inside));
    expect(resolveSafeRenderFile("/etc/passwd")).toBeNull();
    expect(
      resolveSafeRenderFile(path.join(inside, "..", "..", "..", "etc", "passwd")),
    ).toBeNull();
  });
});
