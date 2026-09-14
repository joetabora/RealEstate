import { AppShell } from "@/components/app-shell";
import { PracticeHome } from "@/components/practice-home";
import { getPracticeHomeData } from "@/lib/questions/queries";

export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const data = await getPracticeHomeData();

  return (
    <AppShell>
      <PracticeHome data={data} />
    </AppShell>
  );
}
