import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { MathHome } from "@/components/math-home";

export default function MathPage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="text-sm text-muted">Loading math…</p>}>
        <MathHome />
      </Suspense>
    </AppShell>
  );
}
