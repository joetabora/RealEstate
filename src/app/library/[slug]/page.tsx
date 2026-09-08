import { AppShell } from "@/components/app-shell";
import { LibraryDocumentView } from "@/components/library-document";
import { getLibraryDocument } from "@/lib/library";

export const dynamic = "force-dynamic";

export default async function LibraryDocumentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ chapter?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const chapter = query.chapter ? Number.parseInt(query.chapter, 10) : undefined;
  const data = await getLibraryDocument(
    slug,
    Number.isFinite(chapter) ? chapter : undefined,
  );

  return (
    <AppShell>
      <LibraryDocumentView data={data} />
    </AppShell>
  );
}
