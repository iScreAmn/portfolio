"use client";

import { useState } from 'react';
import './AnalyticsSettings.css';
import { CiWarning } from "react-icons/ci";
import { changePassword } from '../../../lib/analyticsAdmin';

const MIN_PASSWORD_LENGTH = 8;

const AnalyticsSettings = ({ user, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setMessage({
        type: 'error',
        text: `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Пароли не совпадают' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await changePassword(currentPassword, newPassword);
      setMessage({ type: 'success', text: 'Пароль изменён' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Не удалось сменить пароль' });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = currentPassword && newPassword && confirmPassword && !loading;

  return (
    <div className="analytics-settings">
      <div className="analytics-settings-header">
        <h2 className="analytics-settings-title">Аккаунт</h2>
        <div className="analytics-settings-header__actions">
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
          <div className="analytics-settings-info-value">{user?.email || '—'}</div>
        </div>
        <div className="analytics-settings-info-card">
          <div className="analytics-settings-info-label">Роль:</div>
          <div className="analytics-settings-info-value">{user?.role || '—'}</div>
        </div>
      </div>

      <div className="analytics-settings-section">
        <h3 className="analytics-settings-section-title">Смена пароля</h3>
        <p className="analytics-settings-section-desc">
          После смены пароля все остальные сессии завершаются.
        </p>

        <div className="analytics-settings-modal-input-group">
          <input
            type="password"
            className="analytics-settings-modal-input"
            placeholder="Текущий пароль"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
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
            placeholder="Повторите новый пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleChangePassword()}
            autoComplete="new-password"
          />
        </div>
        <button
          type="button"
          onClick={handleChangePassword}
          className="analytics-settings-btn analytics-settings-btn--warning"
          disabled={!canSubmit}
        >
          {loading ? 'Сохранение...' : 'Сменить пароль'}
        </button>
      </div>

      <div className="analytics-settings-section">
        <h3 className="analytics-settings-section-title">Удаление данных</h3>
        <p className="analytics-settings-section-desc">
          <CiWarning /> Через админку статистика не удаляется — это защита от
          случайной чистки. Старые события убираются на сервере:
        </p>
        <div className="analytics-settings-action-card">
          <p className="analytics-settings-action-desc">
            <code>
              docker compose exec db psql -U portfolio -d portfolio -c &quot;delete from
              analytics_events where occurred_at &lt; now() - interval &#39;90 days&#39;;&quot;
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSettings;
