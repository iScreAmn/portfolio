"use client";

import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import { flameJumper2 } from "../../assets/images";
import { useAnalytics } from "../../analytics/AnalyticsProvider";
import { useLocaleGameData } from "../../hooks/useLocaleGameData";
import "./GamePage.css";

const GamePage = () => {
  const { track } = useAnalytics();
  const { heroData, infoCards } = useLocaleGameData();

  return (
    <div className="game-page">
      <section className="game-hero">
        <div className="game-hero__container">
          <div className="game-hero__content">
            <div className="game-hero__eyebrow">{heroData.eyebrow}</div>
            <h1 className="game-hero__title">{heroData.title}</h1>
            <p className="game-hero__subtitle">{heroData.subtitle}</p>
            <p className="game-hero__subtitle game-hero__subtitle--secondary">
              {heroData.subtitleSecondary}
            </p>

            <div className="game-hero__chips">
              {heroData.chips.map((chip) => (
                <span className="game-hero__chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>

            <div className="game-hero__actions">
              <a
                className="game-hero__btn game-hero__btn--primary"
                href="https://iscreamn.github.io/game-jumper/"
                target="_blank"
                rel="noreferrer"
                onClick={() => track("cta", "click", "game-play")}
              >
                {heroData.playButton}
              </a>
              <a
                className="game-hero__btn game-hero__btn--ghost"
                href="https://github.com/iScreAmn/game-jumper"
                target="_blank"
                rel="noreferrer"
                onClick={() => track("cta", "click", "game-github")}
              >
                {heroData.githubButton} <FaGithub />
              </a>
            </div>
          </div>

          <div className="game-hero__poster">
            {/* Анимированный GIF: оптимизатор свёл бы его к одному кадру. */}
            <Image src={flameJumper2} alt={heroData.posterAlt} unoptimized />
          </div>
        </div>
      </section>

      <section className="game-info">
        <div className="game-info__container">
          {infoCards.map((card) => (
            <div className="game-info__card" key={card.title}>
              <h3 className="game-info__title">{card.title}</h3>
              <p className="game-info__text">{card.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GamePage;

