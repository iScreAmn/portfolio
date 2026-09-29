"use client";

import "./Footer.css";
import { followLinks } from "../../data/footerData";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";
import FooterLinkGroup from "./FooterLinkGroup";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useState } from "react";
import CircularText from "../widgets/circularText/CircularText";
import SplashCursor from '../widgets/splashCursor/SplashCursor'

const Footer = () => {
  const { footerData: t } = useLocaleHomeData();
  const currentYear = new Date().getFullYear();
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [isSplashCursorActive, setIsSplashCursorActive] = useState(false);

  const toggleHeart = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  const toggleSplashCursor = () => {
    setIsSplashCursorActive(!isSplashCursorActive);
  };

  return (
    <footer className="footer">
      {isSplashCursorActive && <SplashCursor />}
      <div className="footer-wrapper container">
        <CircularText
          text={t.circularText}
          onHover="speedUp"
          spinDuration={20}
          className="custom-class"
        />
        <FooterLinkGroup title={t.followTitle} links={followLinks} isSocial={true} />
      </div>
      <p className="footer-copyright">
        © <span className="year">{currentYear}</span> {t.madeWith}{" "}
        <span className="heart-icon" onClick={() => {
          toggleHeart();
          toggleSplashCursor();
        }}>
          {isHeartFilled ? <FaHeart /> : <FaRegHeart />}
        </span>{" "}
        {t.byMe}
      </p>
    </footer>
  );
};

export default Footer;
