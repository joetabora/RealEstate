import { AppShell } from "@/components/app-shell";
import { TutorHome } from "@/components/tutor-home";
import { loadTutorStatusAction } from "@/lib/tutor/actions";

export const dynamic = "force-dynamic";

export default async function TutorPage() {
  const initial = await loadTutorStatusAction();

  return (
    <AppShell>
      <TutorHome initial={initial} />
    </AppShell>
  );
}
