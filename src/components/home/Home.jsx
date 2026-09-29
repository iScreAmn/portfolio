"use client";

import "./Home.css";
import Image from "next/image";
import { FaLaptopCode } from "react-icons/fa";
import { aboutCover } from "../../assets/images";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Fragment, useMemo, useRef } from "react";
import { useLocaleAboutData } from "../../hooks/useLocaleAboutData";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";

const EASE_OUT = [0.22, 1, 0.36, 1];
const SPRING = { stiffness: 120, damping: 20, mass: 0.5 };

// Слова заголовка выезжают из-под маски, последнее слово — акцентное.
// После обращения с запятой («Hey,») строка переносится.
const Headline = ({ text }) => {
  const words = text.split(" ");
  return (
    <h1 className="home__title" aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="home__mask" aria-hidden="true">
            <motion.span
              className={`home__word${i === words.length - 1 ? " is-accent" : ""}`}
              initial={{ y: "115%", rotate: 8 }}
              animate={{ y: "0%", rotate: 0 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 1.1, ease: EASE_OUT }}
            >
              {word}
            </motion.span>
          </span>
          {word.endsWith(",") && <span className="home__break" aria-hidden="true" />}
        </Fragment>
      ))}
    </h1>
  );
};

// Описание проявляется по словам из размытия.
const Description = ({ text, delay }) => (
  <p className="home__text" aria-label={text}>
    {text.split(" ").map((word, i) => (
      <motion.span
        key={i}
        aria-hidden="true"
        initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: delay + i * 0.04, duration: 0.6, ease: EASE_OUT }}
      >
        {word}{" "}
      </motion.span>
    ))}
  </p>
);

const Home = () => {
  const { homeData } = useLocaleHomeData();
  const { socialLinks } = useLocaleAboutData();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);

  const icons = useMemo(
    () =>
      socialLinks.map((link, index) => {
        const Icon = link.icon;
        return { id: index + 1, href: link.href, icon: <Icon /> };
      }),
    [socialLinks]
  );

  const ContactIcon = homeData.contactButton.icon;
  const ScrollIcon = homeData.scrollDown.icon;
  const titleWords = homeData.greeting.split(" ").length;
  const textDelay = 0.5 + titleWords * 0.12;

  // Курсор в секции: 0…1 по обеим осям, по умолчанию — центр.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);


  const photoRotateX = useTransform(sy, [0, 1], [8, -8]);
  const photoRotateY = useTransform(sx, [0, 1], [-10, 10]);
  const blobX = useTransform(sx, [0, 1], [30, -30]);
  const blobY = useTransform(sy, [0, 1], [24, -24]);
  const ringX = useTransform(sx, [0, 1], [-18, 18]);
  const ringY = useTransform(sy, [0, 1], [-14, 14]);

  // Магнитная кнопка.
  const mx = useSpring(0, { stiffness: 200, damping: 14, mass: 0.3 });
  const my = useSpring(0, { stiffness: 200, damping: 14, mass: 0.3 });

  const handleMove = (event) => {
    if (reduceMotion) return;
    const rect = sectionRef.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const handleCtaMove = (event) => {
    if (reduceMotion) return;
    const rect = ctaRef.current.getBoundingClientRect();
    mx.set((event.clientX - rect.left - rect.width / 2) * 0.35);
    my.set((event.clientY - rect.top - rect.height / 2) * 0.45);
  };

  const handleCtaLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      className="home"
      id="home"
      ref={sectionRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="container home__wrapper">
        <motion.ul
          className="home__socials"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 1 } } }}
        >
          {icons.map((item) => (
            <motion.li
              key={item.id}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT } },
              }}
            >
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.icon}
              </a>
            </motion.li>
          ))}
        </motion.ul>

        <div className="home__info">
          <Headline text={homeData.greeting} />

          <motion.div
            className="home__role"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: textDelay - 0.2, duration: 0.4 }}
          >
            <motion.span
              className="home__role-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: textDelay - 0.2, duration: 0.9, ease: EASE_OUT }}
            />
            <span className="home__role-mask">
              <motion.h3
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ delay: textDelay, duration: 0.8, ease: EASE_OUT }}
              >
                {homeData.role}
              </motion.h3>
            </span>
          </motion.div>

          <Description text={homeData.description} delay={textDelay + 0.2} />

          <motion.div
            className="home__cta-wrap"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: textDelay + 0.7, duration: 0.8, ease: EASE_OUT }}
          >
            <motion.a
              ref={ctaRef}
              href={homeData.contactButton.href}
              target="_blank"
              rel="noreferrer"
              className="home__cta"
              style={{ x: mx, y: my }}
              onMouseMove={handleCtaMove}
              onMouseLeave={handleCtaLeave}
            >
              <span className="home__cta-fill" aria-hidden="true" />
              <span className="home__cta-label" data-text={homeData.contactButton.text}>
                <span>{homeData.contactButton.text}</span>
              </span>
              <span className="home__cta-icon">
                <ContactIcon />
              </span>
            </motion.a>
          </motion.div>
        </div>

        <div className="home__visual">
          <motion.div className="home__blob" style={{ x: blobX, y: blobY }} aria-hidden="true" />
          <motion.div className="home__ring" style={{ x: ringX, y: ringY }} aria-hidden="true">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="96" />
            </svg>
            <span className="home__orbit" />
          </motion.div>

          <motion.div
            className="home__photo"
            style={{ rotateX: photoRotateX, rotateY: photoRotateY }}
            initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
            transition={{ delay: 0.3, duration: 1.4, ease: EASE_OUT }}
          >
            <Image
              src={aboutCover}
              alt={homeData.imageAlt}
              className="home__photo-img"
              sizes="(max-width: 980px) 260px, 420px"
              placeholder="blur"
              priority
            />
          </motion.div>

          <motion.span
            className="home__sticker"
            aria-hidden="true"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 180, damping: 12 }}
          >
            <FaLaptopCode />
          </motion.span>
        </div>
      </div>

      <motion.a
        href={homeData.scrollDown.href}
        className="home__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: textDelay + 1, duration: 0.8 }}
      >
        <span>{homeData.scrollDown.text}</span>
        <span className="home__scroll-track">
          <ScrollIcon className="home__scroll-icon" />
        </span>
      </motion.a>
    </section>
  );
};

export default Home;
