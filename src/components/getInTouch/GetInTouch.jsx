"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { GiForwardField } from "react-icons/gi";
import "./GetInTouch.css";
import { project } from "../../assets/images";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";

const EASE_OUT = [0.22, 1, 0.36, 1];
const SPRING = { stiffness: 150, damping: 18, mass: 0.4 };

// Слова заголовка выезжают из-под маски по одному, сквозная нумерация даёт задержку.
const Headline = ({ lines, accent }) => {
  let index = 0;
  return (
    <h2 className="git__headline" aria-hidden="true">
      {lines.map((line, lineIndex) => (
        <span className={`git__line git__line--${lineIndex}`} key={lineIndex}>
          {line.split(" ").map((word) => {
            const i = index++;
            return (
              <span className="git__mask" key={i}>
                <motion.span
                  className={`git__word${word === accent ? " is-accent" : ""}`}
                  variants={{
                    hidden: { y: "110%", rotate: 6 },
                    visible: {
                      y: "0%",
                      rotate: 0,
                      transition: { delay: 0.15 + i * 0.09, duration: 1, ease: EASE_OUT },
                    },
                  }}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
};

const GetInTouch = () => {
  const { getInTouchData: copy } = useLocaleHomeData();
  const reduceMotion = useReducedMotion();
  const cardRef = useRef(null);

  // Положение курсора в карточке: 0…1 по обеим осям, по умолчанию — центр.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);

  const spotX = useTransform(sx, (v) => `${v * 100}%`);
  const spotY = useTransform(sy, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${spotX} ${spotY}, var(--git-glow), transparent 65%)`;

  // Бейдж «притягивается» к курсору, картинка уходит в противоход — даёт глубину.
  const badgeX = useTransform(sx, [0, 1], [-28, 28]);
  const badgeY = useTransform(sy, [0, 1], [-20, 20]);
  const imageX = useTransform(sx, [0, 1], [18, -18]);
  const imageY = useTransform(sy, [0, 1], [12, -12]);
  const imageRotate = useTransform(sx, [0, 1], [-4, 4]);

  const handleMove = (event) => {
    if (reduceMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const marqueeWords = Array.from({ length: 6 }, () => copy.marquee);

  return (
    <section className="get-in-touch sub-section">
      <div className="container">
        <Link href="/contacts" className="get-in-touch-link" aria-label={copy.label}>
          <motion.div
            ref={cardRef}
            className="git"
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
          >
            <span className="git__bg" aria-hidden="true">
              <motion.span className="git__spotlight" style={{ background: spotlight }} />
              <span className="git__grain" />
            </span>

            <div className="git__marquee" aria-hidden="true">
              <div className="git__marquee-track">
                {[...marqueeWords, ...marqueeWords].map((word, i) => (
                  <span className="git__marquee-word" key={i}>
                    {word}
                    <GiForwardField className="git__marquee-star" />
                  </span>
                ))}
              </div>
            </div>

            <motion.div
              className="git__top"
              variants={{
                hidden: { opacity: 0, y: -12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
              }}
            >
              <span className="git__eyebrow">
                <GiForwardField className="git__eyebrow-index" aria-hidden="true" />
                {copy.eyebrow}
              </span>
            </motion.div>

            <div className="git__body">
              <Headline lines={copy.lines} accent={copy.accent} />

              {/* Внешняя обёртка отвечает за появление, внутренняя — за параллакс. */}
              <motion.div
                className="git__visual"
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 40 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { delay: 0.35, duration: 1.1, ease: EASE_OUT },
                  },
                }}
              >
                <motion.div style={{ x: imageX, y: imageY, rotate: imageRotate }}>
                  <Image
                    src={project}
                    alt=""
                    className="git__image"
                    sizes="(max-width: 768px) 40vw, 320px"
                  />
                </motion.div>
              </motion.div>
            </div>

            <div className="git__bottom">
              {/* На десктопе плашка поднимается в правый верхний угол, на телефоне стоит рядом с бейджем. */}
              <motion.span
                className="git__status"
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.8, ease: EASE_OUT } },
                }}
              >
                <span className="git__status-dot" />
                {copy.status}
              </motion.span>

              <motion.span
                className="git__badge"
                aria-hidden="true"
                style={{ x: badgeX, y: badgeY }}
                variants={{
                  hidden: { opacity: 0, scale: 0.4, rotate: -90 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    transition: { delay: 0.5, duration: 1, ease: EASE_OUT },
                  },
                }}
              >
                <svg className="git__badge-ring" viewBox="0 0 200 200">
                  <defs>
                    <path id="git-badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                  </defs>
                  <text>
                    <textPath href="#git-badge-circle" textLength="488">
                      {copy.badge}
                    </textPath>
                  </text>
                </svg>
                <span className="git__badge-core">
                  <span className="git__badge-arrow">→</span>
                </span>
              </motion.span>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
};

export default GetInTouch;
