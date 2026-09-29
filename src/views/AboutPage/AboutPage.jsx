"use client";

import { Fragment, useRef } from "react";
import { MotionConfig, motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { FaArrowDown } from "react-icons/fa";
import { aboutImg } from "../../assets/images";
import { useLocale } from "../../context/LocaleContext";
import { useLocaleAboutData } from "../../hooks/useLocaleAboutData";
import MagneticButton from "../../components/widgets/magneticButton/MagneticButton";
import "./AboutPage.css";

const EASE = [0.22, 1, 0.36, 1];

const stagger = (step = 0.1, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
});

// Слово выезжает из-под маски с лёгким поворотом.
const riseVariants = {
  hidden: { y: "115%", rotate: 6 },
  visible: { y: "0%", rotate: 0, transition: { duration: 1.1, ease: EASE } },
};

// Слово проявляется из размытия.
const blurVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.2, ease: EASE } },
};

const inView = (amount = 0.3) => ({
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount },
});

// Текст по словам: «rise» — из-под маски, «blur» — из размытия.
// Слова скрыты от скринридеров, полный текст лежит рядом в sr-only.
const RevealText = ({
  as = "p",
  text,
  className,
  variant = "rise",
  step = 0.03,
  delay = 0,
  trigger = "view",
}) => {
  const Tag = motion[as];
  const triggerProps =
    trigger === "view" ? inView(0.4) : { initial: "hidden", animate: "visible" };

  return (
    <Tag className={className} variants={stagger(step, delay)} {...triggerProps}>
      <span className="about-page__sr">{text}</span>
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          {variant === "rise" ? (
            <span className="about-page__mask" aria-hidden="true">
              <motion.span className="about-page__word" variants={riseVariants}>
                {word}
              </motion.span>
            </span>
          ) : (
            <motion.span
              className="about-page__word"
              aria-hidden="true"
              variants={blurVariants}
            >
              {word}
            </motion.span>
          )}{" "}
        </Fragment>
      ))}
    </Tag>
  );
};

// Заголовок секции с номером и счётчиком элементов.
const SectionHead = ({ index, label, count }) => (
  <div className="about-page__head">
    <motion.span className="about-page__index" variants={fadeUpVariants} {...inView()}>
      ({String(index).padStart(2, "0")})
    </motion.span>
    <h2 className="about-page__heading">
      <RevealText as="span" text={label} step={0.08} />
      <motion.sup
        className="about-page__count"
        variants={fadeUpVariants}
        {...inView()}
      >
        {count}
      </motion.sup>
    </h2>
  </div>
);

// Две стрелки: при наведении одна уезжает вниз, вторая приходит сверху.
const DownloadIcon = () => (
  <span className="about-page__cta-icon" aria-hidden="true">
    <FaArrowDown />
    <FaArrowDown />
  </span>
);

// Имя: слова выезжают из-под маски, последнее — контурное справа.
const HeroTitle = ({ text }) => {
  const words = text.split(" ");
  return (
    <h1 className="about-page__title">
      <span className="about-page__sr">{text}</span>
      {words.map((word, i) => (
        <span
          key={i}
          className={`about-page__title-line${
            i === words.length - 1 && words.length > 1 ? " is-accent" : ""
          }`}
          aria-hidden="true"
        >
          <span className="about-page__mask">
            <motion.span
              className="about-page__title-word"
              initial={{ y: "115%", rotate: 8 }}
              animate={{ y: "0%", rotate: 0 }}
              transition={{ delay: 0.15 + i * 0.14, duration: 1.2, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>
        </span>
      ))}
    </h1>
  );
};

// Строка навыков, бегущая по кругу; при скролле дополнительно сдвигается.
const Marquee = ({ items, x, reverse = false, outline = false }) => (
  <motion.div
    className={`about-page__marquee${reverse ? " is-reverse" : ""}${
      outline ? " is-outline" : ""
    }`}
    style={{ x }}
    aria-hidden={outline || undefined}
  >
    <div className="about-page__marquee-track">
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          className="about-page__marquee-list"
          aria-hidden={copy === 1 || undefined}
        >
          {items.map((item) => (
            <li key={item.skill} className="about-page__marquee-item">
              <span>{item.skill}</span>
              <span className="about-page__marquee-star" aria-hidden="true">
                ✦
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  </motion.div>
);

const AboutPage = () => {
  const { locale } = useLocale();
  const {
    heroData,
    cvData,
    socialLinks,
    sectionLabels,
    workExperience,
    skills,
    education,
    posterAlt,
  } = useLocaleAboutData();

  const posterRef = useRef(null);
  const stackRef = useRef(null);

  const { scrollYProgress: posterProgress } = useScroll({
    target: posterRef,
    offset: ["start end", "end start"],
  });
  const posterImgY = useTransform(posterProgress, [0, 1], ["-10%", "10%"]);
  const posterRingRotate = useTransform(posterProgress, [0, 1], [-40, 80]);

  const { scrollYProgress: stackProgress } = useScroll({
    target: stackRef,
    offset: ["start end", "end start"],
  });
  const rowAX = useTransform(stackProgress, [0, 1], ["4%", "-12%"]);
  const rowBX = useTransform(stackProgress, [0, 1], ["-12%", "4%"]);

  const leadDelay = 0.6 + heroData.title.split(" ").length * 0.14;

  return (
    <MotionConfig reducedMotion="user">
      {/* Ключ по локали перемонтирует страницу при смене языка: иначе слова и
          карточки, которых нет в другой локали, появляются уже после
          срабатывания whileInView и остаются скрытыми. */}
      <div className="about-page" key={locale}>
        {/* ===== Hero ===== */}
        <section className="about-page__hero">
          <div className="about-page__blob" aria-hidden="true" />

          <div className="container">
            <motion.div
              className="about-page__eyebrow-row"
              initial="hidden"
              animate="visible"
              variants={stagger(0.1)}
            >
              <motion.span className="about-page__eyebrow" variants={fadeUpVariants}>
                <span className="about-page__eyebrow-dot" aria-hidden="true" />
                {heroData.eyebrow}
              </motion.span>
              <motion.span
                className="about-page__eyebrow-line"
                variants={lineVariants}
                aria-hidden="true"
              />
            </motion.div>

            <HeroTitle text={heroData.title} />

            <div className="about-page__hero-grid">
              <div className="about-page__poster-wrap" ref={posterRef}>
                <motion.div
                  className="about-page__ring"
                  style={{ rotate: posterRingRotate }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="96" />
                  </svg>
                  <span className="about-page__orbit" />
                </motion.div>

                <motion.figure
                  className="about-page__poster"
                  initial={{ clipPath: "inset(100% 0% 0% 0% round 28px)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
                  transition={{ delay: 0.35, duration: 1.4, ease: EASE }}
                >
                  <motion.div
                    className="about-page__poster-inner"
                    style={{ y: posterImgY }}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.35, duration: 1.8, ease: EASE }}
                  >
                    <Image
                      src={aboutImg}
                      alt={posterAlt}
                      fill
                      sizes="(max-width: 980px) 90vw, 460px"
                      placeholder="blur"
                      priority
                    />
                  </motion.div>
                </motion.figure>
              </div>

              <div className="about-page__content">
                <RevealText
                  text={heroData.lead}
                  className="about-page__lead"
                  step={0.05}
                  delay={leadDelay}
                  trigger="mount"
                />

                <motion.span
                  className="about-page__divider"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: leadDelay + 0.3, duration: 1.2, ease: EASE }}
                  aria-hidden="true"
                />

                <div className="about-page__texts">
                  <RevealText
                    text={heroData.subtitle}
                    className="about-page__text"
                    variant="blur"
                    step={0.012}
                    delay={leadDelay + 0.4}
                    trigger="mount"
                  />
                  <RevealText
                    text={heroData.subtitleSecondary}
                    className="about-page__text about-page__text--ink"
                    variant="blur"
                    step={0.012}
                    delay={leadDelay + 0.6}
                    trigger="mount"
                  />
                </div>

                <motion.div
                  className="about-page__actions"
                  initial="hidden"
                  animate="visible"
                  variants={stagger(0.08, leadDelay + 0.9)}
                >
                  <motion.div variants={fadeUpVariants}>
                    <MagneticButton
                      href={cvData.filePath}
                      text={cvData.downloadText}
                      icon={DownloadIcon}
                      download
                      className="about-page__cta"
                    />
                  </motion.div>

                  <ul className="about-page__socials">
                    {socialLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <motion.li key={link.href} variants={fadeUpVariants}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={link.ariaLabel}
                          >
                            <Icon />
                          </a>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Стек ===== */}
        <section className="about-page__stack" ref={stackRef}>
          <div className="container">
            <SectionHead index={1} label={sectionLabels.stack} count={skills.length} />
          </div>

          <div className="about-page__marquees">
            <Marquee items={skills} x={rowAX} />
            <Marquee items={skills} x={rowBX} reverse outline />
          </div>
        </section>

        {/* ===== Опыт ===== */}
        <section className="about-page__section">
          <div className="container">
            <SectionHead
              index={2}
              label={sectionLabels.experience}
              count={workExperience.length}
            />

            <div className="about-page__jobs">
              {workExperience.map((item, i) => (
                <motion.article
                  className="about-page__job"
                  key={`${item.title}-${item.period}`}
                  {...inView(0.35)}
                  variants={stagger(0.08)}
                >
                  <motion.span
                    className="about-page__job-line"
                    variants={lineVariants}
                    aria-hidden="true"
                  />
                  <motion.span className="about-page__job-index" variants={fadeUpVariants}>
                    {String(i + 1).padStart(2, "0")}
                  </motion.span>
                  <motion.span className="about-page__job-period" variants={fadeUpVariants}>
                    {item.period}
                  </motion.span>
                  <div className="about-page__job-main">
                    <h3 className="about-page__job-title">
                      <span className="about-page__mask">
                        <motion.span
                          className="about-page__word"
                          variants={riseVariants}
                        >
                          {item.title}
                        </motion.span>
                      </span>
                    </h3>
                    <motion.p className="about-page__job-text" variants={fadeUpVariants}>
                      {item.description}
                    </motion.p>
                  </div>
                  <motion.div className="about-page__job-meta" variants={fadeUpVariants}>
                    <span className="about-page__job-company">{item.company}</span>
                    <span className="about-page__job-type">{item.employmentType}</span>
                  </motion.div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Образование ===== */}
        <section className="about-page__section about-page__section--edu">
          <div className="container">
            <SectionHead
              index={3}
              label={sectionLabels.education}
              count={education.length}
            />

            <motion.div
              className="about-page__edu"
              {...inView(0.25)}
              variants={stagger(0.14)}
            >
              <motion.span
                className="about-page__edu-rail"
                variants={lineVariants}
                aria-hidden="true"
              />
              <ol className="about-page__edu-list">
                {education.map((item) => (
                  <motion.li
                    className="about-page__edu-item"
                    key={`${item.year}-${item.degree}`}
                    variants={fadeUpVariants}
                  >
                    <span className="about-page__edu-dot" aria-hidden="true" />
                    <span className="about-page__edu-year">{item.year}</span>
                    <h3 className="about-page__edu-degree">{item.degree}</h3>
                    <span className="about-page__edu-inst">{item.institution}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
};

export default AboutPage;
