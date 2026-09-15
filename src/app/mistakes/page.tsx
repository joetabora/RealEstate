import { AppShell } from "@/components/app-shell";
import { MistakesHome } from "@/components/mistakes-home";
import { getMistakeList } from "@/lib/questions/queries";

export const dynamic = "force-dynamic";

export default async function MistakesPage({
  searchParams,
}: {
  searchParams: Promise<{ upload?: string }>;
}) {
  const query = await searchParams;
  const data = await getMistakeList();

  return (
    <AppShell>
      <MistakesHome
        databaseConnected={data.databaseConnected}
        items={data.items}
        classMissCaptures={data.classMissCaptures}
        conceptOptions={data.conceptOptions}
        uploadStatus={query.upload ?? null}
      />
    </AppShell>
  );
}
