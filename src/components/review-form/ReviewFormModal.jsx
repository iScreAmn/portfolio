"use client";

import { AnimatePresence, motion } from "motion/react";
import ModalCloseButton from "../modal-close-button/ModalCloseButton";
import ReviewForm from "./ReviewForm";
import "./ReviewFormModal.css";

const closeLabels = { en: "Close", ru: "Закрыть" };

/** На телефонах в карточке мало места, поэтому та же форма открывается в модалке. */
const ReviewFormModal = ({ isOpen, onClose, onSubmitted, locale }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="review-form-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="review-form-modal"
          role="dialog"
          aria-modal="true"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalCloseButton onClick={onClose} label={closeLabels[locale] || closeLabels.en} />
          {/* Без автофокуса: иначе клавиатура телефона сразу перекроет модалку.
              «Отмена» не нужна — закрывают крестиком или тапом по фону. */}
          <ReviewForm
            locale={locale}
            autoFocus={false}
            showCancel={false}
            onCancel={onClose}
            onSubmitted={onSubmitted}
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ReviewFormModal;
