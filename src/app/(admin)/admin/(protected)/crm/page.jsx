import CrmContainer from "../../../../../views/AdminPage/crm/CrmContainer";

export const metadata = {
  title: "Admin CRM",
  description: "Client management.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CrmContainer />;
}
