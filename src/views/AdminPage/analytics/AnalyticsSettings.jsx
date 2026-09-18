"use client";

import { useState, useEffect, useCallback } from 'react';
import './AnalyticsSettings.css';
import { IoRefresh } from "react-icons/io5";
import { CiWarning } from "react-icons/ci";
import { getMyProfile, changePassword } from '../../../lib/analyticsAdmin';

const AnalyticsSettings = ({ session, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileMissing, setProfileMissing] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      const row = await getMyProfile();
      setProfile(row);
      setProfileMissing(!row);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setProfileMissing(true);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Пароль должен быть не короче 6 символов' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Пароли не совпадают' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await changePassword(newPassword);
      setMessage({ type: 'success', text: 'Пароль изменён' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Не удалось сменить пароль' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analytics-settings">
      <div className="analytics-settings-header">
        <h2 className="analytics-settings-title">Аккаунт</h2>
        <div className="analytics-settings-header__actions">
          <button
            type="button"
            onClick={fetchProfile}
            className="analytics-settings-refresh"
            disabled={loading}
          >
            <IoRefresh /> Refresh
          </button>
          {typeof onLogout === 'function' && (
            <button type="button" className="admin-page__logout" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`analytics-settings-message analytics-settings-message--${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="analytics-settings-info">
        <div className="analytics-settings-info-card">
          <div className="analytics-settings-info-label">Email:</div>
          <div className="analytics-settings-info-value">{session?.user?.email || '—'}</div>
        </div>
        <div className="analytics-settings-info-card">
          <div className="analytics-settings-info-label">Роль:</div>
          <div className="analytics-settings-info-value">{profile?.role || '—'}</div>
        </div>
      </div>

      {profileMissing && (
        <div className="analytics-settings-message analytics-settings-message--error">
          <CiWarning /> Вход выполнен, но строки в <code>profiles</code> нет — RLS будет
          отдавать пустую статистику. Добавьте профиль этому пользователю в Supabase.
        </div>
      )}

      <div className="analytics-settings-section">
        <h3 className="analytics-settings-section-title">Смена пароля</h3>
        <p className="analytics-settings-section-desc">
          Меняется через Supabase Auth для текущего пользователя.
        </p>

        <div className="analytics-settings-modal-input-group">
          <input
            type="password"
            className="analytics-settings-modal-input"
            placeholder="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="analytics-settings-modal-input-group">
          <input
            type="password"
            className="analytics-settings-modal-input"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
            autoComplete="new-password"
          />
        </div>
        <button
          type="button"
          onClick={handleChangePassword}
          className="analytics-settings-btn analytics-settings-btn--warning"
          disabled={loading || !newPassword || !confirmPassword}
        >
          {loading ? 'Сохранение...' : 'Сменить пароль'}
        </button>
      </div>

      <div className="analytics-settings-section">
        <h3 className="analytics-settings-section-title">Удаление данных</h3>
        <p className="analytics-settings-section-desc">
          <CiWarning /> Публичный ключ не имеет прав на удаление — это защита от чистки
          статистики через фронтенд. Удаляйте через Supabase → SQL Editor:
        </p>
        <div className="analytics-settings-action-card">
          <p className="analytics-settings-action-desc">
            <code>delete from public.analytics_events where occurred_at &lt; now() - interval &#39;90 days&#39;;</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSettings;
