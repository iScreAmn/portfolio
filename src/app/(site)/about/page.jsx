import AboutPage from "../../../views/AboutPage/AboutPage";
import { fetchSiteContent } from "../../../lib/siteContent";
import { ABOUT_HERO_KEY } from "../../../utils/aboutHeroContent";

export const metadata = {
  title: "About",
  description:
    "Background, stack and work experience of front-end developer Dimitri Jmukhadze.",
};

// Первый экран редактируется в админке, поэтому блок берётся на каждый
// запрос: сохранённое там видно на сайте сразу, без пересборки.
export default async function Page() {
  const heroContent = await fetchSiteContent(ABOUT_HERO_KEY);
  return <AboutPage heroContent={heroContent} />;
}
