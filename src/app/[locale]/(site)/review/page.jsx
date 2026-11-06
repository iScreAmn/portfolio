import ReviewPage from "../../../../views/ReviewPage/ReviewPage";
import { staticPageMetadata } from "../../../../i18n/metadata";

export const generateMetadata = staticPageMetadata("review", "/review");

export default function Page() {
  return <ReviewPage />;
}
