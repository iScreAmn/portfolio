import Admin from "../../../views/AdminPage/Admin";

export const metadata = {
  title: "Admin",
  description: "Analytics dashboard.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Admin />;
}
