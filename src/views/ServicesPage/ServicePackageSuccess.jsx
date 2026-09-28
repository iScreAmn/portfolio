"use client";

import Image from "next/image";
import { motion } from "motion/react";
import PromoSuccess, { EASE_OUT, T0 } from "../../components/promo-cta/PromoSuccess";
import "./ServicePackageSuccess.css";

// Пункты пакета отмечаются по очереди, когда карточка уже легла на место.
const ITEMS_DELAY = T0 + 0.85;
const ITEM_STEP = 0.14;

const Check = ({ delay }) => (
  <svg viewBox="0 0 24 24" className="package-receipt__check" aria-hidden="true">
    <motion.path
      d="M5 12.5l4.5 4.5L19 7.5"
      variants={{
        hidden: { pathLength: 0 },
        visible: { pathLength: 1, transition: { delay: delay + 0.12, duration: 0.35, ease: EASE_OUT } },
      }}
    />
  </svg>
);

const ReceiptLine = ({ index, className = "", children }) => {
  const delay = ITEMS_DELAY + index * ITEM_STEP;
  return (
    <motion.li
      className={`package-receipt__item ${className}`.trim()}
      variants={{
        hidden: { opacity: 0, x: -14 },
        visible: { opacity: 1, x: 0, transition: { delay, duration: 0.45, ease: EASE_OUT } },
      }}
    >
      <Check delay={delay} />
      {children}
    </motion.li>
  );
};

/**
 * Благодарность за заказ пакета. В карточке — «чек заказа»: пакет с ценой,
 * пункты, которые отмечаются галочками, поддержка (если выбрана) и контакт.
 */
const ServicePackageSuccess = ({ pkg, order, texts, icon: Icon, origin }) => (
  <PromoSuccess
    title={texts.successTitle}
    message={texts.success}
    tapeWords={[pkg.name, texts.successEyebrow]}
    origin={origin}
    className="package-success"
  >
    <div className="package-receipt__head">
      <span className="package-receipt__thumb" aria-hidden="true">
        <Image src={pkg.image} alt="" sizes="56px" />
      </span>
      <span className="package-receipt__plan">
        <span className="package-receipt__name">{pkg.name}</span>
        <span className="package-receipt__price">{pkg.price}</span>
      </span>
    </div>

    <ul className="package-receipt__items">
      {pkg.items.map((item, i) => (
        <ReceiptLine key={item} index={i}>
          <span>{item}</span>
        </ReceiptLine>
      ))}
      {order.withSupport && (
        <ReceiptLine index={pkg.items.length} className="is-extra">
          <span>{texts.successSupportLabel}</span>
        </ReceiptLine>
      )}
    </ul>

    <div className="package-receipt__foot">
      <span className="package-receipt__contact">
        {Icon && <Icon aria-hidden="true" />}
        <span>{order.contact}</span>
      </span>
      <span className="package-receipt__time">{order.time}</span>
    </div>
  </PromoSuccess>
);

export default ServicePackageSuccess;
