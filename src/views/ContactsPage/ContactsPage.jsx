"use client";

import ContactsForm from "../../components/contacts/ContactsForm";
import { getContactsData } from "../../data/contactsData";
import { contactsHeroData } from "../../data/contactsHeroData";
import { useLocale } from "../../context/LocaleContext";
import "./ContactsPage.css";

const ContactsPage = () => {
  const { locale } = useLocale();
  const hero = contactsHeroData[locale] || contactsHeroData.en;
  const contactsData = getContactsData(locale);

  return (
    <div className="contacts-page">
      <section className="contacts-hero">
        <div className="contacts-hero__container">
          <div className="contacts-hero__content">
            <div className="contacts-hero__eyebrow">{hero.eyebrow}</div>
            <h1 className="contacts-hero__title">{hero.title}</h1>
            <p className="contacts-hero__subtitle">{hero.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="contacts-panel">
        <div className="contacts-panel__container">
          <div className="contacts-panel__info">
            <h2 className="contacts-panel__title">{hero.panelTitle}</h2>
            <p className="contacts-panel__lead">{hero.panelLead}</p>
            <ul className="contacts-panel__list">
              {contactsData.map((item) => (
                <li key={item.id} className="contacts-panel__item">
                  <span className="contacts-panel__item-icon">
                    <item.icon />
                  </span>
                  <div>
                    <p className="contacts-panel__item-title">{item.title}</p>
                    <a
                      className="contacts-panel__item-link"
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.value}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
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

