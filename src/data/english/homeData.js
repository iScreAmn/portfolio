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
  { id: "home", label: "home", type: "section", hint: "Intro and quick pitch" },
  {
    id: "about",
    label: "about",
    type: "route",
    path: "/about",
    hint: "Background and stack",
  },
  {
    id: "services",
    label: "services",
    type: "route",
    path: "/services",
    hint: "What I can build for you",
  },
  {
    id: "portfolio",
    label: "portfolio",
    type: "route",
    path: "/portfolio",
    hint: "Selected projects",
  },
  {
    id: "hobby",
    label: "hobby",
    type: "route",
    path: "/hobby",
    hint: "Life beyond the code",
  },
  {
    id: "contact",
    label: "contact",
    type: "route",
    path: "/contacts",
    hint: "Let's get in touch",
  },
];

export const navMenu = {
  open: "Open the menu",
  close: "Close the menu",
  panelLabel: "Main menu",
  sectionsTitle: "Navigation",
  settingsTitle: "Settings",
  theme: {
    label: "Theme",
    dark: "Dark",
    light: "Light",
    darkAria: "Switch to the dark theme",
    lightAria: "Switch to the light theme",
  },
  language: {
    label: "Language",
    options: { en: "EN", ru: "RU" },
    switchTo: {
      en: "Switch to English",
      ru: "Switch to Russian",
    },
  },
};

export const homeData = {
  greeting: "Hey, I am D.J",
  role: "Front-end Developer",
  description:
    "I create stunning websites for your business, Highly experienced in web design and development",
  contactButton: {
    text: "Contact me",
    href: "https://t.me/iscreamn",
    icon: FaPaperPlane,
  },
  scrollDown: {
    text: "Scroll-Down",
    href: "#about",
    icon: FaArrowDownLong,
  },
};

export const profList = [
  {
    id: 1,
    number: "5+",
    text: "Years of experience",
  },
  {
    id: 2,
    number: "50+",
    text: "Happy Customers",
  },
  {
    id: 3,
    number: "100%",
    text: "Result",
  },
];

export const aboutSectionData = {
  sectionTitle: "About me",
  sectionSubtitle: "About me",
  heading: "I'm Dimitri Jmukhadze",
  taglineRole: "Front-End Developer",
  taglineBetween: " based in ",
  taglineLocation: "Georgia",
  description:
    "I build custom solutions for clients, focusing on crafting sleek, modern websites, web applications, and e-commerce platforms. I'm driven by a passion for creating engaging digital experiences through thoughtful and impactful design. Take a look at my portfolio",
  moreAboutButton: {
    text: "More about me",
    path: "/about",
  },
};

export const featuredPortfolioSectionData = {
  eyebrow: "Selected work",
  title: "Recent cases I'm proud of",
  subtitle:
    "Modern launches with attention to micro-interactions, responsive grids, and intentional copy. Each card links to the full case study.",
  allProjectsButton: {
    text: "All Projects",
    path: "/portfolio",
  },
  featuredCount: 3,
};

export const servicesSectionData = {
  sectionTitle: "Recent Project",
  sectionSubtitle: "Recent Project",
  slides: [
    {
      id: "flame-jumper",
      eyebrow: "Check it out",
      subtitle: "Game developed by me",
      title: "Flame Jumper",
      button: {
        text: "Let's Play",
        path: "/game",
        icon: IoLogoGameControllerA,
      },
      imageSrc: flameJumper,
      imageAlt: "Flame Jumper",
    },
    {
      id: "imgbox-converter",
      eyebrow: "Check it out",
      subtitle: "App developed by me",
      title: "ImgBox Converter",
      button: {
        text: "Learn more",
        path: "/portfolio/imgbox-converter",
        icon: FaArrowRight,
      },
      imageSrc: imgboxCover,
      imageAlt: "ImgBox Converter",
    },
  ],
};

export const brandsSectionData = {
  sectionTitle: "Trusted by Clients",
  sectionSubtitle: "Brands I've Worked With",
};

export const clientsSectionData = {
  sectionTitle: "Trusted By",
  sectionSubtitle: "Trusted By",
  addReviewButton: "Add Review",
  ctaTitle: "Worked together?",
  ctaText:
    "Tell me how the project went. A couple of minutes of your time — and your review shows up in this block.",
};

export const clientsData = [
  {
    id: 1,
    imgSrc: client4,
    description:
      "Enjoyed working with Dimitri. He developed our web-page ensuring stability, speed, and full functionality with excellent responsive performance",
    name: "Levan",
    company: "Burger House",
    companyLogo: brand3,
  },
  {
    id: 2,
    imgSrc: client5,
    description:
      "Collaborated with Dimitri on a project. His IT solutions improved legal workflows, accessibility, and client-facing platform reliability",
    name: "Natia",
    company: "GeoTrip",
  },
  {
    id: 3,
    imgSrc: client2,
    description:
      "We worked with Dimitri on several projects. His modern solutions improved legal workflows, accessibility, and client-facing platform reliability",
    name: "Giorgi",
    company: "Law Firm",
    companyLogo: brand8,
  },
  {
    id: 4,
    imgSrc: client1,
    description:
      "Сollaborated with Dimitri six months ago. His AI chatbot was efficient and professional. Perfectly matched our company’s exact needs",
    name: "Alexandra",
    company: "2 Sisters",
  },
  {
    id: 5,
    imgSrc: client3,
    description:
      "Enjoyed working with Dimitri. He developed our web-page ensuring stability, speed, and full functionality with excellent responsive performance",
    name: "Elena",
    company: "Old Tbilisi Narikala",
  },
];
