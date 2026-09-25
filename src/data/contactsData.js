import { FaPhone, FaEnvelope, FaLocationDot } from "react-icons/fa6";

const titles = {
  en: { phone: "Phone", email: "E-mail", address: "Address" },
  ru: { phone: "Телефон", email: "E-mail", address: "Адрес" },
};

export const getContactsData = (locale = "en") => {
  const t = titles[locale] || titles.en;
  return [
    {
      id: 1,
      icon: FaPhone,
      title: t.phone,
      value: "+995 571 040 626",
      link: "tel:995571040626",
    },
    {
      id: 2,
      icon: FaEnvelope,
      title: t.email,
      value: "jmukhadze.dimitri@gmail.com",
      link: "mailto:jmukhadze.dimitri@gmail.com",
    },
    {
      id: 3,
      icon: FaLocationDot,
      title: t.address,
      value: "Mikheil Tsinamdzgvrishvili str #148",
      link: "#",
    },
  ];
};

const contactsData = getContactsData("en");

export default contactsData;
