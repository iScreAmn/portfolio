"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { FaSpinner } from "react-icons/fa";
import ContactFields from "./ContactFields";

const EASE_OUT = [0.22, 1, 0.36, 1];

/**
 * Форма «Заказать звонок». На десктопе раскрывается в карточке рядом с калькулятором
 * (с «Отменой» и автофокусом), на телефоне — в модалке без них.
 */
const CallbackForm = ({
  t,
  contactMethods,
  contactForm,
  isSubmitting,
  submitError,
  onEdit,
  onSubmit,
  onCancel,
  submitRef,
  autoFocus = false,
}) => {
  const formRef = useRef(null);
  const canSubmit = contactForm.isValid && !isSubmitting;

  useEffect(() => {
    if (autoFocus) formRef.current?.querySelector('input[name="name"]')?.focus({ preventScroll: true });
  }, [autoFocus]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && onCancel && !isSubmitting) onCancel();
  };

  return (
    <motion.form
      ref={formRef}
      className="calculator-modal-form calculator-form"
      onSubmit={onSubmit}
      onKeyDown={handleKeyDown}
      autoComplete="off"
      noValidate
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      <h4 className="calculator-modal-title">{t.ctaModalTitle}</h4>
      <ContactFields
        t={t}
        contactMethods={contactMethods}
        contactForm={contactForm}
        idPrefix="calculator-cta"
        onEdit={onEdit}
      />
      {submitError && <p className="calculator-form__error">{t.submitError}</p>}
      <div className="callback-form__actions">
        {onCancel && (
          <button
            type="button"
            className="calculator-btn calculator-btn--back"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t.ctaCancelButton}
          </button>
        )}
        <button
          ref={submitRef}
          type="submit"
          className="calculator-btn calculator-btn--next"
          disabled={!canSubmit}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="spinner" /> {t.sendingLabel}
            </>
          ) : (
            t.submitButton
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default CallbackForm;
