import { AppShell } from "@/components/app-shell";
import { ValidationHome } from "@/components/validation-home";
import { getValidationHomeData } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function ValidationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const query = await searchParams;
  const data = await getValidationHomeData();
  return (
    <AppShell>
      <ValidationHome data={data} error={query.error === "1"} />
    </AppShell>
  );
}
