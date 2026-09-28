"use client";

import { motion, useReducedMotion } from "motion/react";
import "./PromoCta.css";

const EASE_OUT = [0.22, 1, 0.36, 1];

const Tape = ({ words, icon, className, reverse, delay }) => {
  // Слова повторяем с запасом: трек сдвигается на −50% и бесшовно зацикливается.
  const track = [...words, ...words, ...words, ...words];
  return (
    <motion.div
      className={`promo-cta__tape ${className}`}
      aria-hidden="true"
      variants={{
        hidden: { x: reverse ? "60%" : "-60%", opacity: 0 },
        visible: { x: "0%", opacity: 1, transition: { delay, duration: 1.2, ease: EASE_OUT } },
      }}
    >
      <div className={`promo-cta__tape-track${reverse ? " is-reverse" : ""}`}>
        {track.map((word, i) => (
          <span className="promo-cta__tape-word" key={i}>
            {word}
            <span className="promo-cta__tape-star">{icon}</span>
          </span>
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Призыв в карточке рядом с калькулятором и отзывами: ленты с текстами блока,
 * заголовок по буквам и кнопка, открывающая форму.
 */
const PromoCta = ({ title, text, buttonLabel, onOpen, buttonRef, tapeIcon = "✦" }) => {
  const reduceMotion = useReducedMotion();
  const tapeWords = [buttonLabel, title];
  let charIndex = 0;

  return (
    <motion.div
      className="promo-cta"
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <span className="promo-cta__bg" aria-hidden="true">
        <span className="promo-cta__glow" />
        <span className="promo-cta__grain" />
      </span>

      <div className="promo-cta__tapes">
        <Tape words={tapeWords} icon={tapeIcon} className="is-back" reverse delay={0.1} />
        <Tape words={tapeWords} icon={tapeIcon} className="is-front" delay={0} />
      </div>

      <div className="promo-cta__content">
        <h3 className="promo-cta__title" aria-label={title}>
          {title.split(" ").map((word, wordIndex) => (
            <span className="promo-cta__word" key={wordIndex} aria-hidden="true">
              {Array.from(word).map((char) => {
                const i = charIndex++;
                return (
                  <span className="promo-cta__mask" key={i}>
                    <motion.span
                      className="promo-cta__char"
                      variants={{
                        hidden: { y: "115%", rotate: 8 },
                        visible: {
                          y: "0%",
                          rotate: 0,
                          transition: { delay: 0.25 + i * 0.03, duration: 0.9, ease: EASE_OUT },
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
          className="promo-cta__text"
          variants={{
            hidden: { opacity: 0, y: 16, filter: "blur(10px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { delay: 0.7, duration: 0.9, ease: EASE_OUT },
            },
          }}
        >
          {text}
        </motion.p>

        <motion.button
          ref={buttonRef}
          type="button"
          className="promo-cta__button"
          onClick={onOpen}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.8, ease: EASE_OUT } },
          }}
        >
          <span className="promo-cta__button-label" data-label={buttonLabel}>
            <span>{buttonLabel}</span>
          </span>
          <span className="promo-cta__button-arrow" aria-hidden="true">→</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PromoCta;
