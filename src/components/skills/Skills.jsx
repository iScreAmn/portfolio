"use client";

import { motion } from "framer-motion";
import { skillsVariants, sectionVariants } from "../../utils/animation";
import { useLocaleAboutData } from "../../hooks/useLocaleAboutData";

const Skills = () => {
  const { skills } = useLocaleAboutData();
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
        variants={skillsVariants}
        custom={0}
      >
        Skills
      </motion.h4>
      <motion.ul 
        className="bars"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {skills.map((item, index) => (
          <motion.li 
            className="bar" 
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
            <div className="info">
              <span>{item.skill}</span>
              <span>{item.level}</span>
            </div>
            <div className="line html"></div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default Skills;
