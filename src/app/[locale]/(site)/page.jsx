import HomePage from "../../../views/HomePage/HomePage";
import { staticPageMetadata } from "../../../i18n/metadata";

export const generateMetadata = staticPageMetadata("home", "/");

export default function Page() {
  return <HomePage />;
}
