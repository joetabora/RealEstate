import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function MathPage() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Math"
        summary="Real estate math will use deterministic solvers for commissions, prorations, taxes, LTV, points, and transfer fees. The AI will never compute the answer."
        next="The solver is not implemented in Phase 1."
      />
    </AppShell>
  );
}
