"use client";

import ContactsForm from "./ContactsForm";
import { motion } from "motion/react";
import { slideInVariants } from "../../utils/animation";

const ContactsRight = () => {
  return (
    <div className="contact-right">
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={slideInVariants("top", 0.7, 50, false)}
      >
        I`m always open to discussing product{" "}
        <span>design work or partnerships</span>
      </motion.p>
      <ContactsForm />
    </div>
  );
};

export default ContactsRight;
