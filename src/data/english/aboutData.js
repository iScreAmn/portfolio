import { FaLinkedinIn, FaInstagram, FaGithub } from "react-icons/fa";

export const heroData = {
  eyebrow: "About",
  title: "Dimitri Jmukhadze",
  lead: "I build websites and web applications for business",
  subtitle:
    "I create fast, modern, and easy-to-use websites — from presentation pages to complex web services. I think through everything: structure, interface design, animations, and how people interact with the product.",
  subtitleSecondary:
    "I write clear, high-quality code so the project is easy to maintain and grow. My goal is a usable digital product that helps a business solve its tasks — not just a site that looks good.",
};

export const posterAlt = "Dimitri Jmukhadze portrait";

export const cvData = {
  downloadText: "Download CV",
  // PDF лежит в public/: сборщик Next статические импорты .pdf не понимает,
  // а файл всё равно нужен как обычная ссылка на скачивание.
  filePath: "/docs/Dimitri_Jmukhadze_CV.pdf",
};

export const socialLinks = [
  {
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/in/dimitri-jmukhadze-2048b733a/",
    ariaLabel: "LinkedIn",
  },
  {
    icon: FaGithub,
    href: "https://github.com/iScreAmn/",
    ariaLabel: "GitHub",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/d.jmukhadze/",
    ariaLabel: "Instagram",
  },
];

export const sectionLabels = {
  stack: "Stack",
  education: "Education",
  experience: "Experience",
};

export const workExperience = [
  {
    title: "Georgian Polygraph Services",
    employmentType: "Full Time | Office",
    period: "2025 - 2026",
    company: "Full Stack Developer",
    description:
      "I develop web applications that help businesses operate more efficiently. I write code that integrates banking payment systems and automates financial workflows.",
  },
  {
    title: "Web Developer",
    employmentType: "Freelance",
    period: "2020 - 2025",
    company: "Freelance",
    description:
      "As a freelance developer, I collaborated with businesses to create custom web applications and interfaces. I focus on delivering practical solutions, integrating third-party services, and iterating quickly based on real user needs.",
  },
  {
    title: "System Engineer",
    employmentType: "Full Time | Remote",
    period: "2019 - 2020",
    company: "Creative Space",
    description:
      "I worked with software environments and network infrastructure, from setup and configuration to monitoring and optimization. I ensured reliable performance, secure systems, and smooth operation across all services.",
  },
];

export const skills = [
  { skill: "JavaScript", level: "" },
  { skill: "React", level: "" },
  { skill: "Next.js", level: "" },
  { skill: "Node.js", level: "" },
  { skill: "Express.js", level: "" },
  { skill: "Tailwind CSS", level: "" },
  { skill: "Vue", level: "" },
  { skill: "TypeScript", level: "" },
  { skill: "VPS", level: "" },
  { skill: "Linux", level: "" },
  { skill: "Docker", level: "" },
  { skill: "Nginx", level: "" },
  { skill: "PostgreSQL", level: "" },
  { skill: "GIT", level: "" },
  { skill: "AI Automation", level: "" },
];

export const education = [
  {
    year: "2024-2025",
    degree: "Backend & Docker",
    institution: "Microsoft Academy",
  },
  {
    year: "2023-2024",
    degree: "Frontend Development",
    institution: "Practicum Academy",
  },
  {
    year: "2019-2020",
    degree: "Web Development",
    institution: "Information Technologies Institute",
  },
  {
    year: "2017-2018",
    degree: "Network & System Engineer",
    institution: "Pulsar IT Academy",
  },
];

export const awards = [
  {
    year: "2020-2022",
    title: "Frontend Developer",
    institution: "Law Firm 'მართსაჯულება'",
  },
  {
    year: "2024-2025",
    title: "Web Developer",
    institution: "Freelancer",
  },
];
