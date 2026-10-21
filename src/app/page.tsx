import { HomeSections } from "@/components/home/Sections";
import { getHome } from "@/lib/api";

export default async function HomePage() {
  const sections = await getHome();
  return <HomeSections sections={sections} />;
}
