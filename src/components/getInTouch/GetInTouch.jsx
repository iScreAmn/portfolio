"use client";

import { motion } from "motion/react";
import "./GetInTouch.css";
import { slideInVariants } from "../../utils/animation";
import { project } from "../../assets/images";
import Link from "next/link";
import Image from "next/image";

const GetInTouch = () => {
  return (
    <Link href="/about" className="get-in-touch-link">
      <div className="get-in-touch sub-section">
        <div className="container flex-center">
          <motion.div
            className="contact-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={2}
            variants={slideInVariants("left", 0.7, 50, true)}
          >
            <div className="title">
              <h4>Let`s talk</h4>
              <h3>About your</h3>
              <h2>Next project</h2>
            </div>
            <Image
              src={project}
              alt="project"
              className="project-image"
              sizes="(max-width: 768px) 30vw, 40vw"
            />
          </motion.div>
        </div>
      </div>
    </Link>
  );
};

export default GetInTouch;
