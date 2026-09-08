import { AppShell } from "@/components/app-shell";
import { ProgressHome } from "@/components/progress-home";
import { getProgressData } from "@/lib/knowledge";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const data = await getProgressData();

  return (
    <AppShell>
      <ProgressHome data={data} />
    </AppShell>
  );
}
