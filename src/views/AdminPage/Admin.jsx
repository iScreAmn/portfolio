"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signOut } from '../../lib/analyticsAdmin';
import AnalyticsContainer from './analytics/AnalyticsContainer';
import adminData from '../../data/adminData';
import './Admin.css';

export default function Admin() {
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
    return (
      <div className="admin-gate">
        <div className="admin-gate__card">
          <p className="admin-gate__hint">{adminData.common.checkingSession}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <AnalyticsContainer user={user} onLogout={logout} />
    </div>
  );
}
