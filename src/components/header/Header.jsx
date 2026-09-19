"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./Header.css";
import NavMenu from "../nav/NavMenu";
import { logo } from "../../assets/images";

const Header = ({ isMenuOpen, toggleMenu, handleMenuClick }) => {
  const [isSticky, setIsSticky] = useState(false)

  const handleScroll = () => {
    setIsSticky(window.scrollY > 0)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  return (
    <header className={isSticky ? "header sticky" : "header"}>
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
