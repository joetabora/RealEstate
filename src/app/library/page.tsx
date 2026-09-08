import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function LibraryPage() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Library"
        summary="Sourced sections, citations, and later form pages will live here. Library is a reference, not the home screen."
        next="Course PDFs are not ingested in Phase 1 and are never committed to git."
      />
    </AppShell>
  );
}
