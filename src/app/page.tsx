import { TeachMeHome } from "@/components/teach-me-home";
import { getTeachMeHome } from "@/lib/teach-me/home";

export const dynamic = "force-dynamic";

export default async function TeachMePage() {
  const data = await getTeachMeHome();
  return <TeachMeHome data={data} />;
}
