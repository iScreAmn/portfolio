"use client";

import { Clients } from "../../components/index";
import PageHero from "../../components/page-hero/PageHero";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";
import "./ReviewPage.css";

// Отдельная ссылка для клиентов: тот же блок отзывов, что и на главной,
// с той же формой и отправкой на модерацию в админку.
const ReviewPage = () => {
  const { reviewHeroData: hero } = useLocaleHomeData();

  return (
    <div className="review-page">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
      />
      <Clients hideTitle className="review-page__clients" />
    </div>
  );
};

export default ReviewPage;
