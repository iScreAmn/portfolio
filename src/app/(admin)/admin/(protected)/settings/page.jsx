import SettingsPage from "../../../../../views/AdminPage/settings/SettingsPage";

export const metadata = {
  title: "Admin settings",
  description: "Account settings.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SettingsPage />;
}
