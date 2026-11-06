"use client";

import { useLocale } from "../context/LocaleContext";
import { getDictionary } from "./dictionaries";

export function useDictionary(section) {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  return section ? dictionary[section] : dictionary;
}
