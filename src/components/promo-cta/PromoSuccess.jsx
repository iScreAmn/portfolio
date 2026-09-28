"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import "./PromoSuccess.css";

export const EASE_OUT = [0.22, 1, 0.36, 1];
const EASE_IN_OUT = [0.76, 0, 0.24, 1];

/** Момент, от которого считают задержки и сцена, и содержимое карточки. */
export const T0 = 0.45;

// По умолчанию шторка раскрывается из нижнего левого угла, где кнопка призыва.
const DEFAULT_ORIGIN = "20% 70%";
const SPARKS = 10;

const Tape = ({ words, icon, className, reverse, delay }) => {
  // Слова повторяем с запасом: трек сдвигается на −50% и бесшовно зацикливается.
  const track = words.length < 4 ? [...words, ...words, ...words, ...words] : [...words, ...words];
  return (
    <motion.div
      className={`promo-success__tape ${className}`}
      aria-hidden="true"
      variants={{
        hidden: { x: reverse ? "60%" : "-60%", opacity: 0 },
        visible: { x: "0%", opacity: 1, transition: { delay, duration: 1.2, ease: EASE_OUT } },
      }}
    >
      <div className={`promo-success__tape-track${reverse ? " is-reverse" : ""}`}>
        {track.map((word, i) => (
          <span className="promo-success__tape-word" key={i}>
            {word}
            <span className="promo-success__tape-star">{icon}</span>
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const Spark = ({ index }) => {
  const angle = (index / SPARKS) * Math.PI * 2;
  const distance = 150 + (index % 3) * 28;
  return (
    <motion.span
      className={`promo-success__spark${index % 2 ? " is-alt" : ""}`}
      aria-hidden="true"
      variants={{
        hidden: { x: 0, y: 0, scale: 0, opacity: 0 },
        visible: {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance * 0.7,
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          transition: { delay: T0 + 1.35, duration: 1.1, ease: EASE_OUT },
        },
      }}
    />
  );
};

/**
 * Сцена благодарности в карточке: шторка из точки отправки, бегущие ленты,
 * 3D-карточка с печатью (содержимое — children), искры, заголовок по буквам.
 * Варианты hidden/visible наследуются, поэтому детям хватает своих variants.
 */
const PromoSuccess = ({ title, message, tapeWords, tapeIcon = "✦", origin = DEFAULT_ORIGIN, className = "", children }) => {
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

  let charIndex = 0;

  return (
    <motion.div
      className={`promo-success ${className}`.trim()}
      role="status"
      initial={initial}
      animate="visible"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <motion.div
        className="promo-success__curtain"
        aria-hidden="true"
        variants={{
          hidden: { clipPath: `circle(0% at ${origin})` },
          visible: {
            clipPath: `circle(150% at ${origin})`,
            transition: { duration: 1.1, ease: EASE_IN_OUT },
          },
        }}
      >
        <span className="promo-success__glow" />
        <span className="promo-success__grain" />
      </motion.div>

      <div className="promo-success__tapes">
        <Tape words={tapeWords} icon={tapeIcon} className="is-back" reverse delay={T0 + 0.1} />
        <Tape words={tapeWords} icon={tapeIcon} className="is-front" delay={T0} />
      </div>

      <div className="promo-success__inner">
        <div className="promo-success__stage">
          {Array.from({ length: SPARKS }, (_, i) => (
            <Spark key={i} index={i} />
          ))}

          <motion.div
            className="promo-success__float"
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ delay: T0 + 1.6, duration: 5, ease: "easeInOut", repeat: Infinity }}
          >
            <motion.figure
              className="promo-success__card"
              style={{ rotateX, rotateY }}
              variants={{
                hidden: { opacity: 0, y: 90, rotateZ: -12, scale: 0.85 },
                visible: {
                  opacity: 1,
                  y: 0,
                  rotateZ: -3,
                  scale: 1,
                  transition: { delay: T0 + 0.35, duration: 1.1, ease: EASE_OUT },
                },
              }}
            >
              {children}
              <motion.span
                className="promo-success__stamp"
                aria-hidden="true"
                variants={{
                  hidden: { scale: 2.4, opacity: 0, rotate: -30 },
                  visible: {
                    scale: 1,
                    opacity: 1,
                    rotate: -14,
                    transition: { delay: T0 + 1.55, type: "spring", stiffness: 380, damping: 16 },
                  },
                }}
              >
                ✓
              </motion.span>
            </motion.figure>
          </motion.div>
        </div>

        <h3 className="promo-success__title" aria-label={title}>
          {title.split(" ").map((word, wordIndex) => (
            <span className="promo-success__word" key={wordIndex} aria-hidden="true">
              {Array.from(word).map((char) => {
                const i = charIndex++;
                return (
                  <span className="promo-success__mask" key={i}>
                    <motion.span
                      className="promo-success__char"
                      variants={{
                        hidden: { y: "115%", rotate: 8 },
                        visible: {
                          y: "0%",
                          rotate: 0,
                          transition: { delay: T0 + 0.7 + i * 0.03, duration: 0.9, ease: EASE_OUT },
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
          className="promo-success__message"
          variants={{
            hidden: { opacity: 0, y: 16, filter: "blur(10px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { delay: T0 + 1.2, duration: 0.9, ease: EASE_OUT },
            },
          }}
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default PromoSuccess;
