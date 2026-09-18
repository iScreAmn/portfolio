"use client";

import "./Footer.css";
import { followLinks } from "../../data/footerData";
import FooterLinkGroup from "./FooterLinkGroup";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useState } from "react";
import CircularText from "../widgets/circularText/CircularText";
import SplashCursor from '../widgets/splashCursor/SplashCursor'

const Footer = () => {
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
          text="DIMITRI•FRONTEND•DEVELOPER•"
          onHover="speedUp"
          spinDuration={20}
          className="custom-class"
        />
        <FooterLinkGroup title="Follow" links={followLinks} isSocial={true} />
      </div>
      <p className="footer-copyright">
        © <span className="year">{currentYear}</span> Made with{" "}
        <span className="heart-icon" onClick={() => {
          toggleHeart();
          toggleSplashCursor();
        }}>
          {isHeartFilled ? <FaHeart /> : <FaRegHeart />}
        </span>{" "}
        by me
      </p>
    </footer>
  );
};

export default Footer;
