"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from '../../../lib/analyticsAdmin';
import adminData from '../../../data/adminData';
import './LoginPage.css';

const { common, login } = adminData;

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
      setError(login.missingFieldsError);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await signIn(mail, password);
      setPassword('');
      router.replace('/admin');
    } catch (err) {
      setError(err?.message || login.genericError);
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="admin-gate">
        <div className="admin-gate__card">
          <p className="admin-gate__hint">{common.checkingSession}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-gate">
      <form className="admin-gate__card" onSubmit={handleSubmit}>
        <h1 className="admin-gate__title">{login.title}</h1>
        <p className="admin-gate__hint">{login.hint}</p>

        <input
          type="email"
          className="admin-gate__input"
          placeholder={login.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
        <input
          type="password"
          className="admin-gate__input"
          placeholder={login.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p className="admin-gate__err">{error}</p>}

        <button type="submit" className="admin-gate__btn" disabled={submitting}>
          {submitting ? login.submittingLabel : login.submitLabel}
        </button>
      </form>
    </div>
  );
}
