import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function TutorPage() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Tutor"
        summary="The tutor will be a Socratic overlay on the current lesson or question. It requires source citations for Wisconsin facts and will hide itself when you are offline."
        next="No language-model client is installed in Phase 1."
      />
    </AppShell>
  );
}
