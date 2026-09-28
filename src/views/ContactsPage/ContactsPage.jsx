"use client";

import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import ContactsForm from "../../components/contacts/ContactsForm";
import { useLocaleContactsData } from "../../hooks/useLocaleContactsData";
import "./ContactsPage.css";

const ContactsPage = () => {
  const { contactsHeroData: hero, contactsItems, contactsSocials } = useLocaleContactsData();
  // Последнее слово заголовка подсвечиваем — текст при этом не меняется.
  const titleSplit = hero.title.lastIndexOf(" ");
  const titleHead = hero.title.slice(0, titleSplit + 1);
  const titleAccent = hero.title.slice(titleSplit + 1);

  return (
    <div className="contacts-page">
      <section className="contacts-hero">
        <div className="contacts-hero__container">
          <div className="contacts-hero__content">
            <div className="contacts-hero__eyebrow">
              <span className="contacts-hero__eyebrow-dot" aria-hidden="true" />
              {hero.eyebrow}
            </div>
            <h1 className="contacts-hero__title">
              {titleHead}
              <span className="contacts-hero__title-accent">
                {titleAccent}
                <svg
                  className="contacts-hero__title-scribble"
                  viewBox="0 0 300 24"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M3 17 C 60 5, 120 5, 170 12 S 260 20, 297 7" />
                </svg>
              </span>
            </h1>
            <div className="contacts-hero__bottom">
              <p className="contacts-hero__subtitle">{hero.subtitle}</p>
              <a className="contacts-hero__scroll" href="#contacts-panel" aria-label={hero.panelTitle}>
                <FiArrowDown />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="contacts-panel" id="contacts-panel">
        <div className="contacts-panel__container">
          <div className="contacts-panel__info">
            <div className="contacts-panel__glow" aria-hidden="true" />

            <div className="contacts-panel__top">
              <span className="contacts-panel__status">
                <span className="contacts-panel__status-dot" />
                {hero.panelStatus}
              </span>
            </div>

            <div className="contacts-panel__heading">
              <h2 className="contacts-panel__title">{hero.panelTitle}</h2>
              <div className="contacts-panel__badge" aria-hidden="true">
                <svg className="contacts-panel__badge-ring" viewBox="0 0 100 100">
                  <defs>
                    <path
                      id="contacts-badge-circle"
                      d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                    />
                  </defs>
                  {/* textLength растягивает фразу ровно на длину окружности (2π·38). */}
                  <text textLength="238" lengthAdjust="spacingAndGlyphs">
                    <textPath href="#contacts-badge-circle" textLength="238">
                      {hero.panelBadge}
                    </textPath>
                  </text>
                </svg>
                <FiArrowUpRight className="contacts-panel__badge-arrow" />
              </div>
            </div>
            <p className="contacts-panel__lead">{hero.panelLead}</p>

            <ul className="contacts-panel__list">
              {contactsItems.map((item, index) => (
                <li key={item.id}>
                  <a className="contacts-panel__row" href={item.link}>
                    <span className="contacts-panel__row-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="contacts-panel__row-icon">
                      <item.icon />
                    </span>
                    <span className="contacts-panel__row-body">
                      <span className="contacts-panel__row-title">{item.title}</span>
                      <span className="contacts-panel__row-value">{item.value}</span>
                    </span>
                    <FiArrowUpRight className="contacts-panel__row-arrow" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="contacts-panel__socials">
              <p className="contacts-panel__socials-title">{hero.panelSocialsTitle}</p>
              <div className="contacts-panel__socials-grid">
                {contactsSocials.map((social) => (
                  <a
                    key={social.id}
                    className={`contacts-panel__social contacts-panel__social--${social.id}`}
                    href={social.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.title}
                  >
                    <social.icon className="contacts-panel__social-icon" />
                    <span className="contacts-panel__social-name">{social.title}</span>
                    <span className="contacts-panel__social-handle">{social.handle}</span>
                    <FiArrowUpRight className="contacts-panel__social-arrow" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contacts-panel__form">
            <ContactsForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactsPage;

