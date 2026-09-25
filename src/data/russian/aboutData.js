import { FaLinkedinIn, FaInstagram, FaGithub } from "react-icons/fa";

export const heroData = {
  eyebrow: "Обо мне",
  title: "Дмитрий Джмухадзе",
  lead: "Разрабатываю сайты и веб-приложения для бизнеса",
  subtitle:
    "Создаю быстрые, современные и удобные сайты, от лендинг страниц до сложных веб-сервисов. Продумываю всё: структуру, дизайн интерфейса, анимации и взаимодействие с пользователем.",
  subtitleSecondary:
    "Пишу качественный и понятный код, чтобы проект было легко поддерживать и развивать. Моя цель сделать не просто красивый сайт, а удобный цифровой продукт, который помогает бизнесу решать свои задачи.",
  chips: ["Сайты под бизнес", "Веб-приложения", "Цифровые продукты", "UI/UX", "Адаптивность", "SEO разработка"],
};

export const posterAlt = "Портрет Димитри Джмухадзе";

export const cvData = {
  downloadText: "Скачать CV",
  // PDF лежит в public/: сборщик Next статические импорты .pdf не понимает,
  // а файл всё равно нужен как обычная ссылка на скачивание.
  filePath: "/docs/Dimitri_Jmukhadze_CV.pdf",
};

export const socialLinks = [
  {
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/in/dimitri-jmukhadze-2048b733a/",
    ariaLabel: "Профиль в LinkedIn",
  },
  {
    icon: FaGithub,
    href: "https://github.com/iScreAmn/",
    ariaLabel: "Профиль на GitHub",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/d.jmukhadze/",
    ariaLabel: "Профиль в Instagram",
  },
];

export const sectionLabels = {
  stack: "Стек",
  education: "Образование",
  experience: "Опыт",
};

export const workExperience = [
  {
    title: "Georgian Polygraph Services",
    employmentType: "Полный день | Офис",
    period: "2025 - 2026",
    company: "Full Stack разработчик",
    description:
      "Разрабатываю веб-приложения, которые помогают бизнесу работать эффективнее. Пишу код для интеграции с банковскими платёжными системами и автоматизации финансовых процессов.",
  },
  {
    title: "Веб-разработчик",
    employmentType: "Фриланс",
    period: "2020 - 2025",
    company: "Фриланс",
    description:
      "Как фрилансер сотрудничал с компаниями над кастомными веб-приложениями и интерфейсами. Фокус на практичных решениях, интеграции сторонних сервисов и быстрых итерациях по обратной связи пользователей.",
  },
  {
    title: "Системный инженер",
    employmentType: "Полный день | Удалённо",
    period: "2019 - 2020",
    company: "Creative Space",
    description:
      "Работал с программными средами и сетевой инфраструктурой: развёртывание, настройка, мониторинг и оптимизация. Обеспечивал стабильную работу, безопасность и бесперебойность сервисов.",
  },
];

export const skills = [
  { skill: "JavaScript", level: "" },
  { skill: "React", level: "" },
  { skill: "Next.js", level: "" },
  { skill: "Node.js", level: "" },
  { skill: "Express.js", level: "" },
  { skill: "CSS", level: "" },
  { skill: "Vue", level: "" },
  { skill: "TypeScript", level: "" },
  { skill: "GIT", level: "" },
  { skill: "AI Automation", level: "" },
];

export const education = [
  {
    year: "2024-2025",
    degree: "Infrastructure Deployment & VPS Administration",
    institution: "Microsoft Academy",
  },
  {
    year: "2023-2024",
    degree: "Bakend-разработка",
    institution: "Practicum Academy",
  },
  {
    year: "2019-2020",
    degree: "Frontend-разработка",
    institution: "Институт информационных технологий",
  },
  {
    year: "2017-2018",
    degree: "Сетевой инженер и системный администратор",
    institution: "Pulsar IT Academy",
  },
];

export const awards = [
  {
    year: "2020-2022",
    title: "Frontend-разработчик",
    institution: "Юридическая фирма «მართსაჯულება»",
  },
  {
    year: "2024-2025",
    title: "Веб-разработчик",
    institution: "Фриланс",
  },
];
