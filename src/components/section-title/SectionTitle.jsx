"use client";

import { motion } from "motion/react";
import { titleVariants, subtitleVariants } from "../../utils/animation";
import "./SectionTitle.css";

const SectionTitle = ({ title, subtitle }) => {
  return (
    <>
      <motion.h2
        className="inner-title"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={titleVariants}
      >
        {title}
      </motion.h2>
      <motion.h3
        className="inner-subtitle"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={subtitleVariants}
      >
        {subtitle}
      </motion.h3>
    </>
  );
};

export default SectionTitle;
