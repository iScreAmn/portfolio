import DashboardPage from "../../../../views/AdminPage/dashboard/DashboardPage";

export const metadata = {
  title: "Admin",
  description: "Admin dashboard.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardPage />;
}
