"use client";

import Link from "next/link";
import { useAnalytics } from "../../analytics/AnalyticsProvider";

const PortfolioItem = ({ item, index }) => {
  const { track } = useAnalytics();

  return (
    <article className="portfolio-img-card portfolio-grid__card">
      <Link
        href={`/portfolio/${item.slug}`}
        className="portfolio-card__link"
        aria-label={`Открыть проект ${item.title}`}
        onClick={() => track("project", "open", item.slug, { block: "portfolio-grid" })}
      >
        <div className="img-card">
          <div className="overlay" />
          <div className="inf">
            <h3 className="portfolio-card__title">{item.title}</h3>
            <span className="portfolio-card__category">
              {item.category || "Project"}
            </span>
          </div>
          <img src={item.imgSrc} alt={item.title} />
        </div>
      </Link>
    </article>
  );
};

export default PortfolioItem;
