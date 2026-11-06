import { getDictionary } from '../i18n/dictionaries';
import { DEFAULT_LOCALE, LOCALES } from '../i18n/config';
import { contentImageUrl } from '../lib/siteContent';

export const ABOUT_HERO_KEY = 'about-hero';

const SOCIAL_KEYS = ['linkedin', 'github', 'instagram'];

const pickTexts = (data) => ({
  eyebrow: data.heroData.eyebrow,
  title: data.heroData.title,
  lead: data.heroData.lead,
  subtitle: data.heroData.subtitle,
  subtitleSecondary: data.heroData.subtitleSecondary,
  posterAlt: data.posterAlt,
  cvText: data.cvData.downloadText,
});

export const aboutHeroDefaults = () => {
  const base = getDictionary(DEFAULT_LOCALE).about;
  return {
    image: null,
    links: {
      cv: base.cvData.filePath,
      ...Object.fromEntries(
        SOCIAL_KEYS.map((key) => [
          key,
          base.socialLinks.find((link) => link.key === key)?.href || '',
        ]),
      ),
    },
    ...Object.fromEntries(
      LOCALES.map((locale) => [locale, pickTexts(getDictionary(locale).about)]),
    ),
  };
};

export const applyAboutHero = (data, content, locale) => {
  if (!content) return { ...data, posterSrc: null };

  const texts = content[locale] || {};
  const links = content.links || {};

  return {
    ...data,
    heroData: {
      ...data.heroData,
      eyebrow: texts.eyebrow ?? data.heroData.eyebrow,
      title: texts.title || data.heroData.title,
      lead: texts.lead || data.heroData.lead,
      subtitle: texts.subtitle ?? data.heroData.subtitle,
      subtitleSecondary: texts.subtitleSecondary ?? data.heroData.subtitleSecondary,
    },
    posterAlt: texts.posterAlt ?? data.posterAlt,
    cvData: {
      downloadText: texts.cvText || data.cvData.downloadText,
      filePath: links.cv || data.cvData.filePath,
    },
    socialLinks: data.socialLinks.map((link) => ({
      ...link,
      href: links[link.key] || link.href,
    })),
    posterSrc: contentImageUrl(content.image),
  };
};
