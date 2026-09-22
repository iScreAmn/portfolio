"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from '../../lib/analyticsAdmin';
import './Admin.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  // Уже вошедшего не держим на форме логина.
  useEffect(() => {
    let active = true;

    getSession()
      .then((user) => {
        if (active && user) router.replace('/admin');
      })
      .catch(() => {
        /* сеть недоступна — просто показываем форму */
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      router.replace('/admin');
    } catch (err) {
      setError(err?.message || 'Не удалось войти');
      setSubmitting(false);
    }
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

  return (
    <div className="admin-gate">
      <form className="admin-gate__card" onSubmit={handleSubmit}>
        <h1 className="admin-gate__title">Admin Panel</h1>
        <p className="admin-gate__hint">Login to access the analytics.</p>

        <input
          type="email"
          className="admin-gate__input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
        <input
          type="password"
          className="admin-gate__input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p className="admin-gate__err">{error}</p>}

        <button type="submit" className="admin-gate__btn" disabled={submitting}>
          {submitting ? 'Entering...' : 'Enter'}
        </button>
      </form>
    </div>
  );
}
