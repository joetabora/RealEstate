"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { completeSessionItem } from "./session";

export async function completeCurrentItem(formData: FormData) {
  const sessionId = String(formData.get("sessionId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  if (!sessionId || !itemId) {
    redirect("/session/unavailable");
  }
  await completeSessionItem(sessionId, itemId);
  revalidatePath(`/session/${sessionId}`);
  revalidatePath("/progress");
  redirect(`/session/${sessionId}`);
}
