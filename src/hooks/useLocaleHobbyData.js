import { useMemo } from "react";
import { useLocale } from "../context/LocaleContext";
import * as englishHobbyData from "../data/english/hobbyData";
import * as russianHobbyData from "../data/russian/hobbyData";

export function useLocaleHobbyData() {
  const { locale } = useLocale();
  return useMemo(
    () => (locale === "ru" ? russianHobbyData : englishHobbyData),
    [locale]
  );
}
