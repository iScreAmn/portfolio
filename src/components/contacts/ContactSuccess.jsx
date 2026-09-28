"use client";

import { motion } from "motion/react";
import PromoSuccess, { EASE_OUT, T0 } from "../promo-cta/PromoSuccess";
import "./ContactSuccess.css";

const EXCERPT_LENGTH = 140;

const excerpt = (text) =>
  text.length > EXCERPT_LENGTH ? `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…` : text;

// Две галочки, как в мессенджере: первая — «отправлено», вторая — «доставлено».
const Tick = ({ delay, d }) => (
  <motion.path
    d={d}
    variants={{
      hidden: { pathLength: 0 },
      visible: { pathLength: 1, transition: { delay, duration: 0.3, ease: EASE_OUT } },
    }}
  />
);

/**
 * Благодарность за заявку со страницы контактов. В карточке — «сообщение в мессенджере»:
 * отправитель, пузырь с текстом заявки и статус «доставлено» с двумя галочками.
 */
const ContactSuccess = ({ t, request, icon: Icon, origin }) => {
  const initialLetter = request.name.trim().charAt(0).toUpperCase() || "✦";

  return (
    <PromoSuccess
      title={t.successTitle}
      message={t.success}
      tapeWords={[t.successEyebrow, t.successTitle]}
      origin={origin}
      className="contact-success"
    >
      <div className="contact-message__top">
        <span className="contact-message__avatar" aria-hidden="true">
          {initialLetter}
        </span>
        <span className="contact-message__who">
          <span className="contact-message__name">{request.name}</span>
          <span className="contact-message__contact">
            {Icon && <Icon aria-hidden="true" />}
            <span>{request.contact}</span>
          </span>
        </span>
      </div>

      <motion.p
        className="contact-message__bubble"
        variants={{
          hidden: { opacity: 0, scale: 0.6, y: 12 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { delay: T0 + 0.9, type: "spring", stiffness: 320, damping: 20 },
          },
        }}
      >
        {excerpt(request.message)}
      </motion.p>

      <div className="contact-message__status">
        <span>{request.time}</span>
        <motion.span
          className="contact-message__delivered"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: T0 + 1.5, duration: 0.3 } },
          }}
        >
          {t.deliveredLabel}
        </motion.span>
        <svg viewBox="0 0 28 16" className="contact-message__ticks" aria-hidden="true">
          <Tick d="M2 8.5l4 4L14 3" delay={T0 + 1.15} />
          <Tick d="M11 12.5L20.5 3" delay={T0 + 1.45} />
        </svg>
      </div>
    </PromoSuccess>
  );
};

export default ContactSuccess;
