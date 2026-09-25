"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * В react-router несуществующие пути ловил `<Route path="*" element={<HomePage/>} />`.
 * Здесь тот же эффект даёт редирект на главную — иначе страница отрисовалась бы
 * без Header/Footer, которые живут в layout группы (site).
 *
 * Редирект делаем в эффекте, а не через `redirect()` во время рендера: бросок
 * из рендера not-found в dev-режиме React ломает performance.measure
 * («'NotFound' cannot have a negative time stamp»).
 */
export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}
