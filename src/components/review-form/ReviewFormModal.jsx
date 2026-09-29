"use client";

import { AnimatePresence, motion } from "motion/react";
import ModalCloseButton from "../modal-close-button/ModalCloseButton";
import ReviewForm from "./ReviewForm";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";
import "./ReviewFormModal.css";

/** На телефонах в карточке мало места, поэтому та же форма открывается в модалке. */
const ReviewFormModal = ({ isOpen, onClose, onSubmitted }) => {
  const { reviewFormData } = useLocaleHomeData();

  return (
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
            <ModalCloseButton onClick={onClose} label={reviewFormData.close} />
            {/* Без автофокуса: иначе клавиатура телефона сразу перекроет модалку.
                «Отмена» не нужна — закрывают крестиком или тапом по фону. */}
            <ReviewForm
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
};

export default ReviewFormModal;
