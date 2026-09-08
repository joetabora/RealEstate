import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function ExamPage() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Exam"
        summary="A later phase will offer a timed 140-item session balanced to the official outline. Generated items will never be labeled as live licensing questions."
        next="The simulator is not available yet."
      />
    </AppShell>
  );
}
