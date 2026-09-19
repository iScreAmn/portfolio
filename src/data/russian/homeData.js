import { FaPaperPlane, FaArrowRight } from "react-icons/fa";
import { FaArrowDownLong } from "react-icons/fa6";
import { IoLogoGameControllerA } from "react-icons/io";
import {
  client1,
  client2,
  client3,
  client4,
  client5,
  brand3,
  brand8,
  flameJumper,
  imgboxCover,
} from "../../assets/images";

export const navItems = [
  { id: "home", label: "главная", type: "section", hint: "Коротко обо всём" },
  {
    id: "about",
    label: "обо мне",
    type: "route",
    path: "/about",
    hint: "Опыт и стек",
  },
  {
    id: "services",
    label: "услуги",
    type: "route",
    path: "/services",
    hint: "Что я могу сделать",
  },
  {
    id: "portfolio",
    label: "портфолио",
    type: "route",
    path: "/portfolio",
    hint: "Избранные проекты",
  },
  {
    id: "hobby",
    label: "хобби",
    type: "route",
    path: "/hobby",
    hint: "Жизнь вне кода",
  },
  {
    id: "contact",
    label: "контакты",
    type: "route",
    path: "/contacts",
    hint: "Связаться со мной",
  },
];

export const navMenu = {
  open: "Открыть меню",
  close: "Закрыть меню",
  panelLabel: "Главное меню",
  sectionsTitle: "Навигация",
  settingsTitle: "Настройки",
  theme: {
    label: "Тема",
    dark: "Тёмная",
    light: "Светлая",
    darkAria: "Переключить на тёмную тему",
    lightAria: "Переключить на светлую тему",
  },
  language: {
    label: "Язык",
    options: { en: "EN", ru: "RU" },
    switchTo: {
      en: "Переключить на английский",
      ru: "Переключить на русский",
    },
  },
};

export const homeData = {
  greeting: "Дмитрий на связи!",
  role: "Full-stack разработчик",
  description:
    "Помогаю бизнесу расти с помощью продуманных и визуально сильных сайтов.",
  contactButton: {
    text: "Написать мне",
    href: "https://t.me/iscreamn",
    icon: FaPaperPlane,
  },
  scrollDown: {
    text: "Далее",
    href: "#about",
    icon: FaArrowDownLong,
  },
};

export const profList = [
  {
    id: 1,
    number: "5+",
    text: "Лет опыта",
  },
  {
    id: 2,
    number: "50+",
    text: "Довольных клиентов",
  },
  {
    id: 3,
    number: "100%",
    text: "Результат",
  },
];

export const aboutSectionData = {
  sectionTitle: "Обо мне",
  sectionSubtitle: "Обо мне",
  heading: "Я - Дмитрий Джмухадзе",
  taglineRole: "Full-stack разработчик",
  taglineBetween: " из ",
  taglineLocation: "Грузии",
  description:
    "Разрабатываю сайты и веб-приложения, которые привлекают клиентов и помогают бизнесу расти. Современный дизайн, быстрая работа и удобный пользовательский опыт, всё продумано до деталей. Посмотрите портфолио и оцените результат.",
  moreAboutButton: {
    text: "Подробнее обо мне",
    path: "/about",
  },
};

export const featuredPortfolioSectionData = {
  eyebrow: "Избранное",
  title: "Недавние проекты, которыми горжусь",
  subtitle:
    "Недавние проекты включают систему записи и администрирования пациентов, конверсионный сайт с дизайнерским подходом, а также платформу для продажи широкоформатных принтеров и сопутствующих материалов.",
  allProjectsButton: {
    text: "Все проекты",
    path: "/portfolio",
  },
  featuredCount: 3,
};

export const servicesSectionData = {
  sectionTitle: "В работе",
  sectionSubtitle: "Разрабатываю прямо сейчас",
  slides: [
    {
      id: "flame-jumper",
      eyebrow: "Протестируй одним их первых",
      subtitle: "Я разрабатываю игру",
      title: "Flame Jumper",
      button: {
        text: "Играть",
        path: "/game",
        icon: IoLogoGameControllerA,
      },
      imageSrc: flameJumper,
      imageAlt: "Flame Jumper",
    },
    {
      id: "imgbox-converter",
      subtitle: "Я разрабатываю приложение",
      title: "ImgBox Converter",
      button: {
        text: "Подробнее",
        path: "/portfolio/imgbox-converter",
        icon: FaArrowRight,
      },
      imageSrc: imgboxCover,
      imageAlt: "ImgBox Converter",
    },
  ],
};

export const brandsSectionData = {
  sectionTitle: "Проверено клиентами",
  sectionSubtitle: "Клиенты, с которыми я работал",
};

export const clientsSectionData = {
  sectionTitle: "Мне доверяют",
  sectionSubtitle: "Мне доверяют",
  addReviewButton: "Оставить отзыв",
  ctaTitle: "Работали вместе?",
  ctaText:
    "Расскажите, как прошёл проект. Пара минут вашего времени — и отзыв появится в этом блоке.",
};

export const clientsData = [
  {
    id: 1,
    imgSrc: client4,
    description:
      "Приятно было работать с Дмитрием. Сделал наш сайт стабильным, быстрым и полностью рабочим, отличная работа",
    name: "Леван",
    company: "Burger House",
    companyLogo: brand3,
  },
  {
    id: 2,
    imgSrc: client5,
    description:
      "Работали с Дмитрием над проектом. Его креативные решения улучшили наши внутренние процессы, доступность и надёжность клиентской платформы",
    name: "Натия",
    company: "GeoTrip",
  },
  {
    id: 3,
    imgSrc: client2,
    description:
      "Несколько проектов вместе с Дмитрием. Front-end решения усилили юридические процессы, доступность и стабильность платформы для клиентов",
    name: "Гиорги",
    company: "Law Firm",
    companyLogo: brand8,
  },
  {
    id: 4,
    imgSrc: client1,
    description:
      "Сотрудничали полгода назад. AI-чатбот получился эффективным и профессиональным — точно под задачи компании",
    name: "Александра",
    company: "2 Sisters",
  },
  {
    id: 5,
    imgSrc: client3,
    description:
      "Приятно было работать с Дмитрием. Сайт стабильный, быстрый, полный функционал и отличная адаптивность",
    name: "Елена",
    company: "Old Tbilisi Narikala",
  },
];
