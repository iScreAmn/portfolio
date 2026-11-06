import ContactsPage from "../../../../views/ContactsPage/ContactsPage";
import { staticPageMetadata } from "../../../../i18n/metadata";

export const generateMetadata = staticPageMetadata("contacts", "/contacts");

export default function Page() {
  return <ContactsPage />;
}
