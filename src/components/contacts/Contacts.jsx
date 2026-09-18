"use client";

import "./Contacts.css";
import ContactsRight from "./ContactsRight";
import ContactsLeft from "./ContactsLeft";
import SectionTitle from "../section-title/SectionTitle";

const Contacts = () => {
  return (
    <section className="contact section" id="contact">
      <div className="container flex-center">
        <SectionTitle title="Contact me" subtitle="Contact me" />
        <div className="contact-wrapper">
          <ContactsLeft/>
          <ContactsRight/>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
