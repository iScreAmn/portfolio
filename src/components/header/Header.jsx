"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import "./Header.css";
import NavMenu from "../nav/NavMenu";
import { logo } from "../../assets/images";

const Header = ({ isMenuOpen, toggleMenu, handleMenuClick }) => {
  const pathname = usePathname()
  const [isSticky, setIsSticky] = useState(false)
  const [isOnDark, setIsOnDark] = useState(false)

  useEffect(() => {
    // Секции с тёмным фоном (например, hero с фото) помечаются
    // data-header-contrast="dark": пока хедер над ними, логотип светлый.
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0)
      const header = document.querySelector(".header")
      const line = header ? header.getBoundingClientRect().height / 2 : 0
      const sections = document.querySelectorAll('[data-header-contrast="dark"]')
      setIsOnDark(
        Array.from(sections).some((el) => {
          const { top, bottom } = el.getBoundingClientRect()
          return top <= line && bottom > line
        })
      )
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [pathname])


  return (
    <header
      className={`header${isSticky ? " sticky" : ""}${isOnDark ? " header--on-dark" : ""}`}
    >
      <div className="container">
        <div className="header__wrapper">
          <Link href="/" className="logo" onClick={handleMenuClick} aria-label="DJ">
            <Image src={logo} alt="DJ" sizes="52px" priority />
          </Link>
          <NavMenu
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            handleMenuClick={handleMenuClick}
          />
        </div>
      </div>
    </header>
  )
}

export default Header
