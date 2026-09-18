"use client";

import "./Home.css";
import DecryptedText from "../widgets/decryptedText/DecryptedText";
import { aboutImg2 } from "../../assets/images";
import { motion } from "motion/react";
import { iconVariants, slideInVariants } from "../../utils/animation";
import { useMemo } from "react";
import { useLocaleAboutData } from "../../hooks/useLocaleAboutData";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";

const Home = () => {
  const { homeData } = useLocaleHomeData();
  const { socialLinks } = useLocaleAboutData();

  const icons = useMemo(
    () =>
      socialLinks.map((link, index) => {
        const Icon = link.icon;
        return {
          id: index + 1,
          href: link.href,
          icon: <Icon />,
        };
      }),
    [socialLinks]
  );

  const ContactIcon = homeData.contactButton.icon;
  const ScrollIcon = homeData.scrollDown.icon;

  return (
    <section className="home" id="home">
      <div className="container home__wrapper">
        <div className="media-icons">
          {icons.map((item, index) => (
            <motion.a
              href={item.href}
              key={item.id}
              target="_blank"
              custom={index}
              variants={iconVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.5 }}
            >
              {item.icon}
            </motion.a>
          ))}
        </div>

        <div className="home-info">
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={0}
            variants={slideInVariants("left", 0.5, 100, true)}
          >
            {homeData.greeting}
          </motion.h1>
          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={1}
            variants={slideInVariants("left", 0.7, 100, true)}
          >
            {homeData.role}
          </motion.h3>


          <div className="decrypted-text-stable-container">
            <DecryptedText
              text={homeData.description}
              animateOn="view"
              revealDirection="center"
              speed={20}
              maxIterations={10}
              sequential={true}
              className="home-info-text"
            />
          </div>

          <motion.a
            href={homeData.contactButton.href}
            target="_blank"
            className="home-info-link inner-info-link"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={2}
            variants={slideInVariants("left", 0.9, 100, true)}
          >
            {homeData.contactButton.text}
            <ContactIcon />
          </motion.a>
        </div>
        <div className="circle">
          <img src={aboutImg2} alt="Profile" className="circle__img" />
        </div>
        <motion.div
          className="home-img"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={slideInVariants("right", 0.9, 100, true)}
        >
          {/* <img src={lightImg} alt="Profile Photo" /> */}
        </motion.div>
      </div>
      <a href={homeData.scrollDown.href} className="scroll-down">
        {homeData.scrollDown.text}
        <ScrollIcon className="arrow-icon" />
      </a>
    </section>
  );
};

export default Home;
