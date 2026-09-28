"use client";

import { useState } from "react";
import { phoneCountryCodes } from "../../data/calculatorData";
import { PHONE_METHOD, isContactValid } from "../../utils/contactValidation";

const PRIVACY_LINK = "/privacy";

/** Состояние формы контактов: значения, «тронутые» поля и валидность. */
export const useContactForm = (initialForm) => {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const touch = (key) => {
    if (form[key].trim()) setTouched((prev) => ({ ...prev, [key]: true }));
  };
  const selectMethod = (id) => {
    if (id === form.contactMethod) return;
    setForm((prev) => ({ ...prev, contactMethod: id, contact: "" }));
    setTouched((prev) => ({ ...prev, contact: false }));
  };
  const reset = () => {
    setForm(initialForm);
    setTouched({});
  };

  const nameValid = form.name.trim().length >= 2;
  const contactValid = isContactValid(form);
  const isValid = nameValid && contactValid && form.agreeToPrivacy;

  return { form, setForm, touched, update, touch, selectMethod, reset, nameValid, contactValid, isValid };
};

/** Поля имени, способа связи, контакта и согласия — общие для шага калькулятора и модалки. */
const ContactFields = ({ t, contactMethods, contactForm, idPrefix, onEdit }) => {
  const { form, touched, update, touch, selectMethod, nameValid, contactValid } = contactForm;
  const isPhone = form.contactMethod === PHONE_METHOD;
  const activeMethod = contactMethods.find((m) => m.id === form.contactMethod);
  const methodLabelId = `${idPrefix}-contact-method`;

  const change = (key, value) => {
    update(key, value);
    onEdit?.();
  };

  return (
    <>
      <label className="calculator-form__field">
        {t.nameLabel}
        <input
          type="text"
          name="name"
          className={`calculator-contact-input ${touched.name && !nameValid ? "is-invalid" : ""}`}
          placeholder={t.namePlaceholder}
          value={form.name}
          onChange={(e) => change("name", e.target.value)}
          onBlur={() => touch("name")}
          maxLength={100}
        />
        {touched.name && !nameValid && (
          <span className="calculator-form__error">{t.errors.name}</span>
        )}
      </label>

      <div className="calculator-form__field">
        <span id={methodLabelId}>{t.contactMethodLabel}</span>
        <div className="calculator-form__methods" role="radiogroup" aria-labelledby={methodLabelId}>
          {contactMethods.map((method) => {
            const Icon = method.icon;
            const selected = form.contactMethod === method.id;
            return (
              <button
                type="button"
                key={method.id}
                role="radio"
                aria-checked={selected}
                className={`calculator-form__method ${selected ? "is-selected" : ""}`}
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

      <div className="calculator-form__field">
        <div className="calculator-phone-field">
          {isPhone && (
            <select
              className="calculator-contact-input calculator-phone-code"
              value={form.countryCode}
              onChange={(e) => change("countryCode", e.target.value)}
              aria-label={t.ctaCountryCodeLabel}
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
            className={`calculator-contact-input ${touched.contact && !contactValid ? "is-invalid" : ""}`}
            placeholder={activeMethod?.placeholder}
            aria-label={activeMethod?.placeholder}
            value={form.contact}
            onChange={(e) =>
              change("contact", isPhone ? e.target.value.replace(/[^\d\s()-]/g, "") : e.target.value)
            }
            onBlur={() => touch("contact")}
            maxLength={100}
          />
        </div>
        {touched.contact && !contactValid && (
          <span className="calculator-form__error">{t.errors[form.contactMethod]}</span>
        )}
      </div>

      <label className="calculator-privacy">
        <input
          type="checkbox"
          className="calculator-privacy__input"
          checked={form.agreeToPrivacy}
          onChange={(e) => change("agreeToPrivacy", e.target.checked)}
        />
        <span className="calculator-privacy__text">
          {t.ctaPrivacyPrefix}{" "}
          <a href={PRIVACY_LINK} className="calculator-privacy__link" target="_blank" rel="noopener noreferrer">
            {t.ctaPrivacyLink}
          </a>
        </span>
      </label>
    </>
  );
};

export default ContactFields;
