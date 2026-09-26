"use client";

import { MotionConfig, motion } from "motion/react";
import Image from "next/image";
import { aboutImg } from "../../assets/images";
import { useLocale } from "../../context/LocaleContext";
import { useLocaleAboutData } from "../../hooks/useLocaleAboutData";
import "./AboutPage.css";

const EASE = [0.22, 1, 0.36, 1];

const staggerVariants = (stagger = 0.1, delay = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const popVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE } },
};

const posterVariants = {
  hidden: { opacity: 0, x: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.8, delay: 0.2, ease: EASE },
  },
};

const inViewProps = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.2 },
};

const AboutPage = () => {
  const { locale } = useLocale();
  const aboutContent = useLocaleAboutData();
  const {
    heroData,
    cvData,
    socialLinks,
    sectionLabels,
    workExperience,
    skills,
    education,
    posterAlt,
  } = aboutContent;

  return (
    <MotionConfig reducedMotion="user">
      <div className="about-page">
        <section className="about-page__hero">
          <div className="about-page__container">
            <motion.div
              className="about-page__content"
              initial="hidden"
              animate="visible"
              variants={staggerVariants(0.12, 0.1)}
            >
              <motion.h1
                className="about-page__title"
                variants={fadeUpVariants}
              >
                {heroData.title}
              </motion.h1>
              <motion.p className="about-page__lead" variants={fadeUpVariants}>
                {heroData.lead}
              </motion.p>
              <motion.p
                className="about-page__subtitle"
                variants={fadeUpVariants}
              >
                {heroData.subtitle}
              </motion.p>
              <motion.p
                className="about-page__subtitle about-page__subtitle--secondary"
                variants={fadeUpVariants}
              >
                {heroData.subtitleSecondary}
              </motion.p>

              <motion.div
                className="about-page__actions"
                variants={fadeUpVariants}
              >
                <a
                  className="about-page__btn about-page__btn--primary"
                  href={cvData.filePath}
                  download
                >
                  {cvData.downloadText}
                </a>
                <div className="about-page__social">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.ariaLabel}
                        className="about-page__social-btn"
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.ariaLabel}
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="about-page__poster"
              initial="hidden"
              animate="visible"
              variants={posterVariants}
            >
              <Image
                src={aboutImg}
                alt={posterAlt}
                sizes="(max-width: 768px) 100vw, 500px"
                placeholder="blur"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* Ключ по локали перемонтирует блоки при смене языка: иначе теги и
            карточки, которых нет в другой локали, появляются уже после
            срабатывания whileInView и остаются с opacity: 0. */}
        <section className="about-page__details" key={locale}>
          <div className="about-page__container about-page__details-container">
            <motion.div
              className="about-page__block about-page__block--stack"
              {...inViewProps}
              variants={staggerVariants(0.04)}
            >
              <div className="about-page__block-header">
                <span className="about-page__eyebrow">
                  {sectionLabels.stack}
                </span>
              </div>
              <div className="about-page__tags">
                {skills.map((item) => (
                  <motion.span
                    key={item.skill}
                    className="about-page__tag"
                    variants={popVariants}
                  >
                    {item.skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="about-page__block about-page__block--education"
              {...inViewProps}
              variants={staggerVariants(0.12)}
            >
              <div className="about-page__block-header">
                <span className="about-page__eyebrow">
                  {sectionLabels.education}
                </span>
              </div>
              <div className="about-page__cards">
                {education.map((item) => (
                  <motion.article
                    className="about-page__card"
                    key={`${item.year}-${item.degree}`}
                    variants={fadeUpVariants}
                  >
                    <div className="about-page__card-top">
                      <span className="about-page__pill">{item.year}</span>
                      <span className="about-page__meta">
                        {item.institution}
                      </span>
                    </div>
                    <h3 className="about-page__card-title">{item.degree}</h3>
                  </motion.article>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="about-page__block about-page__block--experience"
              {...inViewProps}
              variants={staggerVariants(0.12)}
            >
              <div className="about-page__block-header">
                <span className="about-page__eyebrow">
                  {sectionLabels.experience}
                </span>
              </div>
              <div className="about-page__cards about-page__cards--grid">
                {workExperience.map((item) => (
                  <motion.article
                    className="about-page__card about-page__card--exp"
                    key={`${item.title}-${item.period}`}
                    variants={fadeUpVariants}
                  >
                    <div className="about-page__card-top">
                      <span className="about-page__pill">{item.period}</span>
                      <span className="about-page__meta">{item.company}</span>
                    </div>
                    <h3 className="about-page__card-title">{item.title}</h3>
                    <p className="about-page__card-text">{item.description}</p>
                    <span className="about-page__meta about-page__meta--dim">
                      {item.employmentType}
                    </span>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
};

export default AboutPage;
