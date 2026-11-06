"use client";

import { Clients } from "../../components/index";
import PageHero from "../../components/page-hero/PageHero";
import { useDictionary } from "../../i18n/useDictionary";
import "./ReviewPage.css";

const ReviewPage = () => {
  const { reviewHeroData: hero } = useDictionary("home");

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
