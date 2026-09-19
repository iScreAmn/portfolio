"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { FaXmark } from "react-icons/fa6";

const PortfolioModal = ({ item, isModalOpen, closeModal }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return createPortal(
    <div className={`portfolio-modal ${isModalOpen ? "active" : ""}`}>
      <div className="portfolio-modal-overlay"></div>

      <div className="portfolio-modal-body" ref={modalRef}>
        <FaXmark className="portfolio-close-btn" onClick={closeModal} />
        <div className="portfolio-modal-img-container">
          <Image
            src={item.imgSrc}
            alt={item.title}
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholder="blur"
          />
        </div>
        <div className="portfolio-content">
          <h3 className="portfolio-title">{item.title}</h3>
          <p className="portfolio-description">{item.description}</p>
          <a className="modal-btn" href={item.href} target="_blank">
            Explore
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PortfolioModal;
