"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";
import { useLocalePortfolioData } from "../../hooks/useLocalePortfolioData";
import "./FeaturedPortfolio.css";

const FeaturedPortfolio = () => {
  const router = useRouter();
  const { featuredPortfolioSectionData } = useLocaleHomeData();
  const { projects, projectCardLabels } = useLocalePortfolioData();
  const featured = useMemo(
    () =>
      projects.slice(0, featuredPortfolioSectionData.featuredCount),
    [projects, featuredPortfolioSectionData.featuredCount]
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
                <Image
                  src={item.imgSrc}
                  alt={item.title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  placeholder="blur"
                />
                <span className="featured-portfolio__category">
                  {item.category || projectCardLabels.categoryFallback}
                </span>
              </div>
              <div className="featured-portfolio__body">
                <h3 className="featured-portfolio__name">{item.title}</h3>
                <p className="featured-portfolio__description">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPortfolio;

