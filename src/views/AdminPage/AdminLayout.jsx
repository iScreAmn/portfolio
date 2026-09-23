"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signOut } from '../../lib/analyticsAdmin';
import AdminHeader from './components/AdminHeader';
import { AdminSessionProvider } from './components/AdminSessionContext';
import adminData from '../../data/adminData';
import './Admin.css';

/**
 * Каркас закрытой части админки: одна проверка сессии на все страницы группы
 * и общий хедер. /admin/login сюда не попадает — он лежит вне route-группы
 * (protected), иначе форма входа сама бы редиректила на себя.
 */
export default function AdminLayout({ children }) {
  const router = useRouter();
  // Сессию держит httpOnly-кука: JS её не видит, поэтому единственный способ
  // узнать, вошли мы или нет — спросить у API.
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    getSession()
      .then((currentUser) => {
        if (!active) return;
        if (!currentUser) {
          router.replace('/admin/login');
          return;
        }
        setUser(currentUser);
      })
      .catch(() => {
        if (active) router.replace('/admin/login');
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await signOut();
    } catch {
      /* кука всё равно протухнет — уводим на логин в любом случае */
    }
    setUser(null);
    router.replace('/admin/login');
  }, [router]);

  if (checking || !user) {
    return <div className="admin-page__checking">{adminData.common.checkingSession}</div>;
  }

  return (
    <AdminSessionProvider value={{ user, logout }}>
      <div className="admin-page">
        <AdminHeader onLogout={logout} />
        <main className="admin-page__main">{children}</main>
      </div>
    </AdminSessionProvider>
  );
}
