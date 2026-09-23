import AdminLayout from "../../../../views/AdminPage/AdminLayout";

/**
 * Проверка сессии и хедер — один раз на все страницы админки.
 * (protected) — route-группа: на URL она не влияет, но оставляет
 * /admin/login снаружи, за пределами этой проверки.
 */
export const metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
