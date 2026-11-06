"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocaleRouter } from "../i18n/navigation";
import { usePathWithoutLocale } from "../context/LocaleContext";
import { useDictionary } from "../i18n/useDictionary";
import { setPendingScroll } from "../utils/pendingScroll";

const ROUTE_SECTIONS = [
  { prefix: "/services", id: "services" },
  { prefix: "/portfolio", id: "portfolio" },
  { prefix: "/contacts", id: "contact" },
  { prefix: "/hobby", id: "hobby" },
  { prefix: "/about", id: "about" },
];

export function useSiteNavigation() {
  const router = useLocaleRouter();
  const pathname = usePathWithoutLocale();
  const { navItems, navMenu } = useDictionary("home");
  const [activeSection, setActiveSection] = useState("home");

  const goToNavItem = useCallback(
    (item) => {
      setActiveSection(item.id);

      if (item.type === "route") {
        router.push(item.path);
        return;
      }

      if (pathname !== "/") {
        setPendingScroll(item.id);
        router.push("/");
        return;
      }

      document
        .getElementById(item.id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [pathname, router]
  );

  useEffect(() => {
    const matchedRoute = ROUTE_SECTIONS.find((route) =>
      pathname.startsWith(route.prefix)
    );

    if (matchedRoute) {
      setActiveSection(matchedRoute.id);
      return;
    }

    if (pathname !== "/") return;

    const handleScroll = () => {
      const sectionItems = navItems.filter((item) => item.type === "section");
      const scrollPosition = window.scrollY + 100;

      sectionItems.forEach((item) => {
        const section = document.getElementById(item.id);
        if (!section) return;

        if (
          scrollPosition >= section.offsetTop &&
          scrollPosition < section.offsetTop + section.offsetHeight
        ) {
          setActiveSection(item.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, navItems]);

  return { navItems, navMenu, activeSection, goToNavItem };
}
