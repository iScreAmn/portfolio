import { phoneCountryCodes } from "../data/phoneCountryCodes";

export const PHONE_METHOD = "whatsapp";

export const getDial = (countryCode) =>
  phoneCountryCodes.find((c) => c.value === countryCode)?.dial || "";

export const isContactValid = ({ contactMethod, contact, countryCode }) => {
  const value = contact.trim();
  const digits = value.replace(/\D/g, "").length;
  if (contactMethod === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (contactMethod === PHONE_METHOD) {
    const total = digits + getDial(countryCode).replace(/\D/g, "").length;
    return digits >= 6 && total <= 15;
  }
  return /^@?[A-Za-z]\w{3,31}$/.test(value) || digits >= 8;
};

export const formatContact = ({ contactMethod, contact, countryCode }) =>
  contactMethod === PHONE_METHOD
    ? `${getDial(countryCode)} ${contact.trim()}`
    : contact.trim();
