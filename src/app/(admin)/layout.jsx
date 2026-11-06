import "../../index.css";
import { AnalyticsProvider } from "../../analytics/AnalyticsProvider";
import { THEME_INIT_SCRIPT } from "../../utils/themeScript";
import InlineScript from "../../components/inline-script/InlineScript";

export const metadata = {
  title: {
    default: "Admin | DJ Portfolio",
    template: "%s | DJ Portfolio",
  },
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <InlineScript html={THEME_INIT_SCRIPT} />
        <div id="root">
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </div>
      </body>
    </html>
  );
}
