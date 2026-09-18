"use client";

import { motion } from "framer-motion";
import { educationVariants, sectionVariants } from "../../utils/animation";
import { useLocaleAboutData } from "../../hooks/useLocaleAboutData";

const Education = () => {
  const { education } = useLocaleAboutData();
  return (
    <motion.div 
      className="education"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.h4 
        className="label"
        variants={educationVariants}
        custom={0}
      >
        Education
      </motion.h4>
      <motion.ul 
        className="education-list"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {education.map((item, index) => (
          <motion.li 
            className="item" 
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut" },
              },
            }}
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.3 }
            }}
          >
            <span className="year">{item.year}</span>
            <p>{item.degree} - {item.institution}</p>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default Education;
