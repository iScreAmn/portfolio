import * as englishAboutData from '../data/english/aboutData';
import * as russianAboutData from '../data/russian/aboutData';
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

/**
 * Блок в том виде, в каком его хранит API, собранный из статичных файлов.
 * Им админка заполняет форму, пока блок ни разу не сохраняли.
 */
export const aboutHeroDefaults = () => ({
  image: null,
  links: {
    cv: englishAboutData.cvData.filePath,
    ...Object.fromEntries(
      SOCIAL_KEYS.map((key) => [
        key,
        englishAboutData.socialLinks.find((link) => link.key === key)?.href || '',
      ]),
    ),
  },
  en: pickTexts(englishAboutData),
  ru: pickTexts(russianAboutData),
});

/**
 * Накладывает сохранённый в админке блок на статичные данные локали.
 * Без блока (API не ответил или его ещё не сохраняли) данные остаются как
 * есть, а posterSrc — null: страница возьмёт картинку из assets.
 */
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
