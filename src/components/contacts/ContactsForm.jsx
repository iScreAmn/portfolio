"use client";

import { useState } from "react";
import { FaTelegramPlane, FaWhatsapp, FaSpinner, FaCheck } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { getApiBase } from "../../utils/apiBase";
import { useAnalytics } from "../../analytics/AnalyticsProvider";
import { useLocale } from "../../context/LocaleContext";
import { contactsFormData } from "../../data/contactsFormData";
import { phoneCountryCodes } from "../../data/calculatorData";
import { PHONE_METHOD, isContactValid, formatContact } from "../../utils/contactValidation";
import "./ContactsForm.css";

const PRIVACY_LINK = "/privacy";
// Ответ простой капчи; должен совпадать с CONTACT_CAPTCHA_ANSWER на сервере.
const CAPTCHA_ANSWER = "portfolio2024";
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;

const contactMethodIcons = {
  telegram: FaTelegramPlane,
  whatsapp: FaWhatsapp,
  email: MdOutlineEmail,
};

const emptyForm = {
  name: "",
  contactMethod: "telegram",
  countryCode: phoneCountryCodes[0].value,
  contact: "",
  message: "",
  agreeToPrivacy: false,
};

const ContactsForm = () => {
  const { track } = useAnalytics();
  const { locale } = useLocale();
  const t = contactsFormData[locale] || contactsFormData.en;
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (status === "error") setStatus(null);
  };
  const touch = (key) => {
    if (form[key].trim()) setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const nameValid = form.name.trim().length >= 2;
  const contactValid = isContactValid(form);
  const messageLength = form.message.trim().length;
  const messageValid = messageLength >= MESSAGE_MIN && messageLength <= MESSAGE_MAX;
  const canSubmit =
    nameValid && contactValid && messageValid && form.agreeToPrivacy && !isSubmitting;

  const isPhone = form.contactMethod === PHONE_METHOD;
  const activeMethod = t.contactMethods.find((m) => m.id === form.contactMethod);

  const selectMethod = (id) => {
    if (id === form.contactMethod) return;
    setForm((prev) => ({ ...prev, contactMethod: id, contact: "" }));
    setTouched((prev) => ({ ...prev, contact: false }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await fetch(`${getApiBase()}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          contactMethod: form.contactMethod,
          contactValue: formatContact(form),
          message: form.message.trim(),
          agreeToPrivacy: form.agreeToPrivacy,
          captcha: CAPTCHA_ANSWER,
        }),
      });
      const data = await response.json();
      const ok = Boolean(data?.success);
      track("form", "submit", "contact", {
        status: ok ? "success" : "error",
        method: form.contactMethod,
      });
      if (!ok) throw new Error(data?.message);

      setStatus("success");
      setForm(emptyForm);
      setTouched({});
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div className="contact-form contact-form__success" role="status">
        <span className="contact-form__success-icon" aria-hidden="true">
          <FaCheck />
        </span>
        <p>{t.success}</p>
        <button type="button" className="contact-form__again" onClick={() => setStatus(null)}>
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} autoComplete="off" noValidate>
      <div className="contact-form__head">
        <h2 className="contact-form__title">{t.title}</h2>
        <p className="contact-form__lead">{t.lead}</p>
      </div>

      <label className="contact-form__label">
        {t.nameLabel}
        <input
          type="text"
          name="name"
          value={form.name}
          placeholder={t.namePlaceholder}
          onChange={(e) => update("name", e.target.value)}
          onBlur={() => touch("name")}
          className={touched.name && !nameValid ? "is-invalid" : ""}
          maxLength={100}
        />
        {touched.name && !nameValid && (
          <span className="contact-form__error">{t.errors.name}</span>
        )}
      </label>

      <div className="contact-form__label">
        <span id="contacts-contact-method">{t.contactMethodLabel}</span>
        <div className="contact-form__methods" role="radiogroup" aria-labelledby="contacts-contact-method">
          {t.contactMethods.map((method) => {
            const Icon = contactMethodIcons[method.id];
            const selected = form.contactMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`contact-form__method ${selected ? "is-selected" : ""}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectMethod(method.id)}
              >
                <Icon aria-hidden="true" />
                {method.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="contact-form__label">
        <div className="contact-form__contact">
          {isPhone && (
            <select
              className="contact-form__code"
              value={form.countryCode}
              onChange={(e) => update("countryCode", e.target.value)}
              aria-label={t.countryCodeLabel}
            >
              {phoneCountryCodes.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.flag} {country.dial}
                </option>
              ))}
            </select>
          )}
          <input
            type={form.contactMethod === "email" ? "email" : isPhone ? "tel" : "text"}
            inputMode={form.contactMethod === "email" ? "email" : isPhone ? "tel" : "text"}
            name="contact"
            value={form.contact}
            placeholder={activeMethod?.placeholder}
            aria-label={activeMethod?.placeholder}
            onChange={(e) =>
              update("contact", isPhone ? e.target.value.replace(/[^\d\s()-]/g, "") : e.target.value)
            }
            onBlur={() => touch("contact")}
            className={touched.contact && !contactValid ? "is-invalid" : ""}
            maxLength={100}
          />
        </div>
        {touched.contact && !contactValid && (
          <span className="contact-form__error">{t.errors[form.contactMethod]}</span>
        )}
      </div>

      <label className="contact-form__label">
        <span className="contact-form__label-row">
          {t.messageLabel}
          <span className="contact-form__counter">
            {form.message.length}/{MESSAGE_MAX}
          </span>
        </span>
        <textarea
          name="message"
          rows={5}
          value={form.message}
          placeholder={t.messagePlaceholder}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => touch("message")}
          className={touched.message && !messageValid ? "is-invalid" : ""}
          maxLength={MESSAGE_MAX}
        />
        {touched.message && !messageValid && (
          <span className="contact-form__error">{t.errors.message}</span>
        )}
      </label>

      <label className="contact-form__check">
        <input
          type="checkbox"
          checked={form.agreeToPrivacy}
          onChange={(e) => update("agreeToPrivacy", e.target.checked)}
        />
        <span className="contact-form__check-text">
          {t.privacyPrefix}{" "}
          <a href={PRIVACY_LINK} target="_blank" rel="noopener noreferrer">
            {t.privacyLink}
          </a>
        </span>
      </label>

      {status === "error" && <p className="contact-form__error">{t.error}</p>}

      <button className="contact-form__submit" type="submit" disabled={!canSubmit}>
        {isSubmitting ? (
          <>
            <FaSpinner className="contact-form__spinner" aria-hidden="true" /> {t.sending}
          </>
        ) : (
          t.submit
        )}
      </button>
    </form>
  );
};

export default ContactsForm;
