import ServicesPage from "../../../../views/ServicesPage/ServicesPage";
import { staticPageMetadata } from "../../../../i18n/metadata";

export const generateMetadata = staticPageMetadata("services", "/services");

export default function Page() {
  return <ServicesPage />;
}
