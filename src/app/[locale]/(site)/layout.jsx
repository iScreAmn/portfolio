"use client";

import { useEffect, useState } from "react";
import { usePathWithoutLocale } from "../../../context/LocaleContext";
import { Header, Footer, SidePanel } from "../../../components/index";

export default function SiteLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathWithoutLocale();

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
