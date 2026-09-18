"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocaleHomeData } from "./useLocaleHomeData";
import { setPendingScroll } from "../utils/pendingScroll";

const ROUTE_SECTIONS = [
  { prefix: "/services", id: "services" },
  { prefix: "/portfolio", id: "portfolio" },
  { prefix: "/contacts", id: "contact" },
  { prefix: "/hobby", id: "hobby" },
  { prefix: "/about", id: "about" },
];

/**
 * Shared navigation state for the desktop nav bar and the mobile dropdown, so
 * both mark the same item as current and follow the same routing rules.
 */
export function useSiteNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { navItems, navMenu } = useLocaleHomeData();
  const [activeSection, setActiveSection] = useState("home");

  const goToNavItem = useCallback(
    (item) => {
      setActiveSection(item.id);

      if (item.type === "route") {
        router.push(item.path);
        return;
      }

      // A section lives on the home page: route there first when we are away.
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
