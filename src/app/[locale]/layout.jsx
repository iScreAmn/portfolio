import { notFound } from "next/navigation";
import "../../index.css";
import { LocaleProvider } from "../../context/LocaleContext";
import { AnalyticsProvider } from "../../analytics/AnalyticsProvider";
import { THEME_INIT_SCRIPT } from "../../utils/themeScript";
import InlineScript from "../../components/inline-script/InlineScript";
import { LOCALES, isLocale } from "../../i18n/config";
import { siteMetadata } from "../../i18n/metadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return siteMetadata(locale);
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <InlineScript html={THEME_INIT_SCRIPT} />
        <div id="root">
          <LocaleProvider locale={locale}>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </LocaleProvider>
        </div>
      </body>
    </html>
  );
}
