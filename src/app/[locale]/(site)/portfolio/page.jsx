import Portfolio from "../../../../components/portfolio/Portfolio";
import { staticPageMetadata } from "../../../../i18n/metadata";

export const generateMetadata = staticPageMetadata("portfolio", "/portfolio");

export default function Page() {
  return <Portfolio />;
}
