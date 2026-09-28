"use client";

import { motion, useReducedMotion } from "motion/react";

// «Экспо»-кривые, которыми обычно двигают крупную типографику и шторки.
const EASE_OUT = [0.22, 1, 0.36, 1];
const EASE_IN_OUT = [0.76, 0, 0.24, 1];

// По умолчанию шторка раскрывается из угла, где была кнопка «Отправить».
const DEFAULT_ORIGIN = "88% 90%";
const CURTAIN_DURATION = 1.1;

const t0 = CURTAIN_DURATION * 0.55;

const CalculatorCompletion = ({ eyebrow, title, message, origin = DEFAULT_ORIGIN }) => {
  const reduceMotion = useReducedMotion();
  // При reduced motion всё сразу стоит на местах.
  const initial = reduceMotion ? false : "hidden";

  const words = title.split(" ");
  let charIndex = 0;

  return (
    <motion.div className="calculator-completion" initial={initial} animate="visible" role="status">
      <motion.div
        className="calculator-completion__curtain"
        aria-hidden="true"
        variants={{
          hidden: { clipPath: `circle(0% at ${origin})` },
          visible: {
            clipPath: `circle(150% at ${origin})`,
            transition: { duration: CURTAIN_DURATION, ease: EASE_IN_OUT },
          },
        }}
      >
        <motion.span
          className="calculator-completion__glow"
          animate={reduceMotion ? undefined : { x: ["-8%", "10%", "-8%"], y: ["0%", "-12%", "0%"] }}
          transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
        />
        <span className="calculator-completion__grain" />
      </motion.div>

      <div className="calculator-completion__inner">
        <div className="calculator-completion__eyebrow">
          <motion.span
            className="calculator-completion__eyebrow-line"
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { delay: t0, duration: 0.9, ease: EASE_OUT } },
            }}
          />
          <span className="calculator-completion__mask">
            <motion.span
              className="calculator-completion__eyebrow-text"
              variants={{
                hidden: { y: "110%" },
                visible: { y: "0%", transition: { delay: t0 + 0.15, duration: 0.8, ease: EASE_OUT } },
              }}
            >
              {eyebrow}
            </motion.span>
          </span>
        </div>

        <div className="calculator-completion__mark" aria-hidden="true">
          <motion.span
            className="calculator-completion__echo"
            variants={{
              hidden: { scale: 1, opacity: 0 },
              visible: {
                scale: [1, 1.9],
                opacity: [0.55, 0],
                transition: { delay: t0 + 1.05, duration: 1.4, ease: EASE_OUT },
              },
            }}
          />
          <svg viewBox="0 0 100 100" className="calculator-completion__svg">
            <motion.circle
              className="calculator-completion__track"
              cx="50"
              cy="50"
              r="46"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { delay: t0, duration: 0.6 } },
              }}
            />
            <motion.circle
              className="calculator-completion__ring"
              cx="50"
              cy="50"
              r="46"
              // Начинаем рисовать с «12 часов».
              transform="rotate(-90 50 50)"
              variants={{
                hidden: { pathLength: 0 },
                visible: { pathLength: 1, transition: { delay: t0, duration: 1.1, ease: EASE_IN_OUT } },
              }}
            />
            <motion.path
              className="calculator-completion__check"
              d="M32 51.5 L44.5 64 L69 38"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: {
                  pathLength: 1,
                  opacity: 1,
                  transition: { delay: t0 + 0.85, duration: 0.55, ease: EASE_OUT },
                },
              }}
            />
          </svg>
        </div>

        <h2 className="calculator-completion-title" aria-label={title}>
          {words.map((word, wordIndex) => (
            <span className="calculator-completion__word" key={wordIndex} aria-hidden="true">
              {Array.from(word).map((char) => {
                const i = charIndex++;
                return (
                  <span className="calculator-completion__mask" key={i}>
                    <motion.span
                      className="calculator-completion__char"
                      variants={{
                        hidden: { y: "115%", rotate: 8 },
                        visible: {
                          y: "0%",
                          rotate: 0,
                          transition: { delay: t0 + 0.35 + i * 0.045, duration: 0.95, ease: EASE_OUT },
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
        </h2>

        <motion.p
          className="calculator-completion-message"
          variants={{
            hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { delay: t0 + 0.75, duration: 1, ease: EASE_OUT },
            },
          }}
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default CalculatorCompletion;
