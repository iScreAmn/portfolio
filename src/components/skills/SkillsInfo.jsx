"use client";

import { motion } from "motion/react";
import { slideInVariants, sectionVariants } from "../../utils/animation";
import SectionTitle from "../section-title/SectionTitle";
import Awards from "./Awards";
import Education from "./Education";
import Skills from "./Skills";
import WorkExperience from "./WorkExperience";
import "./Skills.css";

const SkillsInfo = () => {
  return (
    <section className="skills section" id="skills">
      <div className="container flex-center">
        <SectionTitle title="Skills" subtitle="Skills" />
        <motion.div 
          className="inner__content"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="skills-description"
            variants={slideInVariants("top", 0.6, 50, true)}
          >
            <h3>Education & Skills</h3>
            <p>
            I spent two years studying web development, honing my skills in this field. For the past year, I've been working professionally, building my own web applications and delivering modern, functional solutions
            </p>
          </motion.div>
          <div className="skills-info education-all">
            <motion.div variants={slideInVariants("top", 0.7, 50, true)}>
              <Education />
            </motion.div>
            <motion.div variants={slideInVariants("top", 0.7, 50, true)}>
              <Skills />
            </motion.div>
            <motion.div variants={slideInVariants("top", 0.7, 50, true)}>
              <Awards />
            </motion.div>
          </div>
          <WorkExperience />
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsInfo;
