"use client";

import { motion } from "motion/react";
import { slideInVariants } from "../../utils/animation";
import { useLocaleAboutData } from "../../hooks/useLocaleAboutData";

const WorkExperience = () => {
  const { workExperience } = useLocaleAboutData();
  return (
    <div className="education work-exp none">
      <motion.h3
        className="work-exp-title"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        custom={2}
        variants={slideInVariants("top", 0.7, 50, true)}
      >
        Work & Experience
      </motion.h3>
      <div className="expirience-info">
        {workExperience.map((item, index) => (
          <motion.div
            className="expirience-card"
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={index}
            variants={slideInVariants("top", 0.7, 50, true)}
          >
            <div className="upper">
              <h3>{item.title}</h3>
              <h5>{item.employmentType}</h5>
              <span>{item.period}</span>
              <div className="hr"></div>
            </div>
            <h4 className="label">{item.company}</h4>
            <p>{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkExperience;
