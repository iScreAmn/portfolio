import portfolioProjects from "../data/portfolioData";
import { DEFAULT_LOCALE, LOCALES } from "./config";

import * as enHome from "../data/locales/en/homeData";
import * as enAbout from "../data/locales/en/aboutData";
import * as enCalculator from "../data/locales/en/calculatorData";
import * as enContacts from "../data/locales/en/contactsData";
import * as enGame from "../data/locales/en/gameData";
import * as enHobby from "../data/locales/en/hobbyData";
import * as enPortfolio from "../data/locales/en/portfolioData";
import * as enServices from "../data/locales/en/servicesData";
import * as enSeo from "../data/locales/en/seoData";

import * as ruHome from "../data/locales/ru/homeData";
import * as ruAbout from "../data/locales/ru/aboutData";
import * as ruCalculator from "../data/locales/ru/calculatorData";
import * as ruContacts from "../data/locales/ru/contactsData";
import * as ruGame from "../data/locales/ru/gameData";
import * as ruHobby from "../data/locales/ru/hobbyData";
import * as ruPortfolio from "../data/locales/ru/portfolioData";
import * as ruServices from "../data/locales/ru/servicesData";
import * as ruSeo from "../data/locales/ru/seoData";

const SOURCES = {
  en: {
    home: enHome,
    about: enAbout,
    calculator: enCalculator,
    contacts: enContacts,
    game: enGame,
    hobby: enHobby,
    portfolio: enPortfolio,
    services: enServices,
    seo: enSeo,
  },
  ru: {
    home: ruHome,
    about: ruAbout,
    calculator: ruCalculator,
    contacts: ruContacts,
    game: ruGame,
    hobby: ruHobby,
    portfolio: ruPortfolio,
    services: ruServices,
    seo: ruSeo,
  },
};

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value) &&
  (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);

const withFallback = (base, override) => {
  if (override === undefined || override === null) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return override;

  const result = { ...base };
  for (const key of Object.keys(override)) {
    result[key] = withFallback(base[key], override[key]);
  }
  return result;
};

const plain = (module) => (module ? { ...module } : undefined);

const buildDictionary = (locale) => {
  const base = SOURCES[DEFAULT_LOCALE];
  const own = SOURCES[locale] || {};

  const dictionary = Object.fromEntries(
    Object.keys(base).map((section) => [
      section,
      withFallback(plain(base[section]), plain(own[section])),
    ])
  );

  const { projectTexts = {} } = dictionary.portfolio;
  dictionary.portfolio.projects = portfolioProjects.map((item) => ({
    ...item,
    ...projectTexts[item.slug],
  }));

  return dictionary;
};

const DICTIONARIES = Object.fromEntries(LOCALES.map((locale) => [locale, buildDictionary(locale)]));

export const getDictionary = (locale) => DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE];
