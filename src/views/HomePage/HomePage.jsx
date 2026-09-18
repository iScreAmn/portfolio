"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { consumePendingScroll } from "../../utils/pendingScroll";
import {
  Home,
  About,
  Brands,
  Services,
  // HobbyTeaser,
  FeaturedPortfolio,
  GetInTouch,
  Clients,
  Calculator,
} from "../../components/index";
import "./HomePage.css";

const HomePage = () => {
  const pathname = usePathname();

  const scrollToSection = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const stateTarget = consumePendingScroll();
    const hashTarget = window.location.hash
      ? window.location.hash.replace("#", "")
      : null;
    const target = stateTarget || hashTarget;

    if (target) {
      // Даем маршруту отрисоваться перед прокруткой
      requestAnimationFrame(() => scrollToSection(target));

      if (stateTarget) {
        window.history.replaceState({}, document.title, pathname);
      }
    }
  }, [pathname]);

  return (
    <div className="home-page">
      <Home />
      <About />
      <Brands />
      <FeaturedPortfolio />
      <Calculator />
      <Services />
      {/* <HobbyTeaser /> */}
      <Clients />
      <GetInTouch />
    </div>
  );
};

export default HomePage;

