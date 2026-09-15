import { AppShell } from "@/components/app-shell";
import { ValidationHome } from "@/components/validation-home";
import { getValidationHomeData } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function ValidationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; generated?: string; genError?: string }>;
}) {
  const query = await searchParams;
  const data = await getValidationHomeData();
  return (
    <AppShell>
      <ValidationHome
        data={data}
        error={query.error === "1"}
        generated={query.generated === "1"}
        genError={query.genError === "1"}
      />
    </AppShell>
  );
}
