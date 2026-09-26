"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { hobby1, hobby2, hobby3 } from "../../assets/images";
import ModalCloseButton from "../../components/modal-close-button/ModalCloseButton";
import { useAnalytics } from "../../analytics/AnalyticsProvider";
import { useLocaleHobbyData } from "../../hooks/useLocaleHobbyData";
import "./HobbyPage.css";

// Анимированная обёртка над next/image: motion.img не умеет работать со
// статическим импортом, а motion.create сохраняет ту же разметку, что и <Image>.
const MotionImage = motion.create(Image);

const HobbyPage = () => {
  const { track } = useAnalytics();
  const { heroData, videosSection, videos, flyData } = useLocaleHobbyData();
  const [activeVideo, setActiveVideo] = useState(null);

  const openVideo = (video) => {
    track("media", "play", video.title);
    setActiveVideo(video);
    document.body.classList.add("no-scroll");
  };

  const closeVideo = () => {
    setActiveVideo(null);
    document.body.classList.remove("no-scroll");
  };

  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e) => e.key === "Escape" && closeVideo();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeVideo]);

  return (
    <div className="hobby-page">
      <section className="hobby-hero" data-header-contrast="dark">
        <div className="hobby-hero__bg" aria-hidden="true">
          <Image src={hobby1} alt="" sizes="100vw" priority />
        </div>
        <div className="hobby-hero__container">
          <div className="hobby-hero__content">
            <div className="hobby-hero__eyebrow">{heroData.eyebrow}</div>
            <h1 className="hobby-hero__title">{heroData.title}</h1>
            <p className="hobby-hero__subtitle">{heroData.subtitle}</p>
            <p className="hobby-hero__subtitle hobby-hero__subtitle--secondary">
              {heroData.subtitleSecondary}
            </p>

            <div className="hobby-hero__chips">
              {heroData.chips.map((chip) => (
                <span className="hobby-hero__chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            className="hobby-hero__poster"
            initial={{ opacity: 0, x: 120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <MotionImage
              src={hobby2}
              alt={heroData.posterAlt}
              sizes="(max-width: 1024px) 100vw, 40vw"
              placeholder="blur"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            />
          </motion.div>
        </div>
      </section>

      <section className="hobby-videos">
        <div className="hobby-videos__container">
          <div className="hobby-videos__header">
            <span className="hobby-hero__eyebrow">{videosSection.eyebrow}</span>
            <h2 className="hobby-videos__title">{videosSection.title}</h2>
            <p className="hobby-videos__subtitle">{videosSection.subtitle}</p>
          </div>
          <div className="hobby-videos__grid">
            {videos.map((video) => (
              <article className="hobby-video-card" key={video.id}>
                <button
                  type="button"
                  className="hobby-video-card__player"
                  onClick={() => openVideo(video)}
                  aria-label={`${videosSection.playLabel} ${video.title}`}
                >
                  <Image
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    width={480}
                    height={360}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="hobby-video-card__play">▶</span>
                </button>
                <div className="hobby-video-card__body">
                  <h3 className="hobby-video-card__title">{video.title}</h3>
                  <p className="hobby-video-card__text">{video.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hobby-fly">
        <div className="hobby-fly__container">
          <div className="hobby-fly__content">
            <span className="hobby-fly__eyebrow">{flyData.eyebrow}</span>
            <h2 className="hobby-fly__title">{flyData.title}</h2>
            <p className="hobby-fly__text">{flyData.text}</p>
            <div className="hobby-fly__actions">
              <button
                className="hobby-fly__btn hobby-fly__btn--primary"
                type="button"
                onClick={() => track("cta", "click", "book-flight")}
              >
                {flyData.primaryButton}
              </button>
              <button
                className="hobby-fly__btn hobby-fly__btn--ghost"
                type="button"
              >
                {flyData.secondaryButton}
              </button>
            </div>
          </div>
          <div className="hobby-fly__visual">
            <Image
              src={hobby3}
              alt={flyData.imageAlt}
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
            />
          </div>
        </div>
      </section>

      {activeVideo && (
        <div className="hobby-video-modal">
          <div className="hobby-video-modal__overlay" onClick={closeVideo} />
          <div className="hobby-video-modal__content" role="dialog" aria-modal="true">
            <ModalCloseButton onClick={closeVideo} label={videosSection.closeLabel} />
            <div className="hobby-video-modal__frame">
              <iframe
                src={`${activeVideo.url}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="hobby-video-modal__meta">
              <h3>{activeVideo.title}</h3>
              <p>{activeVideo.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HobbyPage;

