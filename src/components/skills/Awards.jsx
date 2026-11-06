"use client";

import { motion } from "motion/react";
import { slideInVariants } from "../../utils/animation";
import { useDictionary } from "../../i18n/useDictionary";

const Awards = () => {
  const { awards } = useDictionary("about");

  return (
    <div className="education awards-section">
      <motion.h3
        className="work-exp-title"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        custom={2}
        variants={slideInVariants("left", 0.7, 50, true)}
      >
        Work & Experience
      </motion.h3>
      <ul className="education-list">
        {awards.map((item, index) => (
          <li className="item" key={index}>
          <span>{item.year}</span>
          <p>
            <span>{item.title} - {item.institution}</span> 
          </p>
        </li>
        ))}
      </ul>
    </div>
  );
};

export default Awards;
