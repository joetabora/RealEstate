import { describe, expect, it } from "vitest";
import { hashSeed, shuffledCopy } from "@/lib/exam/shuffle";

describe("exam shuffle", () => {
  it("is deterministic for the same seed", () => {
    const input = ["a", "b", "c", "d", "e"];
    expect(shuffledCopy(input, "seed-one")).toEqual(shuffledCopy(input, "seed-one"));
    expect(shuffledCopy(input, "seed-one")).not.toEqual(shuffledCopy(input, "seed-two"));
  });

  it("preserves membership", () => {
    const input = [1, 2, 3, 4];
    expect(shuffledCopy(input, "x").sort()).toEqual([1, 2, 3, 4]);
  });

  it("hashes seeds stably", () => {
    expect(hashSeed("exam-order")).toBe(hashSeed("exam-order"));
  });
});
