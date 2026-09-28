import { FaPhone, FaEnvelope, FaLocationDot } from "react-icons/fa6";

export const contactsHeroData = {
  eyebrow: "Contact",
  title: "Have a project in mind?",
  subtitle:
    "Tell me about your idea, goals, timeline, or budget. I’ll help turn it into a modern, fast, and user-friendly digital product.",
  panelTitle: "Drop a message",
  panelLead: "Choose a preferred channel or share the story. Everything below is monitored daily.",
};

export const contactsItems = [
  {
    id: 1,
    icon: FaPhone,
    title: "Phone",
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
  {
    id: 3,
    icon: FaLocationDot,
    title: "Address",
    value: "Mikheil Tsinamdzgvrishvili str #148",
    link: "#",
  },
];

export const contactsFormData = {
  title: "Send a request",
  lead: "Leave your contacts and a few words about the task — I'll reply within a day.",
  nameLabel: "Name",
  namePlaceholder: "How should I address you?",
  contactMethodLabel: "Preferred contact method",
  contactMethods: [
    { id: "telegram", label: "Telegram", placeholder: "@username or phone" },
    { id: "whatsapp", label: "WhatsApp", placeholder: "Phone number" },
    { id: "email", label: "Email", placeholder: "your@email.com" },
  ],
  countryCodeLabel: "Country code",
  messageLabel: "Message",
  messagePlaceholder: "Tell me about your project: goals, timeline, budget",
  privacyPrefix: "By clicking the button, you agree to the terms of",
  privacyLink: "processing of personal data",
  sending: "Sending...",
  submit: "Send request",
  success: "Thank you! Your request has been sent — I'll get in touch with you shortly.",
  successTitle: "Message delivered!",
  successEyebrow: "Request sent",
  deliveredLabel: "Delivered",
  error: "Failed to send the request. Please try again.",
  errors: {
    name: "Enter your name (at least 2 characters)",
    telegram: "Enter a Telegram @username or phone number",
    whatsapp: "Enter a valid phone number",
    email: "Enter a valid email",
    message: "Message must be between 10 and 1000 characters",
  },
};
