import HobbyPage from "../../../../views/HobbyPage/HobbyPage";
import { staticPageMetadata } from "../../../../i18n/metadata";

export const generateMetadata = staticPageMetadata("hobby", "/hobby");

export default function Page() {
  return <HobbyPage />;
}
