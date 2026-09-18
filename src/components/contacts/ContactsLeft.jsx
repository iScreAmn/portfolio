"use client";

import contactsData from "../../data/contactsData";
import { motion } from "motion/react";
import { slideInVariants } from "../../utils/animation";

const ContactsLeft = () => {
  return (
    <div className="contact-left">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={slideInVariants("top", 0.7, 50, false)}
      >
        Let`s discuss your project
      </motion.h2>
      <ul className="contact-list">
        {contactsData.map((item, index) => (
          <motion.li
            key={item.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            custom={index}
            variants={slideInVariants("top", 0.7, 50, true)}
          >
            <h3>
              <item.icon /> {item.title}
            </h3>
            <span>
              <a href={item.link}>{item.value}</a>
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default ContactsLeft;
