import { getTeachMeLiveStatus } from "@/lib/teach-me/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getTeachMeLiveStatus();
  return Response.json(status);
}
