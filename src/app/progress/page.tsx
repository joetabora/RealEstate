import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function ProgressPage() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Progress"
        summary="Readiness will be aggregated by concept, chapter, exam category, Wisconsin vs general, and question type. There is no learner data yet, so nothing is scored."
        next="This page will not show 0% mastery bars that look like failure. It will stay empty until you have actually studied."
      />
    </AppShell>
  );
}
