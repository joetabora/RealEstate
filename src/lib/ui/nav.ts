export const PRIMARY_NAV = [
  { href: "/", label: "Teach Me", description: "Today's study session" },
  { href: "/progress", label: "Progress", description: "Exam-weighted readiness" },
  { href: "/practice", label: "Practice", description: "Targeted questions" },
  { href: "/math", label: "Math", description: "Deterministic calculations" },
  { href: "/mistakes", label: "Mistakes", description: "Patterns and repairs" },
  { href: "/exam", label: "Exam", description: "Timed simulation" },
  { href: "/tutor", label: "Tutor", description: "Socratic help" },
  { href: "/library", label: "Library", description: "Sourced course material" },
] as const;

export type NavItem = (typeof PRIMARY_NAV)[number];
