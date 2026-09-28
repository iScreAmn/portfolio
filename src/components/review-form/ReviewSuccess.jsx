"use client";

import { motion } from "motion/react";
import { VscCodeReview } from "react-icons/vsc";
import PromoSuccess, { T0 } from "../promo-cta/PromoSuccess";
import "./ReviewSuccess.css";

// Ленты намеренно многоязычные: это «спасибо» от сайта, а не перевод интерфейса.
const TAPE_WORDS = ["Thank you", "Спасибо", "Merci", "Gracias", "Danke", "Grazie", "Obrigado"];
const STARS = 5;
const EXCERPT_LENGTH = 120;

const excerpt = (text) =>
  text.length > EXCERPT_LENGTH ? `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…` : text;

const Star = ({ index }) => (
  <motion.svg
    viewBox="0 0 24 24"
    className="review-success__star"
    variants={{
      hidden: { scale: 0, rotate: -60, opacity: 0 },
      visible: {
        scale: 1,
        rotate: 0,
        opacity: 1,
        transition: { delay: T0 + 1 + index * 0.09, type: "spring", stiffness: 420, damping: 14 },
      },
    }}
  >
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
  </motion.svg>
);

/** Благодарность за отзыв: в карточке — сам отзыв со звёздами и автором. */
const ReviewSuccess = ({ title, message, review, origin }) => {
  const initialLetter = review.name.trim().charAt(0).toUpperCase() || "✦";

  return (
    <PromoSuccess title={title} message={message} tapeWords={TAPE_WORDS} tapeIcon={<VscCodeReview />} origin={origin}>
      <span className="review-success__quote" aria-hidden="true">“</span>
      <div className="review-success__stars" aria-hidden="true">
        {Array.from({ length: STARS }, (_, i) => (
          <Star key={i} index={i} />
        ))}
      </div>
      <blockquote className="review-success__text">{excerpt(review.text)}</blockquote>
      <figcaption className="review-success__author">
        <span className="review-success__avatar" aria-hidden="true">
          {review.photo ? <img src={review.photo} alt="" /> : initialLetter}
        </span>
        <span className="review-success__who">
          <span className="review-success__name">{review.name}</span>
          {review.company && <span className="review-success__company">{review.company}</span>}
        </span>
      </figcaption>
    </PromoSuccess>
  );
};

export default ReviewSuccess;
