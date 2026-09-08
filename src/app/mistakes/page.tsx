import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function MistakesPage() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Mistakes"
        summary="Every meaningful miss will be stored with the concept, the confusion pair if any, confidence, and why it happened — then repaired and retested."
        next="There are no attempts yet."
      />
    </AppShell>
  );
}
