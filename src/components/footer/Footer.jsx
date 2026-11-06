"use client";

import "./Footer.css";
import { followLinks } from "../../data/footerData";
import { useDictionary } from "../../i18n/useDictionary";
import { getDictionary } from "../../i18n/dictionaries";
import FooterLinkGroup from "./FooterLinkGroup";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useState } from "react";
import CircularText from "../widgets/circularText/CircularText";
import SplashCursor from '../widgets/splashCursor/SplashCursor'

const footerDataEn = getDictionary("en").home.footerData;

const Footer = () => {
  const { footerData: t } = useDictionary("home");
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
      <p className="footer-copyright" lang="en">
        © <span className="year">{currentYear}</span> {footerDataEn.madeWith}{" "}
        <span className="heart-icon" onClick={() => {
          toggleHeart();
          toggleSplashCursor();
        }}>
          {isHeartFilled ? <FaHeart /> : <FaRegHeart />}
        </span>{" "}
        {footerDataEn.byMe}
      </p>
    </footer>
  );
};

export default Footer;
