import "../index.css";
import { LocaleProvider } from "../context/LocaleContext";
import { AnalyticsProvider } from "../analytics/AnalyticsProvider";
import { THEME_INIT_SCRIPT } from "../utils/themeScript";

export const metadata = {
  title: {
    default: "DJ | Portfolio",
    template: "%s | DJ Portfolio",
  },
  description:
    "Portfolio of Dimitri Jmukhadze — front-end developer building fast, responsive websites and web apps.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: класс темы вешает блокирующий скрипт ниже,
    // до того как React успеет сверить разметку с серверной.
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <div id="root">
          <LocaleProvider>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </LocaleProvider>
        </div>
      </body>
    </html>
  );
}
