"use client";

import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import "./SidePanel.css";

const SidePanel = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // Обработка скролла
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 300);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Кнопка прижата к низу экрана, поэтому на футере она бы легла прямо поверх
  // его содержимого — прячем её, как только футер появляется в кадре.
  useEffect(() => {
    const footer = document.querySelector(".footer");
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) =>
      setIsFooterVisible(entry.isIntersecting)
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const isVisible = isScrolled && !isFooterVisible;

  // Прокрутка к началу страницы
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`side-panel-btn scroll-btn ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Прокрутить к началу страницы"
    >
      <FaArrowUp />
    </button>
  );
};

export default SidePanel;
