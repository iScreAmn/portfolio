"use client";

import { motion } from "motion/react";
import PromoSuccess, { EASE_OUT, T0 } from "../promo-cta/PromoSuccess";
import "./CallbackSuccess.css";

// Высоты столбиков звуковой волны: «голос» с подъёмом к середине.
const WAVE = [0.35, 0.6, 0.45, 0.8, 0.55, 1, 0.7, 0.9, 0.5, 0.75, 0.4, 0.65, 0.3, 0.55, 0.35, 0.5, 0.25, 0.4];

/**
 * Благодарность за заявку на звонок. В карточке — «входящий вызов»: аватар с волнами,
 * имя и контакт из заявки, звуковая дорожка и время, когда её приняли.
 */
const CallbackSuccess = ({ eyebrow, title, message, request, icon: Icon, origin }) => {
  const initialLetter = request.name.trim().charAt(0).toUpperCase() || "✦";

  return (
    <PromoSuccess
      title={title}
      message={message}
      tapeWords={[eyebrow, title]}
      origin={origin}
      className="callback-success"
    >
      <div className="callback-ticket__top">
        <span className="callback-ticket__avatar" aria-hidden="true">
          <span className="callback-ticket__sonar" />
          <span className="callback-ticket__sonar is-late" />
          <span className="callback-ticket__initial">{initialLetter}</span>
        </span>
        <span className="callback-ticket__who">
          <span className="callback-ticket__name">{request.name}</span>
          <span className="callback-ticket__contact">
            {Icon && <Icon aria-hidden="true" />}
            <span>{request.contact}</span>
          </span>
        </span>
      </div>

      <div className="callback-ticket__wave" aria-hidden="true">
        {WAVE.map((height, i) => (
          <motion.span
            key={i}
            className="callback-ticket__bar"
            style={{ "--bar": height }}
            variants={{
              hidden: { scaleY: 0 },
              visible: {
                scaleY: 1,
                transition: { delay: T0 + 0.9 + i * 0.035, duration: 0.5, ease: EASE_OUT },
              },
            }}
          >
            <span style={{ animationDelay: `${(i % 6) * -0.18}s` }} />
          </motion.span>
        ))}
      </div>

      <div className="callback-ticket__foot">
        <span className="callback-ticket__label">{eyebrow}</span>
        <span className="callback-ticket__time">{request.time}</span>
      </div>
    </PromoSuccess>
  );
};

export default CallbackSuccess;
