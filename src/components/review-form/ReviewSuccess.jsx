"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import "./ReviewSuccess.css";

const EASE_OUT = [0.22, 1, 0.36, 1];
const EASE_IN_OUT = [0.76, 0, 0.24, 1];

// По умолчанию шторка раскрывается из нижнего левого угла, где кнопка «Оставить отзыв».
const DEFAULT_ORIGIN = "20% 70%";
const t0 = 0.45;

// Ленты намеренно многоязычные: это «спасибо» от сайта, а не перевод интерфейса.
const TAPE_WORDS = ["Thank you", "Спасибо", "Merci", "Gracias", "Danke", "Grazie", "Obrigado"];
const STARS = 5;
const SPARKS = 10;
const EXCERPT_LENGTH = 120;

const excerpt = (text) =>
  text.length > EXCERPT_LENGTH ? `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…` : text;

const Tape = ({ className, reverse, delay }) => {
  // Слова повторяем дважды: трек сдвигается на −50% и бесшовно зацикливается.
  const words = [...TAPE_WORDS, ...TAPE_WORDS];
  return (
    <motion.div
      className={`review-success__tape ${className}`}
      aria-hidden="true"
      variants={{
        hidden: { x: reverse ? "60%" : "-60%", opacity: 0 },
        visible: { x: "0%", opacity: 1, transition: { delay, duration: 1.2, ease: EASE_OUT } },
      }}
    >
      <div className={`review-success__tape-track${reverse ? " is-reverse" : ""}`}>
        {words.map((word, i) => (
          <span className="review-success__tape-word" key={i}>
            {word}
            <span className="review-success__tape-star">✦</span>
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const Star = ({ index }) => (
  <motion.svg
    viewBox="0 0 24 24"
    className="review-success__star"
    variants={{
      hidden: { scale: 0, rotate: -60, opacity: 0 },
      visible: {
        scale: 1,
        rotate: 0,
        opacity: 1,
        transition: { delay: t0 + 1 + index * 0.09, type: "spring", stiffness: 420, damping: 14 },
      },
    }}
  >
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
  </motion.svg>
);

const Spark = ({ index }) => {
  const angle = (index / SPARKS) * Math.PI * 2;
  const distance = 150 + (index % 3) * 28;
  return (
    <motion.span
      className={`review-success__spark${index % 2 ? " is-alt" : ""}`}
      aria-hidden="true"
      variants={{
        hidden: { x: 0, y: 0, scale: 0, opacity: 0 },
        visible: {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance * 0.7,
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          transition: { delay: t0 + 1.35, duration: 1.1, ease: EASE_OUT },
        },
      }}
    />
  );
};

const ReviewSuccess = ({ title, message, review, origin = DEFAULT_ORIGIN }) => {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  // Карточка слегка наклоняется за курсором — как лежащая на столе открытка.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 18 });
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });

  const handlePointerMove = (e) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const initialLetter = review.name.trim().charAt(0).toUpperCase() || "✦";
  let charIndex = 0;

  return (
    <motion.div
      className="review-success"
      role="status"
      initial={initial}
      animate="visible"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <motion.div
        className="review-success__curtain"
        aria-hidden="true"
        variants={{
          hidden: { clipPath: `circle(0% at ${origin})` },
          visible: {
            clipPath: `circle(150% at ${origin})`,
            transition: { duration: 1.1, ease: EASE_IN_OUT },
          },
        }}
      >
        <span className="review-success__glow" />
        <span className="review-success__grain" />
      </motion.div>

      <div className="review-success__tapes">
        <Tape className="is-back" reverse delay={t0 + 0.1} />
        <Tape className="is-front" delay={t0} />
      </div>

      <div className="review-success__inner">
        <div className="review-success__stage">
          {Array.from({ length: SPARKS }, (_, i) => (
            <Spark key={i} index={i} />
          ))}

          <motion.div
            className="review-success__float"
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ delay: t0 + 1.6, duration: 5, ease: "easeInOut", repeat: Infinity }}
          >
            <motion.figure
              className="review-success__card"
              style={{ rotateX, rotateY }}
              variants={{
                hidden: { opacity: 0, y: 90, rotateZ: -12, scale: 0.85 },
                visible: {
                  opacity: 1,
                  y: 0,
                  rotateZ: -3,
                  scale: 1,
                  transition: { delay: t0 + 0.35, duration: 1.1, ease: EASE_OUT },
                },
              }}
            >
              <span className="review-success__quote" aria-hidden="true">“</span>
              <div className="review-success__stars" aria-hidden="true">
                {Array.from({ length: STARS }, (_, i) => (
                  <Star key={i} index={i} />
                ))}
              </div>
              <blockquote className="review-success__text">{excerpt(review.text)}</blockquote>
              <figcaption className="review-success__author">
                <span className="review-success__avatar" aria-hidden="true">
                  {review.photo ? <img src={review.photo} alt="" /> : initialLetter}
                </span>
                <span className="review-success__who">
                  <span className="review-success__name">{review.name}</span>
                  {review.company && (
                    <span className="review-success__company">{review.company}</span>
                  )}
                </span>
              </figcaption>
              <motion.span
                className="review-success__stamp"
                aria-hidden="true"
                variants={{
                  hidden: { scale: 2.4, opacity: 0, rotate: -30 },
                  visible: {
                    scale: 1,
                    opacity: 1,
                    rotate: -14,
                    transition: { delay: t0 + 1.55, type: "spring", stiffness: 380, damping: 16 },
                  },
                }}
              >
                ✓
              </motion.span>
            </motion.figure>
          </motion.div>
        </div>

        <h3 className="review-success__title" aria-label={title}>
          {title.split(" ").map((word, wordIndex) => (
            <span className="review-success__word" key={wordIndex} aria-hidden="true">
              {Array.from(word).map((char) => {
                const i = charIndex++;
                return (
                  <span className="review-success__mask" key={i}>
                    <motion.span
                      className="review-success__char"
                      variants={{
                        hidden: { y: "115%", rotate: 8 },
                        visible: {
                          y: "0%",
                          rotate: 0,
                          transition: { delay: t0 + 0.7 + i * 0.03, duration: 0.9, ease: EASE_OUT },
                        },
                      }}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          ))}
        </h3>

        <motion.p
          className="review-success__message"
          variants={{
            hidden: { opacity: 0, y: 16, filter: "blur(10px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { delay: t0 + 1.2, duration: 0.9, ease: EASE_OUT },
            },
          }}
        >
          {message}
        </motion.p>

      </div>
    </motion.div>
  );
};

export default ReviewSuccess;
