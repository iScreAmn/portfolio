import AnalyticsContainer from "../../../../../views/AdminPage/analytics/AnalyticsContainer";

export const metadata = {
  title: "Admin analytics",
  description: "Analytics dashboard.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AnalyticsContainer />;
}
