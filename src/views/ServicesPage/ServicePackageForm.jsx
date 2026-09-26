"use client";

import { useState } from "react";
import { FaTelegramPlane, FaWhatsapp, FaSpinner } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { getApiBase } from "../../utils/apiBase";
import { useAnalytics } from "../../analytics/AnalyticsProvider";
import { phoneCountryCodes } from "../../data/calculatorData";

const PRIVACY_LINK = "/privacy";
const PHONE_METHOD = "whatsapp";

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
  withSupport: false,
  agreeToPrivacy: false,
};

const getDial = (countryCode) =>
  phoneCountryCodes.find((c) => c.value === countryCode)?.dial || "";

/** Те же правила, что и в packageValidationRules на сервере. */
const isContactValid = ({ contactMethod, contact, countryCode }) => {
  const value = contact.trim();
  const digits = value.replace(/\D/g, "").length;
  if (contactMethod === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (contactMethod === PHONE_METHOD) {
    const total = digits + getDial(countryCode).replace(/\D/g, "").length;
    return digits >= 6 && total <= 15;
  }
  return /^@?[A-Za-z]\w{3,31}$/.test(value) || digits >= 8;
};

const ServicePackageForm = ({ pkg, uiTexts, onDone }) => {
  const { track } = useAnalytics();
  const t = uiTexts.form;
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
  const canSubmit = nameValid && contactValid && form.agreeToPrivacy && !isSubmitting;

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

    const contact = isPhone
      ? `${getDial(form.countryCode)} ${form.contact.trim()}`
      : form.contact.trim();

    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await fetch(`${getApiBase()}/api/packages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          packageId: pkg.accent,
          packagePrice: pkg.price,
          contactMethod: form.contactMethod,
          contact,
          withSupport: form.withSupport,
          agreeToPrivacy: form.agreeToPrivacy,
        }),
      });
      const data = await response.json();
      const ok = Boolean(data?.success);
      track("form", "submit", "services-package", {
        status: ok ? "success" : "error",
        package: pkg.accent,
        method: form.contactMethod,
        support: form.withSupport,
      });
      if (!ok) throw new Error(data?.message);

      setStatus("success");
      setForm(emptyForm);
      setTouched({});
      setTimeout(onDone, 1800);
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div className="services-modal__form services-modal__success" role="status">
        {t.success}
      </div>
    );
  }

  return (
    <form className="services-modal__form" onSubmit={handleSubmit} autoComplete="off" noValidate>
      <label className="services-modal__label">
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
          <span className="services-modal__error">{t.errors.name}</span>
        )}
      </label>

      <div className="services-modal__label">
        <span id="services-contact-method">{t.contactMethodLabel}</span>
        <div className="services-modal__methods" role="radiogroup" aria-labelledby="services-contact-method">
          {t.contactMethods.map((method) => {
            const Icon = contactMethodIcons[method.id];
            const selected = form.contactMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`services-modal__method ${selected ? "is-selected" : ""}`}
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

      <div className="services-modal__label">
        <div className="services-modal__contact">
          {isPhone && (
            <select
              className="services-modal__code"
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
          <span className="services-modal__error">{t.errors[form.contactMethod]}</span>
        )}
      </div>

      <label className="services-modal__check services-modal__check--support">
        <input
          type="checkbox"
          checked={form.withSupport}
          onChange={(e) => update("withSupport", e.target.checked)}
        />
        <span className="services-modal__check-text">
          {t.supportLabel}
          <strong className="services-modal__check-price">{t.supportPrice}</strong>
        </span>
      </label>

      <label className="services-modal__check">
        <input
          type="checkbox"
          checked={form.agreeToPrivacy}
          onChange={(e) => update("agreeToPrivacy", e.target.checked)}
        />
        <span className="services-modal__check-text services-modal__check-text--muted">
          {t.privacyPrefix}{" "}
          <a href={PRIVACY_LINK} target="_blank" rel="noopener noreferrer">
            {t.privacyLink}
          </a>
        </span>
      </label>

      {status === "error" && <p className="services-modal__error">{t.error}</p>}

      <button className="services-modal__submit" type="submit" disabled={!canSubmit}>
        {isSubmitting ? (
          <>
            <FaSpinner className="services-modal__spinner" aria-hidden="true" /> {t.sending}
          </>
        ) : (
          uiTexts.submitButton
        )}
      </button>
    </form>
  );
};

export default ServicePackageForm;
