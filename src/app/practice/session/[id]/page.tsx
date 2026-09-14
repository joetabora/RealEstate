import { AppShell } from "@/components/app-shell";
import { PracticeRunner } from "@/components/practice-runner";
import { getPracticeSessionView } from "@/lib/questions/queries";

export const dynamic = "force-dynamic";

export default async function PracticeSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ missed?: string; why?: string; distinction?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const session = await getPracticeSessionView(id);
  const missBanner =
    query.missed === "1" && query.why && query.distinction
      ? { why: query.why, distinction: query.distinction }
      : null;

  return (
    <AppShell>
      {session ? (
        <PracticeRunner session={session} missBanner={missBanner} />
      ) : (
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl text-ink">Practice session not found</h1>
          <p className="mt-4 text-sm text-muted">Return to Practice to start again.</p>
        </div>
      )}
    </AppShell>
  );
}
