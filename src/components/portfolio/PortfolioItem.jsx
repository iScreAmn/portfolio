"use client";

import Link from "next/link";
import Image from "next/image";
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
          <Image
            src={item.imgSrc}
            alt={item.title}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
          />
        </div>
      </Link>
    </article>
  );
};

export default PortfolioItem;
