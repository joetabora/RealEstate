import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function PracticePage() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Practice"
        summary="Targeted practice comes after sourced questions exist. Teach Me will remain the default way to get questions, so you do not have to hunt for a quiz."
        next="No question bank is loaded in Phase 1."
      />
    </AppShell>
  );
}
