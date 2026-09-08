import { AppShell } from "@/components/app-shell";
import { ConceptDetail } from "@/components/concept-detail";
import { getConceptDetail } from "@/lib/knowledge";

export const dynamic = "force-dynamic";

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = await getConceptDetail(slug);

  return (
    <AppShell>
      <ConceptDetail concept={concept} />
    </AppShell>
  );
}
