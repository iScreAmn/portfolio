"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import portfolioData from "../../data/portfolioData";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";
import "./FeaturedPortfolio.css";

const FeaturedPortfolio = () => {
  const router = useRouter();
  const { featuredPortfolioSectionData } = useLocaleHomeData();
  const featured = useMemo(
    () =>
      portfolioData.slice(0, featuredPortfolioSectionData.featuredCount),
    [featuredPortfolioSectionData.featuredCount]
  );

  return (
    <section className="featured-portfolio section" id="featured-portfolio">
      <div className="featured-portfolio__container">
        <div className="featured-portfolio__header">
          <h2 className="featured-portfolio__title">
            {featuredPortfolioSectionData.title}
          </h2>
          <p className="featured-portfolio__subtitle">
            {featuredPortfolioSectionData.subtitle}
          </p>
          <button
            className="featured-portfolio__btn"
            type="button"
            onClick={() =>
              router.push(featuredPortfolioSectionData.allProjectsButton.path)
            }
          >
            {featuredPortfolioSectionData.allProjectsButton.text}
          </button>
        </div>

        <div className="featured-portfolio__grid">
          {featured.map((item) => (
            <article
              key={item.id}
              className="featured-portfolio__card"
              onClick={() => router.push(`/portfolio/${item.slug}`)}
            >
              <div className="featured-portfolio__media">
                <img src={item.imgSrc} alt={item.title} loading="lazy" />
                <span className="featured-portfolio__category">
                  {item.category || "Project"}
                </span>
              </div>
              <div className="featured-portfolio__body">
                <h3 className="featured-portfolio__name">{item.title}</h3>
                <p className="featured-portfolio__description">{item.description}</p>
                <div className="featured-portfolio__meta">
                  <span>{item.year || "---"}</span>
                  {(item.tags || []).slice(0, 2).map((tag) => (
                    <span key={tag} className="featured-portfolio__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPortfolio;

