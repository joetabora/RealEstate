import { AppShell } from "@/components/app-shell";
import { ExamHome } from "@/components/exam-home";
import { getExamHomeData } from "@/lib/exam";

export const dynamic = "force-dynamic";

export default async function ExamPage() {
  const data = await getExamHomeData();
  return (
    <AppShell>
      <ExamHome data={data} />
    </AppShell>
  );
}
