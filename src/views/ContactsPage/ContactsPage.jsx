"use client";

import ContactsForm from "../../components/contacts/ContactsForm";
import contactsData from "../../data/contactsData";
import "./ContactsPage.css";

const ContactsPage = () => {
  return (
    <div className="contacts-page">
      <section className="contacts-hero">
        <div className="contacts-hero__container">
          <div className="contacts-hero__content">
            <div className="contacts-hero__eyebrow">Contact</div>
            <h1 className="contacts-hero__title">
              Ready to build your next digital experience?
            </h1>
            <p className="contacts-hero__subtitle">
              I handle user research, UI systems, front-end implementation, and
              launch guidance. Let’s map your goals, define the scope, and turn
              it into a polished, responsive product that feels alive on both
              light and dark themes.
            </p>
            <p className="contacts-hero__subtitle contacts-hero__subtitle--secondary">
              Drop a note with the project details, timeline, or budget — I
              usually reply within 24 hours.
            </p>
          </div>
          <div className="contacts-hero__chips">
            {["UI/UX", "Responsive", "Design Systems", "React", "Motion"].map(
              (chip) => (
                <span key={chip} className="contacts-hero__chip">
                  {chip}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <section className="contacts-panel">
        <div className="contacts-panel__container">
          <div className="contacts-panel__info">
            <h2 className="contacts-panel__title">Drop a message</h2>
            <p className="contacts-panel__lead">
              Choose a preferred channel or share the story. Everything below is
              monitored daily.
            </p>
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

