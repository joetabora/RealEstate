import { AppShell } from "@/components/app-shell";
import { MistakesHome } from "@/components/mistakes-home";
import { getMistakeList } from "@/lib/questions/queries";

export const dynamic = "force-dynamic";

export default async function MistakesPage() {
  const data = await getMistakeList();

  return (
    <AppShell>
      <MistakesHome databaseConnected={data.databaseConnected} items={data.items} />
    </AppShell>
  );
}
