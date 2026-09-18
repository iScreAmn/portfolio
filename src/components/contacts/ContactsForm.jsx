"use client";

import { useState } from "react";
import { FaPaperPlane, FaCheck, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { motion, AnimatePresence } from "motion/react";
import { slideInVariants } from "../../utils/animation";
import { getApiBase } from "../../utils/apiBase";
import { useAnalytics } from "../../analytics/AnalyticsProvider";
import "./ContactsForm.css";

const ContactsForm = () => {
  const { track } = useAnalytics();
  const [formData, setFormData] = useState({
    name: "",
    contactMethod: "",
    contactValue: "",
    message: "",
    agreeToPrivacy: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters and spaces";
        return "";
      case "contactMethod":
        if (!value.trim()) return "Choose a contact method";
        return "";
      case "contactValue": {
        const method = formData.contactMethod;
        if (!value.trim()) return method === "Email" ? "Email is required" : "Phone is required";
        if (method === "Email") {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
        } else {
          if (value.replace(/\D/g, "").length < 10) return "Enter a valid phone number (at least 10 digits)";
        }
        return "";
      }
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.length < 10) return "Message must be at least 10 characters";
        return "";
      case "agreeToPrivacy":
        return value ? "" : "You must agree to the processing of personal data";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;
    
    if (name === "contactValue" && formData.contactMethod !== "Email") {
      finalValue = value.replace(/[^\d+]/g, "").replace(/\+/g, (match, offset) => offset === 0 ? match : "");
    }
    
    const next = { ...formData, [name]: finalValue };
    if (name === "contactMethod") next.contactValue = "";
    setFormData(next);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const PRIVACY_LINK = "/privacy";

  const contactValueValid =
    !formData.contactMethod
      ? false
      : formData.contactMethod === "Email"
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactValue.trim())
        : formData.contactValue.replace(/\D/g, "").length >= 10;

  const isFormValid =
    formData.name.trim().length >= 2 &&
    /^[a-zA-Z\s]+$/.test(formData.name) &&
    formData.contactMethod.trim() !== "" &&
    contactValueValid &&
    formData.message.trim().length >= 10 &&
    formData.agreeToPrivacy === true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, captcha: "portfolio2024" }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus('success');
        track('form', 'submit', 'contact', { status: 'success', method: formData.contactMethod });
        setFormData({ name: "", contactMethod: "", contactValue: "", message: "", agreeToPrivacy: false });
      } else {
        setSubmitStatus('error');
        track('form', 'submit', 'contact', { status: 'error', method: formData.contactMethod });
        if (data.errors?.length) {
          const serverErrors = {};
          data.errors.forEach(error => {
            serverErrors[error.path] = error.msg;
          });
          setErrors(serverErrors);
        }
      }
    } catch {
      setSubmitStatus('error');
      track('form', 'submit', 'contact', { status: 'error', method: formData.contactMethod });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <AnimatePresence>
        {submitStatus && (
          <motion.div
            className={`submit-notification ${submitStatus}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            {submitStatus === 'success' ? (
              <>
                <FaCheck />
                <span>Message sent successfully!</span>
              </>
            ) : (
              <>
                <FaExclamationTriangle />
                <span>Failed to send message. Please try again.</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <form className="contact-form" onSubmit={handleSubmit}>
        <motion.div
          className="first-row"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          custom={1}
          variants={slideInVariants("top", 0.7, 50, true)}
        >
          <div className="input-group">
            <input
              placeholder="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`contact-field ${errors.name ? "error" : ""}`}
            />
            {errors.name && (
              <motion.span
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.name}
              </motion.span>
            )}
          </div>
        </motion.div>

        <motion.div
          className="second-row"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          custom={2}
          variants={slideInVariants("top", 0.7, 50, true)}
        >
          <div className="input-group contact-select-wrapper">
            <select
              name="contactMethod"
              value={formData.contactMethod}
              onChange={handleInputChange}
              className={`contact-field contact-field--select ${errors.contactMethod ? "error" : ""}`}
            >
              <option value="" disabled>
                Preferred contact method
              </option>
              <option value="Telegram">Telegram</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
            </select>
            <motion.span
              className="contact-select-icon"
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <MdOutlineArrowDropDown />
            </motion.span>
            {errors.contactMethod && (
              <motion.span
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.contactMethod}
              </motion.span>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {formData.contactMethod && (
            <motion.div
              className="contact-value-row"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="input-group">
                <input
                  type={formData.contactMethod === "Email" ? "email" : "tel"}
                  name="contactValue"
                  value={formData.contactValue}
                  onChange={handleInputChange}
                  placeholder={formData.contactMethod === "Email" ? "Your email" : "Your phone number"}
                  className={`contact-field ${errors.contactValue ? "error" : ""}`}
                />
                {errors.contactValue && (
                  <motion.span
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.contactValue}
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="third-row">
          <motion.div
            className="input-group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={3}
            variants={slideInVariants("top", 0.7, 50, true)}
          >
            <textarea
              placeholder="Message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className={`contact-field ${errors.message ? "error" : ""}`}
            />
            {errors.message && (
              <motion.span
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.message}
              </motion.span>
            )}
          </motion.div>
        </div>

        <motion.label
          className={`contact-privacy ${errors.agreeToPrivacy ? "contact-privacy--error" : ""}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          custom={4}
          variants={slideInVariants("top", 0.7, 50, true)}
        >
          <input
            type="checkbox"
            name="agreeToPrivacy"
            checked={formData.agreeToPrivacy}
            onChange={handleInputChange}
            className="contact-privacy__input"
          />
          <span className="contact-privacy__text">
            By clicking the button, you agree to the terms of{" "}
            <a href={PRIVACY_LINK} className="contact-privacy__link" target="_blank" rel="noopener noreferrer">
              processing of personal data
            </a>
          </span>
        </motion.label>
        {errors.agreeToPrivacy && (
          <motion.span
            className="error-message contact-privacy__error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.agreeToPrivacy}
          </motion.span>
        )}

        <motion.button
          className={`contact-btn inner-info-link ${isSubmitting ? "submitting" : ""} ${!isFormValid ? "contact-btn--disabled" : ""}`}
          type="submit"
          disabled={!isFormValid || isSubmitting}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          custom={5}
          variants={slideInVariants("top", 0.7, 50, true)}
          whileHover={isFormValid && !isSubmitting ? { scale: 1.05 } : {}}
          whileTap={isFormValid && !isSubmitting ? { scale: 0.95 } : {}}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="spinner" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <FaPaperPlane />
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default ContactsForm;
