"use client";

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { signIn, signOut } from '../../lib/analyticsAdmin';
import AnalyticsContainer from './analytics/AnalyticsContainer';
import './Admin.css';

export default function Admin() {
  // Сессию держит сам supabase-js (persistSession), localStorage вручную не трогаем.
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return undefined;
    }

    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data?.session ?? null);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (!supabase) {
    return (
      <div className="admin-gate">
        <div className="admin-gate__card">
          <h1 className="admin-gate__title">Admin Panel</h1>
          <p className="admin-gate__err">
            Supabase не настроен. Добавьте `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` в `.env`.
          </p>
        </div>
      </div>
    );
  }

  const tryAuth = useCallback(async () => {
    const mail = email.trim();
    if (!mail || !password) {
      setError('Введите email и пароль');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await signIn(mail, password);
      setPassword('');
      // сессию проставит onAuthStateChange
    } catch (e) {
      setError(e?.message || 'Не удалось войти');
    } finally {
      setSubmitting(false);
    }
  }, [email, password]);

  const logout = async () => {
    try {
      await signOut();
    } catch {
      /* даже если разлогин не дошёл до сервера, локальную сессию supabase-js сбросит */
    }
    setSession(null);
  };

  if (checking) {
    return (
      <div className="admin-gate">
        <div className="admin-gate__card">
          <p className="admin-gate__hint">Проверяем сессию…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin-gate">
        <div className="admin-gate__card">
          <h1 className="admin-gate__title">Admin Panel</h1>
          <p className="admin-gate__hint">Login to access the analytics.</p>
          <input
            type="email"
            className="admin-gate__input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            className="admin-gate__input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && tryAuth()}
            autoComplete="current-password"
          />
          {error && <p className="admin-gate__err">{error}</p>}
          <button
            type="button"
            className="admin-gate__btn"
            onClick={tryAuth}
            disabled={submitting}
          >
            {submitting ? 'Entering...' : 'Enter'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <AnalyticsContainer session={session} onLogout={logout} />
    </div>
  );
}
