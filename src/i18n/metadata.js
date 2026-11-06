import { DEFAULT_LOCALE, LOCALES, LOCALE_META, SITE_URL, localizePath } from "./config";
import { getDictionary } from "./dictionaries";

export const languageAlternates = (path) => ({
  ...Object.fromEntries(LOCALES.map((locale) => [locale, localizePath(path, locale)])),
  "x-default": localizePath(path, DEFAULT_LOCALE),
});

export const pageMetadata = (locale, path, { title, description, absoluteTitle = false }) => {
  const { site } = getDictionary(locale).seo;
  const url = localizePath(path, locale);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: absoluteTitle ? title : site.titleTemplate.replace("%s", title),
      description,
      locale: LOCALE_META[locale]?.ogLocale,
      alternateLocale: LOCALES.filter((code) => code !== locale).map(
        (code) => LOCALE_META[code]?.ogLocale
      ),
    },
  };
};

export const staticPageMetadata = (pageKey, path) =>
  async function generateMetadata({ params }) {
    const { locale } = await params;
    const page = getDictionary(locale).seo.pages[pageKey];
    return pageMetadata(locale, path, { ...page, absoluteTitle: pageKey === "home" });
  };

export const siteMetadata = (locale) => {
  const { site } = getDictionary(locale).seo;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site.defaultTitle, template: site.titleTemplate },
    description: site.description,
  };
};

export { SITE_URL };
