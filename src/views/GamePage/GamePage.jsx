"use client";

import { FaGithub } from "react-icons/fa";
import { flameJumper2 } from "../../assets/images";
import { useAnalytics } from "../../analytics/AnalyticsProvider";
import "./GamePage.css";

const GamePage = () => {
  const { track } = useAnalytics();
  const chips = ["Indie platformer", "Pixel art", "Web game", "Made with love"];

  return (
    <div className="game-page">
      <section className="game-hero">
        <div className="game-hero__container">
          <div className="game-hero__content">
            <div className="game-hero__eyebrow">Indie game</div>
            <h1 className="game-hero__title">Flame Jumper</h1>
            <p className="game-hero__subtitle">
              Dynamic platformer about a brave flame. Precise jumps, responsive
              controls, collectible shards, and traps that keep you on edge.
              Extra polish on feel, sound cues, and timing to make every jump
              satisfying.
            </p>
            <p className="game-hero__subtitle game-hero__subtitle--secondary">
              Built for the web: instant play, optimized assets, lightweight
              shaders. Supports keyboard and gamepad layouts, with adaptive UI
              for desktop, tablet, and mobile.
            </p>

            <div className="game-hero__chips">
              {chips.map((chip) => (
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
                Play now
              </a>
              <a
                className="game-hero__btn game-hero__btn--ghost"
                href="https://github.com/iScreAmn/game-jumper"
                target="_blank"
                rel="noreferrer"
                onClick={() => track("cta", "click", "game-github")}
              >
                Star me <FaGithub />
              </a>
            </div>
          </div>

          <div className="game-hero__poster">
            <img src={flameJumper2} alt="Flame Jumper cover" />
          </div>
        </div>
      </section>

      <section className="game-info">
        <div className="game-info__container">
          <div className="game-info__card">
            <h3 className="game-info__title">Core loop</h3>
            <p className="game-info__text">
              Short, challenging levels with tight restart times, collectible
              shards, and increasing hazards to keep flow and retention high.
            </p>
          </div>
          <div className="game-info__card">
            <h3 className="game-info__title">Feel-first controls</h3>
            <p className="game-info__text">
              Tuned coyote time, jump buffering, and variable height to make
              inputs forgiving but skillful.
            </p>
          </div>
          <div className="game-info__card">
            <h3 className="game-info__title">Tech & delivery</h3>
            <p className="game-info__text">
              Built for web delivery: optimized sprites, lazy-loaded audio, and
              smooth 60fps animations on desktop and mobile browsers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GamePage;

