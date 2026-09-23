"use client";

import { useState } from "react";
import "./ReviewModal.css";
import { motion, AnimatePresence } from "motion/react";
import { MdClose } from "react-icons/md";
import { HiOutlineCamera, HiOutlinePhotograph } from "react-icons/hi";
import { submitReview } from "../../lib/reviews";
import { resizeImage, ImageTooLargeError } from "../../utils/resizeImage";
import { useAnalytics } from "../../analytics/AnalyticsProvider";

const EMPTY_FORM = {
  name: "",
  company: "",
  review: "",
  photo: null,
  logo: null,
};

const texts = {
  en: {
    title: "Leave a Review",
    name: "Your Name",
    company: "Company Name",
    optional: "optional",
    photo: "Your photo",
    logo: "Company logo",
    upload: "Upload",
    replace: "Replace",
    remove: "Remove",
    review: "Your Review",
    submit: "Submit",
    submitting: "Sending…",
    cancel: "Cancel",
    successTitle: "Thank you for your feedback!",
    successMessage: "Your review will appear on the site soon.",
    close: "Close",
    failed: "Could not send the review. Please try again later.",
    imageFailed: "This file could not be read as an image.",
    imageTooLarge: "The image is too large. Please pick a smaller one.",
    reviewTooShort: "The review should be at least 10 characters long.",
  },
  ru: {
    title: "Оставить отзыв",
    name: "Ваше имя",
    company: "Название компании",
    optional: "необязательно",
    photo: "Ваше фото",
    logo: "Логотип компании",
    upload: "Загрузить",
    replace: "Заменить",
    remove: "Убрать",
    review: "Ваш отзыв",
    submit: "Отправить",
    submitting: "Отправляем…",
    cancel: "Отмена",
    successTitle: "Спасибо за обратную связь!",
    successMessage: "Скоро отзыв появится на сайте.",
    close: "Закрыть",
    failed: "Не удалось отправить отзыв. Попробуйте позже.",
    imageFailed: "Не получилось прочитать файл как картинку.",
    imageTooLarge: "Картинка слишком большая, выберите поменьше.",
    reviewTooShort: "Отзыв должен быть не короче 10 символов.",
  },
};

const ImageField = ({ id, label, icon: Icon, value, round, onPick, onRemove, t, disabled }) => (
  <div className="review-upload">
    <label
      htmlFor={id}
      className={`review-upload-tile${value ? " has-image" : ""}${disabled ? " is-disabled" : ""}`}
    >
      <span className={`review-upload-thumb${round ? " is-round" : ""}`}>
        {value ? <img src={value} alt="" /> : <Icon aria-hidden />}
      </span>
      <span className="review-upload-text">
        <span className="review-upload-title">{label}</span>
        <span className="review-upload-hint">{value ? t.replace : t.optional}</span>
      </span>
    </label>
    <input
      id={id}
      type="file"
      accept="image/png,image/jpeg,image/webp"
      className="review-upload-input"
      disabled={disabled}
      onChange={(e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (file) onPick(file);
      }}
    />
    {value && (
      <button
        type="button"
        className="review-upload-remove"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`${t.remove}: ${label}`}
      >
        <MdClose aria-hidden />
      </button>
    )}
  </div>
);

const ReviewModal = ({ isOpen, onClose, locale }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { track } = useAnalytics();

  const t = texts[locale] || texts.en;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const pickImage = async (key, file) => {
    setError(null);
    try {
      const dataUrl = await resizeImage(file, { crop: key === "photo" });
      setFormData((prev) => ({ ...prev, [key]: dataUrl }));
    } catch (err) {
      setError(err instanceof ImageTooLargeError ? t.imageTooLarge : t.imageFailed);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.review.trim().length < 10) {
      setError(t.reviewTooShort);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await submitReview({
        name: formData.name.trim(),
        company: formData.company.trim(),
        text: formData.review.trim(),
        photo: formData.photo,
        logo: formData.logo,
      });
      track("form", "submit", "review", { status: "success" });
      setIsSuccess(true);
    } catch {
      track("form", "submit", "review", { status: "error" });
      setError(t.failed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setFormData(EMPTY_FORM);
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="review-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="review-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={isSuccess ? t.successTitle : t.title}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              type="button"
              className="review-modal-close"
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label={t.close}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              whileHover={{ rotate: 90, scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <MdClose aria-hidden />
            </motion.button>
            {!isSuccess ? (
              <>
                <h2 className="review-modal-title">{t.title}</h2>
                <form onSubmit={handleSubmit} className="review-modal-form">
                  <div className="review-modal-field">
                    <input
                      type="text"
                      id="review-name"
                      name="name"
                      placeholder={t.name}
                      aria-label={t.name}
                      value={formData.name}
                      onChange={handleChange}
                      maxLength={100}
                      required
                    />
                  </div>
                  <div className="review-modal-field">
                    <input
                      type="text"
                      id="review-company"
                      name="company"
                      placeholder={`${t.company} (${t.optional})`}
                      aria-label={`${t.company} (${t.optional})`}
                      value={formData.company}
                      onChange={handleChange}
                      maxLength={120}
                    />
                  </div>
                  <div className="review-modal-images">
                    <ImageField
                      id="review-photo"
                      label={t.photo}
                      icon={HiOutlineCamera}
                      value={formData.photo}
                      round
                      t={t}
                      disabled={isSubmitting}
                      onPick={(file) => pickImage("photo", file)}
                      onRemove={() => setFormData((prev) => ({ ...prev, photo: null }))}
                    />
                    <ImageField
                      id="review-logo"
                      label={t.logo}
                      icon={HiOutlinePhotograph}
                      value={formData.logo}
                      t={t}
                      disabled={isSubmitting}
                      onPick={(file) => pickImage("logo", file)}
                      onRemove={() => setFormData((prev) => ({ ...prev, logo: null }))}
                    />
                  </div>
                  <div className="review-modal-field">
                    <label htmlFor="review-text">{t.review}</label>
                    <textarea
                      id="review-text"
                      name="review"
                      value={formData.review}
                      onChange={handleChange}
                      rows="3"
                      maxLength={1000}
                      required
                    />
                  </div>
                  {error && (
                    <p className="review-modal-error" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="review-modal-buttons">
                    <button
                      type="button"
                      className="review-modal-btn review-modal-btn-cancel"
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      className="review-modal-btn review-modal-btn-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t.submitting : t.submit}
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
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
