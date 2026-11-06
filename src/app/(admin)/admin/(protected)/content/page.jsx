import ContentPage from "../../../../../views/AdminPage/content/ContentPage";

export const metadata = {
  title: "Admin content",
  description: "Site content editor.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ContentPage />;
}
