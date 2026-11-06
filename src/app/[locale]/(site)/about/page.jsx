import AboutPage from "../../../../views/AboutPage/AboutPage";
import { staticPageMetadata } from "../../../../i18n/metadata";
import { fetchSiteContent } from "../../../../lib/siteContent";
import { ABOUT_HERO_KEY } from "../../../../utils/aboutHeroContent";

export const generateMetadata = staticPageMetadata("about", "/about");

export default async function Page() {
  const heroContent = await fetchSiteContent(ABOUT_HERO_KEY);
  return <AboutPage heroContent={heroContent} />;
}
