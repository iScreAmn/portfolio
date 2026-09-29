import { useMemo } from "react";
import { useLocale } from "../context/LocaleContext";
import * as englishCalculatorData from "../data/english/calculatorData";
import * as russianCalculatorData from "../data/russian/calculatorData";

export function useLocaleCalculatorData() {
  const { locale } = useLocale();
  return useMemo(
    () => (locale === "ru" ? russianCalculatorData : englishCalculatorData),
    [locale]
  );
}
