import { AppShell } from "@/components/app-shell";
import { LibrarySectionView } from "@/components/library-section";
import { getLibrarySection } from "@/lib/library";

export const dynamic = "force-dynamic";

export default async function LibrarySectionPage({
  params,
}: {
  params: Promise<{ slug: string; sectionId: string }>;
}) {
  const { slug, sectionId } = await params;
  const section = await getLibrarySection(slug, sectionId);

  return (
    <AppShell>
      <LibrarySectionView section={section} />
    </AppShell>
  );
}
