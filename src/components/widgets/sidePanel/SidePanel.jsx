"use client";

import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import "./SidePanel.css";
import { useDictionary } from "../../../i18n/useDictionary";

const SidePanel = () => {
  const { sidePanelData } = useDictionary("home");
  const [isVisible, setIsVisible] = useState(false);
  const [footerLift, setFooterLift] = useState(0);

  useEffect(() => {
    let frame = null;

    const measure = () => {
      frame = null;
      setIsVisible(window.scrollY > 300);

      const footer = document.querySelector(".footer");
      if (!footer) {
        setFooterLift(0);
        return;
      }

      const overlap = window.innerHeight - footer.getBoundingClientRect().top;
      setFooterLift(Math.max(0, overlap));
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`side-panel-btn scroll-btn ${isVisible ? "visible" : ""}`}
      style={{ "--footer-lift": `${footerLift}px` }}
      onClick={scrollToTop}
      aria-label={sidePanelData.scrollTopLabel}
    >
      <FaArrowUp />
    </button>
  );
};

export default SidePanel;
