import { redirect } from "next/navigation";
import { startOrResumeTeachMeSession } from "@/lib/teach-me/session";

export async function POST() {
  let sessionId: string | undefined;
  try {
    const session = await startOrResumeTeachMeSession();
    sessionId = session.id;
  } catch {
    redirect("/session/unavailable");
  }
  if (!sessionId) {
    redirect("/session/unavailable");
  }
  redirect(`/session/${sessionId}`);
}
