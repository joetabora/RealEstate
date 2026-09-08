import { describe, expect, it } from "vitest";
import { PRIMARY_NAV } from "@/lib/ui/nav";
import { SESSION_ITEM_KINDS } from "@/lib/session";

describe("product shell", () => {
  it("puts Teach Me first in primary navigation", () => {
    expect(PRIMARY_NAV[0]).toMatchObject({ href: "/", label: "Teach Me" });
    expect(PRIMARY_NAV.map((item) => item.label)).toEqual([
      "Teach Me",
      "Progress",
      "Practice",
      "Math",
      "Mistakes",
      "Exam",
      "Tutor",
      "Library",
    ]);
  });

  it("reserves session item kinds for the future learning loop", () => {
    expect(SESSION_ITEM_KINDS).toEqual([
      "review",
      "repair",
      "learn",
      "teachback",
      "practice",
      "recall",
    ]);
  });
});
