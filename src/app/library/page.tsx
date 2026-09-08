import { AppShell } from "@/components/app-shell";
import { LibraryHome } from "@/components/library-home";
import { getLibraryHome } from "@/lib/library";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const data = await getLibraryHome();

  return (
    <AppShell>
      <LibraryHome
        databaseConnected={data.databaseConnected}
        ingested={data.ingested}
        documents={data.documents}
      />
    </AppShell>
  );
}
