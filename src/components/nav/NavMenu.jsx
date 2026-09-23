"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  HiArrowNarrowRight,
  HiOutlineAdjustments,
  HiOutlineCollection,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineMail,
  HiOutlineMoon,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineTranslate,
  HiOutlineUser,
} from "react-icons/hi";
import { useLocale } from "../../context/LocaleContext";
import { useSiteNavigation } from "../../hooks/useSiteNavigation";
import { useTheme } from "../../hooks/useTheme";
// Механика бургера и панели — общая с админским меню.
import "./NavPanel.css";
import "./NavMenu.css";

const PANEL_ID = "mobile-nav-panel";

const ICONS = {
  home: HiOutlineHome,
  about: HiOutlineUser,
  services: HiOutlineSparkles,
  portfolio: HiOutlineCollection,
  hobby: HiOutlineHeart,
  contact: HiOutlineMail,
};

/** Entrance stagger for the n-th row of the panel, in ms. */
const revealDelay = (index) => `${40 + index * 45}ms`;

const ThemeToggle = ({ labels }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="nav-segmented" role="group" aria-label={labels.label}>
      <span
        className={`nav-segmented__thumb ${
          theme === "light" ? "nav-segmented__thumb--right" : ""
        }`}
        aria-hidden
      />
      <button
        type="button"
        className={`nav-segmented__option ${
          theme === "dark" ? "is-active" : ""
        }`}
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        aria-label={labels.darkAria}
        title={labels.dark}
      >
        <HiOutlineMoon aria-hidden />
      </button>
      <button
        type="button"
        className={`nav-segmented__option ${
          theme === "light" ? "is-active" : ""
        }`}
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        aria-label={labels.lightAria}
        title={labels.light}
      >
        <HiOutlineSun aria-hidden />
      </button>
    </div>
  );
};

const LanguageToggle = ({ labels }) => {
  const { locale, setLocale, supportedLocales } = useLocale();

  return (
    <div className="nav-segmented" role="group" aria-label={labels.label}>
      <span
        className={`nav-segmented__thumb ${
          locale === supportedLocales[1] ? "nav-segmented__thumb--right" : ""
        }`}
        aria-hidden
      />
      {supportedLocales.map((code) => (
        <button
          key={code}
          type="button"
          className={`nav-segmented__option ${
            locale === code ? "is-active" : ""
          }`}
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          aria-label={labels.switchTo[code]}
          title={labels.switchTo[code]}
        >
          {labels.options[code]}
        </button>
      ))}
    </div>
  );
};

/**
 * The whole header navigation, on every screen size: a burger trigger and the
 * dropdown it opens. The panel holds every page as a borderless row plus, split
 * off below a rule, the theme and language switches.
 *
 * The panel stays mounted and hides with `visibility` (see `.nav-panel` in
 * NavMenu.css) so it can animate out and still stay out of the tab order.
 */
const NavMenu = ({ isMenuOpen, toggleMenu, handleMenuClick }) => {
  const { navItems, navMenu, activeSection, goToNavItem } = useSiteNavigation();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  // Closing while focus is inside the panel would strand it on a hidden
  // element, so every keyboard/selection path hands focus back to the trigger.
  // An outside click doesn't: the user is already pointing somewhere else.
  const closeAndRefocus = useCallback(() => {
    handleMenuClick();
    triggerRef.current?.focus();
  }, [handleMenuClick]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) handleMenuClick();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeAndRefocus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen, handleMenuClick, closeAndRefocus]);

  const select = (item) => {
    goToNavItem(item);
    closeAndRefocus();
  };

  return (
    <div className="nav-menu-root" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="burger"
        data-open={isMenuOpen}
        aria-expanded={isMenuOpen}
        aria-controls={PANEL_ID}
        aria-haspopup="true"
        aria-label={isMenuOpen ? navMenu.close : navMenu.open}
        title={isMenuOpen ? navMenu.close : navMenu.open}
        onClick={toggleMenu}
      >
        <span className="burger-line burger-line--top" aria-hidden />
        <span className="burger-line burger-line--mid" aria-hidden />
        <span className="burger-line burger-line--bot" aria-hidden />
      </button>

      <div
        id={PANEL_ID}
        className={`nav-panel ${isMenuOpen ? "is-open" : ""}`}
      >
        <div className="nav-panel__glow" aria-hidden />

        <nav className="nav-panel__body" aria-label={navMenu.panelLabel}>
          <p className="nav-panel__title">{navMenu.sectionsTitle}</p>

          <ul className="nav-panel__list">
            {navItems.map((item, index) => {
              const Icon = ICONS[item.id] ?? HiOutlineCollection;
              const active = activeSection === item.id;

              return (
                <li
                  key={item.id}
                  className={`nav-reveal ${isMenuOpen ? "is-shown" : ""}`}
                  style={{
                    transitionDelay: isMenuOpen ? revealDelay(index) : "0ms",
                  }}
                >
                  {/* No border in any state: the current page is marked by the
                      accent tick, tint and text colour instead. */}
                  <button
                    type="button"
                    className={`nav-item ${active ? "is-active" : ""}`}
                    onClick={() => select(item)}
                    aria-current={active ? "true" : undefined}
                  >
                    <Icon className="nav-item__icon" aria-hidden />
                    <span className="nav-item__text">
                      <span className="nav-item__label">{item.label}</span>
                      <span className="nav-item__hint">{item.hint}</span>
                    </span>
                    <HiArrowNarrowRight className="nav-item__arrow" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* The switches are settings, not destinations — hence the rule. */}
        <div
          className={`nav-reveal nav-rule ${isMenuOpen ? "is-shown" : ""}`}
          style={{
            transitionDelay: isMenuOpen ? revealDelay(navItems.length) : "0ms",
          }}
          aria-hidden
        />

        <div className="nav-panel__body">
          <p className="nav-panel__title">{navMenu.settingsTitle}</p>

          <div
            className={`nav-reveal ${isMenuOpen ? "is-shown" : ""}`}
            style={{
              transitionDelay: isMenuOpen
                ? revealDelay(navItems.length + 1)
                : "0ms",
            }}
          >
            <div className="nav-settings">
              <span className="nav-settings__label">
                <HiOutlineAdjustments aria-hidden />
                {navMenu.theme.label}
              </span>
              <ThemeToggle labels={navMenu.theme} />
            </div>
          </div>

          <div
            className={`nav-reveal ${isMenuOpen ? "is-shown" : ""}`}
            style={{
              transitionDelay: isMenuOpen
                ? revealDelay(navItems.length + 2)
                : "0ms",
            }}
          >
            <div className="nav-settings">
              <span className="nav-settings__label">
                <HiOutlineTranslate aria-hidden />
                {navMenu.language.label}
              </span>
              <LanguageToggle labels={navMenu.language} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
