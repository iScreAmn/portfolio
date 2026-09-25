"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { FaTelegramPlane, FaWhatsapp, FaSpinner } from "react-icons/fa";
import { MdOutlineEmail, MdClose } from "react-icons/md";
import { getApiBase } from "../../utils/apiBase";
import { useLocale } from "../../context/LocaleContext";
import { calculatorData, phoneCountryCodes } from "../../data/calculatorData";
import { logo } from "../../assets/images";
import SectionTitle from "../section-title/SectionTitle";
import "./Calculator.css";

const PRIVACY_LINK = "/privacy";
const PHONE_METHOD = "whatsapp";

const emptyCtaForm = {
  name: "",
  contactMethod: "",
  countryCode: phoneCountryCodes[0].value,
  contact: "",
  message: "",
  agreeToPrivacy: false,
};

const contactMethodIcons = {
  telegram: FaTelegramPlane,
  whatsapp: FaWhatsapp,
  email: MdOutlineEmail,
};

const Calculator = () => {
  const { locale } = useLocale();
  const t = calculatorData[locale] || calculatorData.en;
  const totalSteps = 9;
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCtaModalOpen, setIsCtaModalOpen] = useState(false);
  const [isCtaSubmitting, setIsCtaSubmitting] = useState(false);
  const [ctaSubmitDone, setCtaSubmitDone] = useState(false);

  const [formData, setFormData] = useState({
    projectType: "",
    goals: [],
    scope: "",
    designApproach: "",
    features: [],
    content: "",
    timeline: "",
    support: "",
    contactMethod: "",
    name: "",
    contact: "",
    message: "",
  });
  const [ctaFormData, setCtaFormData] = useState(emptyCtaForm);

  const steps = t.steps;
  const contactMethods = t.contactMethods.map((method) => ({
    ...method,
    icon: contactMethodIcons[method.id],
  }));

  const currentStepData = steps[currentStep - 1];

  const isCtaPhone = ctaFormData.contactMethod === PHONE_METHOD;
  const canSubmitCta =
    ctaFormData.name.trim() &&
    ctaFormData.contactMethod &&
    ctaFormData.contact.trim() &&
    ctaFormData.agreeToPrivacy &&
    !isCtaSubmitting;

  const closeCtaModal = () => {
    if (!isCtaSubmitting) setIsCtaModalOpen(false);
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
    if (currentStep === totalSteps) return;
    
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
    if (currentStep === totalSteps) return false;
    
    const { field, multiSelect } = currentStepData;
    if (multiSelect) {
      return formData[field]?.includes(value);
    }
    return formData[field] === value;
  };

  const canProceed = () => {
    if (currentStep === totalSteps) {
      return formData.contactMethod && formData.name.trim() && formData.contact.trim();
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
    
    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/api/calculator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCtaSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmitCta) return;

    const { countryCode, agreeToPrivacy, ...payload } = ctaFormData;
    if (isCtaPhone) {
      const dial = phoneCountryCodes.find((c) => c.value === countryCode)?.dial || "";
      payload.contact = `${dial} ${ctaFormData.contact.trim()}`;
    }

    setIsCtaSubmitting(true);
    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/api/calculator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          agreeToPrivacy,
          source: "cta-modal",
        }),
      });
      const data = await response.json();
      if (data.success) {
        setCtaSubmitDone(true);
        setTimeout(() => {
          setIsCtaModalOpen(false);
          setCtaSubmitDone(false);
          setCtaFormData(emptyCtaForm);
        }, 1200);
      }
    } catch (error) {
      console.error("CTA submit error:", error);
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
            className="calculator-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {isCompleted ? (
              <motion.div
                className="calculator-completion"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  className="calculator-checkmark-circle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                >
                  <motion.svg
                    className="calculator-checkmark"
                    viewBox="0 0 52 52"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                  >
                    <motion.path
                      fill="none"
                      strokeWidth="4"
                      strokeLinecap="round"
                      d="M14 27l7 7 16-16"
                    />
                  </motion.svg>
                </motion.div>
                <motion.h2
                  className="calculator-completion-title"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  {t.completionTitle}
                </motion.h2>
                <motion.p
                  className="calculator-completion-message"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  {t.completionMessage}
                </motion.p>
              </motion.div>
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
                      {currentStep <= 8 ? (
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
                        <div className="calculator-step">
                          <h3 className="calculator-question">
                            {t.contactStepTitle}
                          </h3>
                          <div className="calculator-contact-methods">
                            {contactMethods.map((method) => {
                              const Icon = method.icon;
                              return (
                                <button
                                  type="button"
                                  key={method.id}
                                  className={`calculator-contact-method ${formData.contactMethod === method.id ? 'selected' : ''}`}
                                  onClick={() => setFormData({ ...formData, contactMethod: method.id })}
                                >
                                  <Icon className="calculator-contact-icon" />
                                  <span>{method.label}</span>
                                </button>
                              );
                            })}
                          </div>
                          {formData.contactMethod && (
                            <>
                              <motion.input
                                type="text"
                                className="calculator-contact-input"
                                placeholder={t.namePlaceholder}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              />
                              <motion.input
                                type="text"
                                className="calculator-contact-input"
                                placeholder={contactMethods.find((m) => m.id === formData.contactMethod)?.placeholder}
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              />
                            </>
                          )}
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
                        <FaSpinner className="spinner" /> {locale === "ru" ? "Отправка..." : "Sending..."}
                      </>
                    ) : currentStep === totalSteps ? (
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
            className="cta-card"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-content">
              <h3 className="cta-title">{t.ctaTitle}</h3>
              <p className="cta-text">
                {t.ctaText}
              </p>
              <button type="button" className="cta-btn" onClick={() => setIsCtaModalOpen(true)}>
                {t.ctaButton}
              </button>
            </div>
            <Image
              src={logo}
              alt=""
              aria-hidden
              className="cta-decoration"
              sizes="300px"
            />
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
              <button
                type="button"
                className="calculator-modal-close"
                onClick={closeCtaModal}
                disabled={isCtaSubmitting}
                aria-label={t.ctaCloseLabel}
              >
                <MdClose />
              </button>
              {ctaSubmitDone ? (
                <div className="calculator-modal-success">{t.ctaSuccess}</div>
              ) : (
                <form className="calculator-modal-form" onSubmit={handleCtaSubmit}>
                  <h4 className="calculator-modal-title">{t.ctaModalTitle}</h4>
                  <input
                    className="calculator-contact-input"
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={ctaFormData.name}
                    onChange={(e) => setCtaFormData({ ...ctaFormData, name: e.target.value })}
                  />
                  <select
                    className="calculator-contact-input"
                    value={ctaFormData.contactMethod}
                    onChange={(e) => setCtaFormData({ ...ctaFormData, contactMethod: e.target.value, contact: "" })}
                  >
                    <option value="">{t.contactMethodSelectPlaceholder}</option>
                    {contactMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  {ctaFormData.contactMethod && (isCtaPhone ? (
                    <div className="calculator-phone-field">
                      <select
                        className="calculator-contact-input calculator-phone-code"
                        value={ctaFormData.countryCode}
                        onChange={(e) => setCtaFormData({ ...ctaFormData, countryCode: e.target.value })}
                        aria-label={t.ctaCountryCodeLabel}
                      >
                        {phoneCountryCodes.map((country) => (
                          <option key={country.value} value={country.value}>
                            {country.flag} {country.dial}
                          </option>
                        ))}
                      </select>
                      <input
                        className="calculator-contact-input"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder={contactMethods.find((method) => method.id === PHONE_METHOD)?.placeholder}
                        value={ctaFormData.contact}
                        onChange={(e) =>
                          setCtaFormData({ ...ctaFormData, contact: e.target.value.replace(/[^\d\s()-]/g, "") })
                        }
                      />
                    </div>
                  ) : (
                    <input
                      className="calculator-contact-input"
                      type="text"
                      placeholder={
                        contactMethods.find((method) => method.id === ctaFormData.contactMethod)?.placeholder ||
                        (locale === "ru" ? "Ваш контакт" : "Your contact")
                      }
                      value={ctaFormData.contact}
                      onChange={(e) => setCtaFormData({ ...ctaFormData, contact: e.target.value })}
                    />
                  ))}
                  <label className="calculator-privacy">
                    <input
                      type="checkbox"
                      className="calculator-privacy__input"
                      checked={ctaFormData.agreeToPrivacy}
                      onChange={(e) => setCtaFormData({ ...ctaFormData, agreeToPrivacy: e.target.checked })}
                    />
                    <span className="calculator-privacy__text">
                      {t.ctaPrivacyPrefix}{" "}
                      <a href={PRIVACY_LINK} className="calculator-privacy__link" target="_blank" rel="noopener noreferrer">
                        {t.ctaPrivacyLink}
                      </a>
                    </span>
                  </label>
                  <button
                    type="submit"
                    className="calculator-btn calculator-btn--next"
                    disabled={!canSubmitCta}
                  >
                    {isCtaSubmitting ? (
                      <>
                        <FaSpinner className="spinner" /> {locale === "ru" ? "Отправка..." : "Sending..."}
                      </>
                    ) : (
                      t.submitButton
                    )}
                  </button>
                  <p className="calculator-modal-phone">
                    {t.ctaPhoneLinePrefix} <a href="tel:+995571040626">+995571040626</a>
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Calculator;
