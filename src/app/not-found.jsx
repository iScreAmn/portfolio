import { redirect } from "next/navigation";

/**
 * В react-router несуществующие пути ловил `<Route path="*" element={<HomePage/>} />`.
 * Здесь тот же эффект даёт редирект на главную — иначе страница отрисовалась бы
 * без Header/Footer, которые живут в layout группы (site).
 */
export default function NotFound() {
  redirect("/");
}
