import { TeachMeHome } from "@/components/teach-me-home";
import { buildTeachMeHomeFallback } from "@/lib/teach-me/home-data";

export default function TeachMePage() {
  return <TeachMeHome data={buildTeachMeHomeFallback()} />;
}
