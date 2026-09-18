"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { hobby1, hobby2, hobby3 } from "../../assets/images";
import { useAnalytics } from "../../analytics/AnalyticsProvider";
import "./HobbyPage.css";

const chips = ["Drone filming", "Video making", "Storytelling", "Aerial visuals"];

const videos = [
  {
    id: "52MGK5WuBCw",
    title: "Mountain flow",
    url: "https://www.youtube.com/embed/52MGK5WuBCw",
    desc: "Smooth alpine passes, soft dolly moves, and gentle tilt reveals.",
  },
  {
    id: "ck8Tmd8fyEw",
    title: "City orbit",
    url: "https://www.youtube.com/embed/ck8Tmd8fyEw",
    desc: "Tight orbits around architecture with precise horizon control.",
  },
  {
    id: "DUKtu-r9MlE",
    title: "Coastline run",
    url: "https://www.youtube.com/embed/DUKtu-r9MlE",
    desc: "Low, fast coastal shots with seamless speed ramps and fades.",
  },
  {
    id: "wozqmt-zbKU",
    title: "Forest light",
    url: "https://www.youtube.com/embed/wozqmt-zbKU",
    desc: "Golden-hour canopy glides and clean parallax between trees.",
  },
];

const HobbyPage = () => {
  const { track } = useAnalytics();
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
      <section className="hobby-hero">
        <div className="hobby-hero__bg" aria-hidden="true">
          <img src={hobby1} alt="" />
        </div>
        <div className="hobby-hero__container">
          <div className="hobby-hero__content">
            <div className="hobby-hero__eyebrow">Hobby</div>
            <h1 className="hobby-hero__title">Drone filming & video making</h1>
            <p className="hobby-hero__subtitle">
              I love capturing cities and nature from above, crafting smooth
              aerial moves and cinematic cuts. Each shot is planned for light,
              motion, and rhythm to tell a concise story without clutter.
            </p>
            <p className="hobby-hero__subtitle hobby-hero__subtitle--secondary">
              From scouting locations and timing golden hour, to stabilizing,
              grading, and sound design — I keep the workflow lean so the final
              clip feels polished and alive. Short edits, precise transitions,
              and color that supports the mood.
            </p>

            <div className="hobby-hero__chips">
              {chips.map((chip) => (
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
            <motion.img
              src={hobby2}
              alt="Drone hobby preview"
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
            <span className="hobby-hero__eyebrow">Showreel</span>
            <h2 className="hobby-videos__title">Selected drone clips</h2>
            <p className="hobby-videos__subtitle">
              Four short cuts that capture different moods: mountains, city, coast, and forest. Each clip is framed for flow, light, and rhythm.
            </p>
          </div>
          <div className="hobby-videos__grid">
            {videos.map((video) => (
              <article className="hobby-video-card" key={video.id}>
                <button
                  type="button"
                  className="hobby-video-card__player"
                  onClick={() => openVideo(video)}
                  aria-label={`Play ${video.title}`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
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
            <span className="hobby-fly__eyebrow">Fly with me</span>
            <h2 className="hobby-fly__title">
              Book a drone session and let the world rotate around your idea.
            </h2>
            <p className="hobby-fly__text">
              We plan light, movement, and transitions to deliver a cinematic
              narrative: scouting, shooting, stabilizing, and polishing with a
              short turnaround. Bring an event, project, or brand story and I
              will capture it from above.
            </p>
            <div className="hobby-fly__actions">
              <button
                className="hobby-fly__btn hobby-fly__btn--primary"
                type="button"
                onClick={() => track("cta", "click", "book-flight")}
              >
                Book a flight
              </button>
              <button
                className="hobby-fly__btn hobby-fly__btn--ghost"
                type="button"
              >
                See the gallery
              </button>
            </div>
          </div>
          <div className="hobby-fly__visual">
            <img src={hobby3} alt="Drone controller" />
          </div>
        </div>
      </section>

      {activeVideo && (
        <div className="hobby-video-modal">
          <div className="hobby-video-modal__overlay" onClick={closeVideo} />
          <div className="hobby-video-modal__content" role="dialog" aria-modal="true">
            <button
              type="button"
              className="hobby-video-modal__close"
              onClick={closeVideo}
              aria-label="Close video"
            >
              ✕
            </button>
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

