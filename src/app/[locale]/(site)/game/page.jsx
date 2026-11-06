import GamePage from "../../../../views/GamePage/GamePage";
import { staticPageMetadata } from "../../../../i18n/metadata";

export const generateMetadata = staticPageMetadata("game", "/game");

export default function Page() {
  return <GamePage />;
}
