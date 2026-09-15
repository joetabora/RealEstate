import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { extensionForMime, resolveSafeClassMissFile } from "@/lib/mistakes/class-miss";
import { getLocalClassMissPath } from "@/lib/db/env";

describe("class miss paths", () => {
  const previous = process.env.LOCAL_CLASS_MISS_PATH;

  afterEach(() => {
    if (previous == null) delete process.env.LOCAL_CLASS_MISS_PATH;
    else process.env.LOCAL_CLASS_MISS_PATH = previous;
  });

  it("maps mime types to extensions", () => {
    expect(extensionForMime("image/png")).toBe("png");
    expect(extensionForMime("image/jpeg")).toBe("jpg");
  });

  it("rejects traversal outside the class-miss root", () => {
    process.env.LOCAL_CLASS_MISS_PATH = path.resolve("/tmp/class-miss-test");
    const inside = path.join(getLocalClassMissPath(), "local", "a.jpg");
    expect(resolveSafeClassMissFile(inside)).toBe(path.resolve(inside));
    expect(resolveSafeClassMissFile("/etc/passwd")).toBeNull();
  });
});
