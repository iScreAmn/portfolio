"use client";

import Image from "next/image";
import { aboutImg } from "../../assets/images";
import { useLocaleAboutData } from "../../hooks/useLocaleAboutData";
import "./AboutPage.css";

const AboutPage = () => {
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
    <div className="about-page">
      <section className="about-page__hero">
        <div className="about-page__container">
          <div className="about-page__content">
            <h1 className="about-page__title">{heroData.title}</h1>
            <p className="about-page__lead">{heroData.lead}</p>
            <p className="about-page__subtitle">
              {heroData.subtitle}
            </p>
            <p className="about-page__subtitle about-page__subtitle--secondary">
              {heroData.subtitleSecondary}
            </p>

            <div className="about-page__chips">
              {heroData.chips.map((chip) => (
                <span className="about-page__chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>

            <div className="about-page__actions">
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
            </div>
          </div>

          <div className="about-page__poster">
            <Image
              src={aboutImg}
              alt={posterAlt}
              sizes="(max-width: 768px) 100vw, 500px"
              placeholder="blur"
              priority
            />
          </div>
        </div>
      </section>

      <section className="about-page__details">
        <div className="about-page__container about-page__details-container">
          <div className="about-page__block about-page__block--stack">
            <div className="about-page__block-header">
              <span className="about-page__eyebrow">{sectionLabels.stack}</span>
            </div>
            <div className="about-page__tags">
              {skills.map((item) => (
                <span key={item.skill} className="about-page__tag">
                  {item.skill}
                </span>
              ))}
            </div>
          </div>

          <div className="about-page__block about-page__block--education">
            <div className="about-page__block-header">
              <span className="about-page__eyebrow">{sectionLabels.education}</span>
            </div>
            <div className="about-page__cards">
              {education.map((item) => (
                <article className="about-page__card" key={`${item.year}-${item.degree}`}>
                  <div className="about-page__card-top">
                    <span className="about-page__pill">{item.year}</span>
                    <span className="about-page__meta">{item.institution}</span>
                  </div>
                  <h3 className="about-page__card-title">{item.degree}</h3>
                </article>
              ))}
            </div>
          </div>

          <div className="about-page__block about-page__block--experience">
            <div className="about-page__block-header">
              <span className="about-page__eyebrow">{sectionLabels.experience}</span>
            </div>
            <div className="about-page__cards about-page__cards--grid">
              {workExperience.map((item) => (
                <article className="about-page__card about-page__card--exp" key={`${item.title}-${item.period}`}>
                  <div className="about-page__card-top">
                    <span className="about-page__pill">{item.period}</span>
                    <span className="about-page__meta">{item.company}</span>
                  </div>
                  <h3 className="about-page__card-title">{item.title}</h3>
                  <p className="about-page__card-text">{item.description}</p>
                  <span className="about-page__meta about-page__meta--dim">
                    {item.employmentType}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
