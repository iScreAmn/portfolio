"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Fragment, useRef } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { aboutImg } from "../../assets/images";
import SectionTitle from "../section-title/SectionTitle";
import AnimatedNumber from "../widgets/animatedNumber/AnimatedNumber";
import ProfileCard from "../widgets/profileCard/ProfileCard";
import MagneticButton from "../widgets/magneticButton/MagneticButton";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import "./About.css";

const EASE_OUT = [0.22, 1, 0.36, 1];
const IN_VIEW = { once: true, amount: 0.4 };

// Слова заголовка выезжают из-под маски, последнее — акцентное с контуром.
const Heading = ({ text }) => {
  const words = text.split(" ");
  return (
    <motion.h3
      className="about__heading"
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={IN_VIEW}
      transition={{ staggerChildren: 0.1 }}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="about__mask" aria-hidden="true">
            <motion.span
              className={`about__word${i === words.length - 1 ? " is-accent" : ""}`}
              variants={{
                hidden: { y: "115%", rotate: 6 },
                visible: { y: "0%", rotate: 0, transition: { duration: 1, ease: EASE_OUT } },
              }}
            >
              {word}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </motion.h3>
  );
};

// Описание проявляется по словам из размытия.
const Description = ({ text }) => (
  <motion.p
    className="about__text"
    aria-label={text}
    initial="hidden"
    whileInView="visible"
    viewport={IN_VIEW}
    transition={{ staggerChildren: 0.025, delayChildren: 0.5 }}
  >
    {text.split(" ").map((word, i) => (
      <motion.span
        key={i}
        aria-hidden="true"
        variants={{
          hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.6, ease: EASE_OUT },
          },
        }}
      >
        {word}{" "}
      </motion.span>
    ))}
  </motion.p>
);

const About = () => {
  const { profList, aboutSectionData } = useLocaleHomeData();
  const isMobileViewport = useMediaQuery("(max-width: 768px)");
  const reduceMotion = useReducedMotion();
  const wrapperRef = useRef(null);

  // Лёгкий параллакс: карточка и декор движутся с разной скоростью.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });
  const parallax = !reduceMotion && !isMobileViewport;
  const cardY = useTransform(scrollYProgress, [0, 1], parallax ? [50, -50] : [0, 0]);
  const frameY = useTransform(scrollYProgress, [0, 1], parallax ? [-30, 30] : [0, 0]);
  const frameRotate = useTransform(scrollYProgress, [0, 1], parallax ? [-10, 4] : [-6, -6]);

  return (
    <section className="about section" id="about">
      <div className="container flex-center">
        <SectionTitle
          title={aboutSectionData.sectionTitle}
          subtitle={aboutSectionData.sectionSubtitle}
        />
        <div className="about__wrapper" ref={wrapperRef}>
          <div className="about__visual">
            <div className="about__glow" aria-hidden="true" />
            <motion.span
              className="about__dots"
              style={{ y: frameY }}
              aria-hidden="true"
            />
            {/* clip-path скрывает карточку от IntersectionObserver,
                поэтому появление запускает родитель. */}
            <motion.div
              className="about__stage"
              style={{ y: cardY }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="about__frame"
                style={{ y: frameY, rotate: frameRotate }}
                aria-hidden="true"
              />
              <motion.div
                className="about__card"
                variants={{
                  hidden: { clipPath: "inset(100% 0% 0% 0% round 30px)", scale: 1.08 },
                  visible: {
                    clipPath: "inset(0% 0% 0% 0% round 30px)",
                    scale: 1,
                    transition: { duration: 1.2, ease: EASE_OUT },
                  },
                }}
              >
                <ProfileCard
                  name=""
                  title=""
                  handle="dimitri.j"
                  status={aboutSectionData.profileCard.status}
                  contactText={aboutSectionData.profileCard.contactText}
                  innerGradient={true}
                  avatarUrl={aboutImg.src}
                  showUserInfo={true}
                  enableTilt={true}
                  enableMobileTilt={false}
                  onContactClick={() => window.open("https://t.me/iscreamn", "_blank")}
                />
              </motion.div>
            </motion.div>
          </div>

          <div className="about__info">
            <Heading text={aboutSectionData.heading} />

            <motion.div
              className="about__role"
              initial="hidden"
              whileInView="visible"
              viewport={IN_VIEW}
            >
              <motion.span
                className="about__role-line"
                variants={{
                  hidden: { scaleX: 0 },
                  visible: { scaleX: 1, transition: { delay: 0.3, duration: 0.9, ease: EASE_OUT } },
                }}
              />
              <span className="about__role-mask">
                <motion.h4
                  variants={{
                    hidden: { y: "105%" },
                    visible: { y: "0%", transition: { delay: 0.45, duration: 0.8, ease: EASE_OUT } },
                  }}
                >
                  <span>{aboutSectionData.taglineRole}</span>
                </motion.h4>
              </span>
            </motion.div>

            <Description text={aboutSectionData.description} />

            <motion.ul
              className="about__stats"
              initial="hidden"
              whileInView="visible"
              viewport={IN_VIEW}
              transition={{ staggerChildren: 0.12, delayChildren: 0.2 }}
            >
              {profList.map((item, index) => (
                <motion.li
                  className="about__stat"
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
                  }}
                >
                  <span className="about__stat-number">
                    <AnimatedNumber
                      value={item.number}
                      duration={2}
                      delay={isMobileViewport ? 0 : index * 0.2}
                    />
                  </span>
                  <span className="about__stat-text">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="about__cta"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ delay: 0.4, duration: 0.8, ease: EASE_OUT }}
            >
              <MagneticButton
                href={aboutSectionData.moreAboutButton.path}
                text={aboutSectionData.moreAboutButton.text}
                icon={FaArrowRightLong}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
