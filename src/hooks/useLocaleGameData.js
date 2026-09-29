import { useMemo } from "react";
import { useLocale } from "../context/LocaleContext";
import * as englishGameData from "../data/english/gameData";
import * as russianGameData from "../data/russian/gameData";

export function useLocaleGameData() {
  const { locale } = useLocale();
  return useMemo(
    () => (locale === "ru" ? russianGameData : englishGameData),
    [locale]
  );
}
