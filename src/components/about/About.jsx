"use client";

import { motion } from "motion/react";
import { aboutImg } from "../../assets/images";
import SectionTitle from "../section-title/SectionTitle";
import { slideInVariants } from "../../utils/animation";
import AnimatedNumber from "../widgets/animatedNumber/AnimatedNumber";
import "./About.css";
import ProfileCard from "../widgets/profileCard/ProfileCard";
import { useRouter } from "next/navigation";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";

const About = () => {
  const { profList, aboutSectionData } = useLocaleHomeData();
  const router = useRouter();
  const isMobileViewport =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;
  const professionalListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobileViewport ? 0 : 0.16,
        delayChildren: isMobileViewport ? 0 : 0.1,
      },
    },
  };
  const professionalListItemVariants = {
    hidden: { opacity: 0, y: isMobileViewport ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: isMobileViewport ? 0.25 : 0.45, ease: "easeOut" },
    },
  };

  const goToAboutPage = () => {
    router.push(aboutSectionData.moreAboutButton.path);
  };

  return (
    <section className="about section" id="about">
      <div className="container flex-center">
        <SectionTitle
          title={aboutSectionData.sectionTitle}
          subtitle={aboutSectionData.sectionSubtitle}
        />
        <div className="about__wrapper">
          <motion.div
            className="about-img none"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={slideInVariants("left", 0.9, 100, false)}
          >
            <img src={aboutImg} alt="about" />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: -80 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
          >
            <ProfileCard
              name=""
              title=""
              handle="dimitri.j"
              status="Online"
              contactText="Contact Me"
              innerGradient={true}
              avatarUrl={aboutImg}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => window.open('https://t.me/iscreamn', '_blank')}
            />
          </motion.div>
          <div className="about-info">
            <div className="description">
              <motion.h3
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                custom={0}
                variants={slideInVariants("right", 0.5, 50, true)}
              >
                {aboutSectionData.heading}
              </motion.h3>
              <motion.h4
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                custom={0}
                variants={slideInVariants("left", 0.5, 50, true)}
              >
                <span>{aboutSectionData.taglineRole}</span>
                {aboutSectionData.taglineBetween}
                <span>{aboutSectionData.taglineLocation}</span>
              </motion.h4>
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                custom={0}
                variants={slideInVariants("left", 0.5, 50, true)}
              >
                {aboutSectionData.description}
              </motion.p>
            </div>
            <motion.ul 
              className="professional-list"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={professionalListVariants}
            >
              {profList.map((item, index) => (
                <motion.li
                  className="list-item"
                  key={item.id}
                  variants={professionalListItemVariants}
                >
                  <span className="number">
                    <AnimatedNumber
                      value={item.number}
                      duration={2}
                      delay={isMobileViewport ? 0 : index * 0.2}
                    />
                  </span>
                  <span className="text">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.button
              onClick={goToAboutPage}
              className="cv-btn"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{aboutSectionData.moreAboutButton.text}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
