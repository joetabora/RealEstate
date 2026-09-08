import path from "node:path";
import { describe, expect, it } from "vitest";
import { getSourceMaterialPath } from "@/lib/db/env";

describe("source material path", () => {
  it("defaults to ./source-material without reading any files", () => {
    const resolved = getSourceMaterialPath();
    expect(path.basename(resolved) === "source-material" || resolved.endsWith("source-material")).toBe(
      true,
    );
  });
});
