import { AppShell } from "@/components/app-shell";
import { SessionRunner } from "@/components/session-runner";
import { getSessionView } from "@/lib/teach-me/queries";

export const dynamic = "force-dynamic";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSessionView(id);

  return (
    <AppShell>
      {session ? (
        <SessionRunner session={session} />
      ) : (
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl text-ink">Session not found</h1>
          <p className="mt-4 text-sm text-muted">Return to Teach Me to start again.</p>
        </div>
      )}
    </AppShell>
  );
}
