import {
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa6";

export const contactsHeroData = {
  eyebrow: "Контакты",
  title: "Есть проект? Давайте обсудим",
  subtitle:
    "Расскажите о вашей идее, задачах, сроках или бюджете. Помогу превратить её в современный, быстрый и удобный цифровой продукт.",
  panelTitle: "Напишите мне",
  panelLead: "Выберите удобный способ связи или расскажите свою историю. Слежу за всеми каналами ежедневно.",
  panelStatus: "Открыт для новых проектов",
  panelSocialsTitle: "Соцсети",
  panelBadge: "давайте обсудим • давайте обсудим • ",
};

export const contactsItems = [
  {
    id: 1,
    icon: FaPhone,
    title: "Телефон",
    value: "+995 571 040 626",
    link: "tel:995571040626",
  },
  {
    id: 2,
    icon: FaEnvelope,
    title: "E-mail",
    value: "jmukhadze.dimitri@gmail.com",
    link: "mailto:jmukhadze.dimitri@gmail.com",
  },
];

export const contactsSocials = [
  {
    id: "instagram",
    icon: FaInstagram,
    title: "Instagram",
    handle: "@d.jmukhadze",
    link: "https://www.instagram.com/d.jmukhadze/",
  },
  {
    id: "github",
    icon: FaGithub,
    title: "GitHub",
    handle: "iScreAmn",
    link: "https://github.com/iScreAmn/",
  },
  {
    id: "linkedin",
    icon: FaLinkedinIn,
    title: "LinkedIn",
    handle: "Dimitri Jmukhadze",
    link: "https://www.linkedin.com/in/dimitri-jmukhadze-2048b733a/",
  },
];

export const contactsFormData = {
  title: "Оставить заявку",
  lead: "Оставьте контакты и пару слов о задаче",
  nameLabel: "Имя",
  namePlaceholder: "Как к вам обращаться?",
  contactMethodLabel: "Удобный способ связи",
  contactMethods: [
    { id: "telegram", label: "Telegram", placeholder: "@username или телефон" },
    { id: "whatsapp", label: "WhatsApp", placeholder: "Номер телефона" },
    { id: "email", label: "Email", placeholder: "your@email.com" },
  ],
  countryCodeLabel: "Код страны",
  messageLabel: "Сообщение",
  messagePlaceholder: "Расскажите о проекте: задачи, сроки, бюджет",
  privacyPrefix: "Нажимая кнопку, вы соглашаетесь с условиями",
  privacyLink: "обработки персональных данных",
  sending: "Отправка...",
  submit: "Отправить заявку",
  success: "Спасибо! Заявка отправлена, я свяжусь с вами в ближайшее время.",
  successTitle: "Сообщение доставлено!",
  successEyebrow: "Заявка отправлена",
  deliveredLabel: "Доставлено",
  error: "Не удалось отправить заявку. Попробуйте ещё раз.",
  errors: {
    name: "Введите имя (минимум 2 символа)",
    telegram: "Введите @username в Telegram или номер телефона",
    whatsapp: "Введите корректный номер телефона",
    email: "Введите корректный email",
    message: "Сообщение должно быть от 10 до 1000 символов",
  },
};
