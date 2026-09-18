"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Header, Footer, SidePanel } from "../../components/index";

/**
 * Общий каркас сайта — бывший App.jsx без Routes.
 * /admin живёт в соседней группе маршрутов и этот каркас не получает.
 */
export default function SiteLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    handleMenuClick();
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        handleMenuClick={handleMenuClick}
      />
      <main>{children}</main>
      <Footer />
      <SidePanel />
    </>
  );
}
