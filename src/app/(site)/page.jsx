import HomePage from "../../views/HomePage/HomePage";

export const metadata = {
  // Заголовок главной берётся из корневого layout как есть, без шаблона "%s | ...".
  title: { absolute: "DJ | Portfolio" },
  description:
    "Front-end developer Dimitri Jmukhadze: websites, web apps and interfaces built with React and Next.js.",
};

export default function Page() {
  return <HomePage />;
}
