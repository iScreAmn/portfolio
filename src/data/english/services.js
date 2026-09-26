import { service1, service2, service3, abonent } from "../../assets/images";

export const heroData = {
  eyebrow: "Services",
  title: "Development Packages",
  subtitle:
    "Modern UI/UX website development with clean code, scalable structure, and responsive performance. Choose a package or request a custom solution. I handle front-end, integrations, and technical optimization with smooth delivery and support.",
};

export const packages = [
  {
    name: "Standart",
    price: "from $200",
    items: ["Landings", "Mini apps", "Chat Bots"],
    accent: "starter",
    image: service1,
    text: "Quick launches, focused funnels, and micro experiences that convert. Solid build with minimal friction.",
  },
  {
    name: "Comfort",
    price: "from $600",
    items: ["Multi-page", "Multilanguage", "Online store"],
    accent: "pro",
    image: service2,
    text: "Scalable, multilingual campaigns and stores with easy CMS handoff and guided design QA.",
  },
  {
    name: "Premium",
    price: "Individual",
    items: ["Custom UX/UI", "Animations", "Full support"],
    accent: "premium",
    image: service3,
    text: "Full product partnerships: research, sprint design, advanced motion, and maintenance-ready delivery.",
  },
];

export const uiTexts = {
  choosePlan: "Choose plan",
  closeButton: "Close",
  closeSymbol: "✕",
  submitButton: "Request this service",
  form: {
    nameLabel: "Name",
    namePlaceholder: "How should I address you?",
    contactMethodLabel: "Preferred contact method",
    contactMethods: [
      { id: "telegram", label: "Telegram", placeholder: "@username or phone" },
      { id: "whatsapp", label: "WhatsApp", placeholder: "Phone number" },
      { id: "email", label: "Email", placeholder: "your@email.com" },
    ],
    countryCodeLabel: "Country code",
    supportLabel: "I need website support after launch",
    supportPrice: "$100/month",
    privacyPrefix: "By clicking the button, you agree to the terms of",
    privacyLink: "processing of personal data",
    sending: "Sending...",
    success: "Thank you! I'll get in touch with you shortly.",
    error: "Failed to send the request. Please try again.",
    errors: {
      name: "Enter your name (at least 2 characters)",
      telegram: "Enter a Telegram @username or phone number",
      whatsapp: "Enter a valid phone number",
      email: "Enter a valid email",
    },
  },
};

export const supportCtaData = {
  eyebrow: "Website support",
  title: "Need website support after launch?",
  description:
    "I also offer monthly support for websites I build, so updates, fixes, and small improvements can be handled fast without starting a new project from scratch.",
  maintenance: {
    title: "Website Maintenance",
    price: "$100/month",
    includesLabel: "Includes:",
    items: [
      "Unlimited minor edits and content adjustments",
      "Fast technical support and issue handling",
      "Content updates and ongoing improvements",
      "Small feature enhancements and fixes",
      "General maintenance (hosting support, bug fixes, and basic SEO optimization)",
    ],
  },
  image: abonent,
  imageAlt: "Website maintenance support",
};
