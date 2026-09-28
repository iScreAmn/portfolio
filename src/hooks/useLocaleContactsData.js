import { useMemo } from "react";
import { useLocale } from "../context/LocaleContext";
import * as englishContactsData from "../data/english/contactsData";
import * as russianContactsData from "../data/russian/contactsData";

export function useLocaleContactsData() {
  const { locale } = useLocale();
  return useMemo(
    () => (locale === "ru" ? russianContactsData : englishContactsData),
    [locale]
  );
}
