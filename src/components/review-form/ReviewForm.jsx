"use client";

import { useEffect, useRef, useState } from "react";
import "./ReviewForm.css";
import { motion } from "motion/react";
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
    company: "Company",
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
    failed: "Could not send the review. Please try again later.",
    imageFailed: "This file could not be read as an image.",
    imageTooLarge: "The image is too large. Please pick a smaller one.",
    reviewTooShort: "The review should be at least 10 characters long.",
  },
  ru: {
    title: "Оставить отзыв",
    name: "Ваше имя",
    company: "Компания",
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

const EASE_OUT = [0.22, 1, 0.36, 1];

// Поля выезжают лесенкой из-под маски — форма «собирается» на месте призыва.
const formVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE_OUT } },
};

const ReviewForm = ({ onCancel, onSubmitted, locale }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const nameRef = useRef(null);
  const { track } = useAnalytics();

  const t = texts[locale] || texts.en;

  // Форма появляется по клику, поэтому сразу переводим фокус в первое поле.
  useEffect(() => {
    nameRef.current?.focus({ preventScroll: true });
  }, []);

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

    const review = {
      name: formData.name.trim(),
      company: formData.company.trim(),
      text: formData.review.trim(),
      photo: formData.photo,
      logo: formData.logo,
    };

    setError(null);
    setIsSubmitting(true);
    try {
      await submitReview(review);
      track("form", "submit", "review", { status: "success" });
    } catch {
      track("form", "submit", "review", { status: "error" });
      setError(t.failed);
      setIsSubmitting(false);
      return;
    }

    onSubmitted(review);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && !isSubmitting) onCancel();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="review-form"
      aria-label={t.title}
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 className="review-form-title" variants={rowVariants}>
        {t.title}
      </motion.h3>
      <motion.div className="review-form-row" variants={rowVariants}>
        <div className="review-form-field">
          <input
            ref={nameRef}
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
        <div className="review-form-field">
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
      </motion.div>
      <motion.div className="review-form-images" variants={rowVariants}>
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
      </motion.div>
      <motion.div className="review-form-field" variants={rowVariants}>
        <textarea
          id="review-text"
          name="review"
          placeholder={t.review}
          aria-label={t.review}
          value={formData.review}
          onChange={handleChange}
          rows="3"
          maxLength={1000}
          required
        />
      </motion.div>
      {error && (
        <p className="review-form-error" role="alert">
          {error}
        </p>
      )}
      <motion.div className="review-form-buttons" variants={rowVariants}>
        <button
          type="button"
          className="review-form-btn review-form-btn-cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t.cancel}
        </button>
        <button
          type="submit"
          className="review-form-btn review-form-btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? t.submitting : t.submit}
        </button>
      </motion.div>
    </motion.form>
  );
};

export default ReviewForm;
