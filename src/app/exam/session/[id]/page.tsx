import { AppShell } from "@/components/app-shell";
import { ExamRunner } from "@/components/exam-runner";
import { getExamSessionView } from "@/lib/exam";

export const dynamic = "force-dynamic";

export default async function ExamSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getExamSessionView(id);

  return (
    <AppShell>
      {session ? (
        <ExamRunner session={session} />
      ) : (
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl text-ink">Exam session not found</h1>
          <p className="mt-4 text-sm text-muted">Return to Exam to start again.</p>
        </div>
      )}
    </AppShell>
  );
}
