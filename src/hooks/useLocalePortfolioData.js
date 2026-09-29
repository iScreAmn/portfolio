import { useLocale } from "../context/LocaleContext";
import portfolioData from "../data/portfolioData";
import * as englishPortfolioData from "../data/english/portfolioData";
import * as russianPortfolioData from "../data/russian/portfolioData";

// Общие поля проекта (картинки, ссылки, теги) + тексты текущей локали.
const withTexts = (data) => ({
  ...data,
  projects: portfolioData.map((item) => ({
    ...item,
    ...data.projectTexts[item.slug],
  })),
});

const englishData = withTexts(englishPortfolioData);
const russianData = withTexts(russianPortfolioData);

export function useLocalePortfolioData() {
  const { locale } = useLocale();
  return locale === "ru" ? russianData : englishData;
}
