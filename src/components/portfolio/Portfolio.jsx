"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { setPendingScroll } from "../../utils/pendingScroll";
import "./Portfolio.css";
import portfolioData from "../../data/portfolioData";
import PortfolioItem from "./PortfolioItem";
import { useLocalePortfolioData } from "../../hooks/useLocalePortfolioData";

const Portfolio = () => {
  const router = useRouter();
  const { portfolioHeroData } = useLocalePortfolioData();

  const chips = useMemo(() => {
    const unique = new Set();
    portfolioData.forEach((item) => {
      unique.add(item.category || "Digital");
    });
    return Array.from(unique).slice(0, 6);
  }, []);

  const handleScrollToGrid = () => {
    const grid = document.getElementById("portfolio-grid");
    if (grid) {
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleContact = () => {
    setPendingScroll("contact");
    router.push("/");
  };

  return (
    <div className="portfolio-page">
      <section className="portfolio-hero">
        <div className="portfolio-hero__container">
          <div className="portfolio-hero__eyebrow">{portfolioHeroData.eyebrow}</div>
          <h1 className="portfolio-hero__title">{portfolioHeroData.title}</h1>
          <p className="portfolio-hero__subtitle">{portfolioHeroData.subtitle}</p>

          <div className="portfolio-hero__chips">
            {chips.map((chip) => (
              <span key={chip} className="portfolio-hero__chip">
                {chip}
              </span>
            ))}
          </div>

          <div className="portfolio-hero__actions">
            <button
              className="portfolio-hero__btn portfolio-hero__btn--primary"
              onClick={handleScrollToGrid}
            >
              {portfolioHeroData.viewWorkButton}
            </button>
            <button
              className="portfolio-hero__btn portfolio-hero__btn--ghost"
              onClick={handleContact}
            >
              {portfolioHeroData.planProjectButton}
            </button>
          </div>
        </div>
      </section>

      <section className="portfolio-grid" id="portfolio-grid">
        <div className="portfolio-grid__container">
          <div className="portfolio-grid__list">
            {portfolioData.map((item, index) => (
              <PortfolioItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
