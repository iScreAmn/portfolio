"use client";

import Link from "next/link";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { useRef } from "react";
import "./MagneticButton.css";

const MotionLink = motion.create(Link);
const MAGNET_SPRING = { stiffness: 200, damping: 14, mass: 0.3 };

// Кнопка-«магнит»: тянется за курсором, при наведении заливается
// противоположным цветом, надпись прокручивается, иконка поворачивается.
const MagneticButton = ({ href, text, icon: Icon, external = false, className = "" }) => {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const mx = useSpring(0, MAGNET_SPRING);
  const my = useSpring(0, MAGNET_SPRING);

  const handleMove = (event) => {
    if (reduceMotion) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((event.clientX - rect.left - rect.width / 2) * 0.35);
    my.set((event.clientY - rect.top - rect.height / 2) * 0.45);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const Component = external ? motion.a : MotionLink;
  const externalProps = external ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <Component
      ref={ref}
      href={href}
      className={`magnetic-btn ${className}`.trim()}
      style={{ x: mx, y: my }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...externalProps}
    >
      <span className="magnetic-btn__fill" aria-hidden="true" />
      <span className="magnetic-btn__label" data-text={text}>
        <span>{text}</span>
      </span>
      <span className="magnetic-btn__icon">
        <Icon />
      </span>
    </Component>
  );
};

export default MagneticButton;
