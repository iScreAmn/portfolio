export const LOCALES = ['en', 'ru'];

export const DEFAULT_LOCALE = 'en';

export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const LOCALE_META = {
  en: { label: 'English', short: 'EN', ogLocale: 'en_US' },
  ru: { label: 'Русский', short: 'RU', ogLocale: 'ru_RU' },
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://djcode.ge').replace(/\/$/, '');

export const isLocale = (value) => LOCALES.includes(value);

export const splitLocale = (pathname = '/') => {
  const [, first, ...rest] = pathname.split('/');
  if (!isLocale(first)) return { locale: null, path: pathname || '/' };
  return { locale: first, path: `/${rest.join('/')}` };
};

export const localizePath = (href, locale) => {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return href;
  if (href === '/admin' || href.startsWith('/admin/') || href.startsWith('/api/')) return href;

  const [pathPart] = href.split(/[?#]/);
  if (/\.[a-z0-9]+$/i.test(pathPart)) return href;

  const { path } = splitLocale(pathPart);
  const suffix = href.slice(pathPart.length);
  return `/${locale}${path === '/' ? '' : path}${suffix}`;
};
