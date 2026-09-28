"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { FaTelegramPlane, FaWhatsapp, FaSpinner } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { getApiBase } from "../../utils/apiBase";
import { useLocale } from "../../context/LocaleContext";
import { calculatorData, phoneCountryCodes } from "../../data/calculatorData";
import { formatContact } from "../../utils/contactValidation";
import { logo } from "../../assets/images";
import SectionTitle from "../section-title/SectionTitle";
import ModalCloseButton from "../modal-close-button/ModalCloseButton";
import ContactFields, { useContactForm } from "./ContactFields";
import CalculatorCompletion from "./CalculatorCompletion";
import CallbackForm from "./CallbackForm";
import "./Calculator.css";

const EASE_OUT = [0.22, 1, 0.36, 1];

// На телефонах в карточке тесно, там форма звонка открывается в модалке.
const MOBILE_QUERY = "(max-width: 768px)";

const emptyCtaForm = {
  name: "",
  contactMethod: "telegram",
  countryCode: phoneCountryCodes[0].value,
  contact: "",
  agreeToPrivacy: false,
};

const contactMethodIcons = {
  telegram: FaTelegramPlane,
  whatsapp: FaWhatsapp,
  email: MdOutlineEmail,
};

const emptyFormData = {
  projectType: "",
  goals: [],
  designApproach: "",
  features: [],
  content: "",
  name: "",
  contactMethod: "telegram",
  countryCode: phoneCountryCodes[0].value,
  contact: "",
  agreeToPrivacy: false,
};

const Calculator = () => {
  const { locale } = useLocale();
  const t = calculatorData[locale] || calculatorData.en;
  // Шаги с вопросами + финальная форма контактов.
  const totalSteps = t.steps.length + 1;
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Карточка рядом с калькулятором: призыв → форма звонка → благодарность.
  const [ctaView, setCtaView] = useState("cta");
  const [isCtaModalOpen, setIsCtaModalOpen] = useState(false);
  const [isCtaSubmitting, setIsCtaSubmitting] = useState(false);
  // Точка, из которой раскрывается шторка в карточке, — центр кнопки, которой отправили заявку.
  const [ctaCurtainOrigin, setCtaCurtainOrigin] = useState(undefined);
  const ctaCardRef = useRef(null);
  const ctaButton = useRef(null);
  const ctaSubmitRef = useRef(null);
  const returnCtaFocus = useRef(false);
  const ctaSuccessTimer = useRef(null);
  const [submitError, setSubmitError] = useState(false);
  const [ctaSubmitError, setCtaSubmitError] = useState(false);

  const calcForm = useContactForm(emptyFormData);
  const { form: formData, setForm: setFormData } = calcForm;
  const ctaForm = useContactForm(emptyCtaForm);

  const steps = t.steps;
  const contactMethods = t.contactMethods.map((method) => ({
    ...method,
    icon: contactMethodIcons[method.id],
  }));

  const currentStepData = steps[currentStep - 1];

  const isContactStep = currentStep === totalSteps;
  const canSubmitCta = ctaForm.isValid && !isCtaSubmitting;

  useEffect(() => () => clearTimeout(ctaSuccessTimer.current), []);

  // После «Отмены» возвращаем фокус на кнопку, иначе он теряется вместе с формой.
  // Callback-ref, а не эффект: из-за mode="wait" кнопка монтируется позже смены ctaView.
  const ctaButtonRef = (button) => {
    ctaButton.current = button;
    if (button && returnCtaFocus.current) {
      returnCtaFocus.current = false;
      button.focus({ preventScroll: true });
    }
  };

  const openCtaForm = () => {
    if (window.matchMedia(MOBILE_QUERY).matches) setIsCtaModalOpen(true);
    else setCtaView("form");
  };

  const cancelCtaForm = () => {
    returnCtaFocus.current = true;
    setCtaSubmitError(false);
    setCtaView("cta");
  };

  const closeCtaModal = () => {
    if (isCtaSubmitting) return;
    setIsCtaModalOpen(false);
    ctaButton.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!isCtaModalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeCtaModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const handleOptionSelect = (value) => {
    if (isContactStep) return;

    const { field, multiSelect } = currentStepData;

    if (multiSelect) {
      setFormData((prev) => {
        const current = prev[field] || [];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [field]: updated };
      });
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const isOptionSelected = (value) => {
    if (isContactStep) return false;

    const { field, multiSelect } = currentStepData;
    if (multiSelect) {
      return formData[field]?.includes(value);
    }
    return formData[field] === value;
  };

  const canProceed = () => {
    if (isContactStep) {
      return calcForm.isValid;
    }

    const { field, multiSelect } = currentStepData;
    if (multiSelect) {
      return formData[field]?.length > 0;
    }
    return formData[field] !== "";
  };

  const handleNext = async () => {
    if (!canProceed()) return;

    setDirection(1);

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(false);

    const { countryCode, ...payload } = formData;

    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/api/calculator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          name: formData.name.trim(),
          contact: formatContact(formData),
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setIsCompleted(true);
      calcForm.reset();
    } catch (error) {
      console.error('Error:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCtaSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmitCta) return;

    const { countryCode, ...payload } = ctaForm.form;

    setIsCtaSubmitting(true);
    setCtaSubmitError(false);
    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/api/calculator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          name: payload.name.trim(),
          contact: formatContact(ctaForm.form),
          source: "cta-modal",
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      // Из модалки шторка раскрывается от «Заказать звонок», из карточки — от «Отправить».
      const fromModal = isCtaModalOpen;
      const card = ctaCardRef.current?.getBoundingClientRect();
      const button = (fromModal ? ctaButton.current : ctaSubmitRef.current)?.getBoundingClientRect();
      if (card && button) {
        const x = ((button.left + button.width / 2 - card.left) / card.width) * 100;
        const y = ((button.top + button.height / 2 - card.top) / card.height) * 100;
        setCtaCurtainOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
      }

      ctaForm.reset();
      if (fromModal) {
        // Ждём, пока модалка растворится, иначе шторка раскроется под оверлеем.
        setIsCtaModalOpen(false);
        clearTimeout(ctaSuccessTimer.current);
        ctaSuccessTimer.current = setTimeout(() => setCtaView("completed"), 350);
      } else {
        setCtaView("completed");
      }
    } catch (error) {
      console.error("CTA submit error:", error);
      setCtaSubmitError(true);
    } finally {
      setIsCtaSubmitting(false);
    }
  };

  const progressPercentage = Math.min((currentStep / (totalSteps - 1)) * 100, 100);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section className="calculator-section section">
      <div className="container">
        <SectionTitle title={t.innerTitle} subtitle={t.innerSubtitle} />
        <div className="calculator-wrapper">
          <motion.div 
            className={`calculator-card ${isCompleted ? "calculator-card--completed" : ""}`}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {isCompleted ? (
              <CalculatorCompletion
                eyebrow={t.completionEyebrow}
                title={t.completionTitle}
                message={t.completionMessage}
              />
            ) : (
              <>
                <div className="calculator-progress-container">
                  <motion.div
                    className="calculator-progress-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>

                {currentStep < totalSteps && (
                  <div className="calculator-step-indicator">
                    {t.stepLabel} {currentStep} {t.fromLabel} {totalSteps - 1}
                  </div>
                )}

                <div className="calculator-content-wrapper">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentStep}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="calculator-step-content"
                    >
                      {!isContactStep ? (
                        <div className="calculator-step">
                          <h3 className="calculator-question">
                            {currentStepData.question}
                          </h3>
                          <div className={`calculator-options ${currentStepData.options.length > 4 ? 'calculator-options--grid' : ''}`}>
                            {currentStepData.options.map((option) => (
                              <button
                                type="button"
                                key={option.value}
                                className={`calculator-option ${isOptionSelected(option.value) ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(option.value)}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="calculator-step calculator-form">
                          <h3 className="calculator-question">
                            {t.contactStepTitle}
                          </h3>

                          <ContactFields
                            t={t}
                            contactMethods={contactMethods}
                            contactForm={calcForm}
                            idPrefix="calculator"
                            onEdit={() => setSubmitError(false)}
                          />

                          {submitError && <p className="calculator-form__error">{t.submitError}</p>}

                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="calculator-actions">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      className="calculator-btn calculator-btn--back"
                      onClick={handleBack}
                      disabled={isSubmitting}
                    >
                      {t.backButton}
                    </button>
                  )}
                  <button
                    type="button"
                    className={`calculator-btn calculator-btn--next ${!canProceed() || isSubmitting ? 'disabled' : ''}`}
                    onClick={handleNext}
                    disabled={!canProceed() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="spinner" /> {t.sendingLabel}
                      </>
                    ) : isContactStep ? (
                      t.submitButton
                    ) : (
                      t.nextButton
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            ref={ctaCardRef}
            className={`cta-card cta-card--${ctaView}`}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Логотип вне анимированных обёрток: их transform сместил бы
                абсолютное позиционирование. В форме он гаснет через CSS. */}
            {ctaView !== "completed" && (
              <Image
                src={logo}
                alt=""
                aria-hidden
                className="cta-decoration"
                sizes="300px"
              />
            )}
            <AnimatePresence mode="wait" initial={false}>
              {ctaView === "cta" && (
                <motion.div
                  key="cta"
                  className="cta-view"
                  initial={{ opacity: 0, y: -24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                >
                  <div className="cta-content">
                    <h3 className="cta-title">{t.ctaTitle}</h3>
                    <p className="cta-text">
                      {t.ctaText}
                    </p>
                    <button
                      ref={ctaButtonRef}
                      type="button"
                      className="cta-btn"
                      onClick={openCtaForm}
                    >
                      {t.ctaButton}
                    </button>
                  </div>
                </motion.div>
              )}
              {ctaView === "form" && (
                <motion.div
                  key="form"
                  className="cta-view"
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                >
                  <CallbackForm
                    t={t}
                    contactMethods={contactMethods}
                    contactForm={ctaForm}
                    isSubmitting={isCtaSubmitting}
                    submitError={ctaSubmitError}
                    onEdit={() => setCtaSubmitError(false)}
                    onSubmit={handleCtaSubmit}
                    onCancel={cancelCtaForm}
                    submitRef={ctaSubmitRef}
                    autoFocus
                  />
                </motion.div>
              )}
              {ctaView === "completed" && (
                <CalculatorCompletion
                  key="completed"
                  eyebrow={t.completionEyebrow}
                  title={t.completionTitle}
                  message={t.ctaCompletionMessage}
                  origin={ctaCurtainOrigin}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isCtaModalOpen && (
          <motion.div
            className="calculator-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCtaModal}
          >
            <motion.div
              className="calculator-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <ModalCloseButton
                onClick={closeCtaModal}
                disabled={isCtaSubmitting}
                label={t.ctaCloseLabel}
              />
              {/* Без автофокуса и «Отмены»: клавиатура телефона сразу перекрыла бы
                  модалку, а закрывают её крестиком или тапом по фону. */}
              <CallbackForm
                t={t}
                contactMethods={contactMethods}
                contactForm={ctaForm}
                isSubmitting={isCtaSubmitting}
                submitError={ctaSubmitError}
                onEdit={() => setCtaSubmitError(false)}
                onSubmit={handleCtaSubmit}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Calculator;
