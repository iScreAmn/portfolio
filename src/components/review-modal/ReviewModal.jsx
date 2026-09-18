"use client";

import { useState } from "react";
import "./ReviewModal.css";
import { motion, AnimatePresence } from "motion/react";

const ReviewModal = ({ isOpen, onClose, locale }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    review: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки на бекенд
    console.log("Review submitted:", formData);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setFormData({ name: "", company: "", review: "" });
    setIsSuccess(false);
    onClose();
  };

  const texts = {
    en: {
      title: "Leave a Review",
      name: "Your Name",
      company: "Company Name",
      review: "Your Review",
      submit: "Submit",
      cancel: "Cancel",
      successTitle: "Success!",
      successMessage: "Your review has been successfully submitted",
      close: "Close",
    },
    ru: {
      title: "Оставить отзыв",
      name: "Ваше имя",
      company: "Название компании",
      review: "Ваш отзыв",
      submit: "Отправить",
      cancel: "Отмена",
      successTitle: "Успешно!",
      successMessage: "Ваш отзыв успешно отправлен",
      close: "Закрыть",
    },
  };

  const t = texts[locale] || texts.en;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="review-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="review-modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {!isSuccess ? (
            <>
              <h2 className="review-modal-title">{t.title}</h2>
              <form onSubmit={handleSubmit} className="review-modal-form">
                <div className="review-modal-field">
                  <label htmlFor="name">{t.name}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="review-modal-field">
                  <label htmlFor="company">{t.company}</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="review-modal-field">
                  <label htmlFor="review">{t.review}</label>
                  <textarea
                    id="review"
                    name="review"
                    value={formData.review}
                    onChange={handleChange}
                    rows="5"
                    required
                  />
                </div>
                <div className="review-modal-buttons">
                  <button
                    type="button"
                    className="review-modal-btn review-modal-btn-cancel"
                    onClick={handleClose}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="review-modal-btn review-modal-btn-submit"
                  >
                    {t.submit}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="review-modal-success">
              <div className="review-modal-success-icon">✓</div>
              <h2 className="review-modal-success-title">{t.successTitle}</h2>
              <p className="review-modal-success-message">{t.successMessage}</p>
              <button
                className="review-modal-btn review-modal-btn-submit"
                onClick={handleClose}
              >
                {t.close}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewModal;
