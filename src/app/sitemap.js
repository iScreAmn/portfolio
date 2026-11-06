import portfolioData from "../data/portfolioData";
import { DEFAULT_LOCALE, LOCALES, SITE_URL, localizePath } from "../i18n/config";
import { languageAlternates } from "../i18n/metadata";

const STATIC_PATHS = ["/", "/about", "/services", "/portfolio", "/hobby", "/contacts", "/game", "/review"];

const absolute = (path) => `${SITE_URL}${path}`;

export default function sitemap() {
  const paths = [
    ...STATIC_PATHS,
    ...portfolioData.map((item) => `/portfolio/${encodeURIComponent(item.slug)}`),
  ];

  const lastModified = new Date();

  return paths.flatMap((path) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([code, href]) => [code, absolute(href)])
    );

    return LOCALES.map((locale) => ({
      url: absolute(localizePath(path, locale)),
      lastModified,
      changeFrequency: "monthly",
      priority: path === "/" ? (locale === DEFAULT_LOCALE ? 1 : 0.9) : 0.7,
      alternates: { languages },
    }));
  });
}
