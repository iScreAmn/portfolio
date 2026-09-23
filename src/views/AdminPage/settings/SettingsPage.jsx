"use client";

import { useState } from 'react';
import './Settings.css';
import { changePassword, deleteAllAnalytics } from '../../../lib/analyticsAdmin';
import { useAdminSession } from '../components/AdminSessionContext';
import adminData from '../../../data/adminData';

const { settings: text } = adminData;
const DangerIcon = text.dangerIcon;

const MIN_PASSWORD_LENGTH = 8;

/**
 * Отдельная страница, а не вкладка аналитики: сюда попадают из раздела
 * «Аккаунт» бургер-меню. Выход живёт там же, рядом с пунктом настроек.
 */
const SettingsPage = () => {
  const { user } = useAdminSession() ?? {};
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setMessage({
        type: 'error',
        text: text.passwordTooShort(MIN_PASSWORD_LENGTH),
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: text.passwordMismatch });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await changePassword(currentPassword, newPassword);
      setMessage({ type: 'success', text: text.passwordChanged });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || text.passwordChangeFailed });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = currentPassword && newPassword && confirmPassword && !loading;

  const [clearing, setClearing] = useState(false);

  const handleClearLocalAnalytics = async () => {
    if (!window.confirm(text.devClearConfirm)) {
      return;
    }
    setClearing(true);
    setMessage(null);
    try {
      const { deleted } = await deleteAllAnalytics();
      setMessage({ type: 'success', text: text.devClearSuccess(deleted) });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || text.devClearFailed });
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="admin-settings">
      <div className="admin-settings-header">
        <h2 className="admin-settings-title">{text.accountTitle}</h2>
      </div>

      {message && (
        <div className={`admin-settings-message admin-settings-message--${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-settings-info">
        <div className="admin-settings-info-card">
          <div className="admin-settings-info-label">{text.emailLabel}</div>
          <div className="admin-settings-info-value">{user?.email || '—'}</div>
        </div>
        <div className="admin-settings-info-card">
          <div className="admin-settings-info-label">{text.roleLabel}</div>
          <div className="admin-settings-info-value">
            {(user?.role && text.roleLabels[user.role]) || user?.role || '—'}
          </div>
        </div>
      </div>

      <div className="admin-settings-row">
        <div className="admin-settings-section">
          <h3 className="admin-settings-section-title">{text.passwordSectionTitle}</h3>
          <p className="admin-settings-section-desc">{text.passwordSectionDesc}</p>

          <div className="admin-settings-modal-input-group">
            <input
              type="password"
              className="admin-settings-modal-input"
              placeholder={text.currentPasswordPlaceholder}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="admin-settings-modal-input-group">
            <input
              type="password"
              className="admin-settings-modal-input"
              placeholder={text.newPasswordPlaceholder}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="admin-settings-modal-input-group">
            <input
              type="password"
              className="admin-settings-modal-input"
              placeholder={text.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleChangePassword()}
              autoComplete="new-password"
            />
          </div>
          <button
            type="button"
            onClick={handleChangePassword}
            className="admin-settings-btn admin-settings-btn--warning"
            disabled={!canSubmit}
          >
            {loading ? text.savingButton : text.saveButton}
          </button>
        </div>

        <div className="admin-settings-section">
          <h3 className="admin-settings-section-title">{text.dangerSectionTitle}</h3>
          <p className="admin-settings-section-desc">
            <DangerIcon /> {text.dangerIntro}
          </p>
          <details className="admin-settings-action-card admin-settings-details">
            <summary className="admin-settings-details-summary">
              {text.serverCommandSummary}
            </summary>
            <p className="admin-settings-action-desc">
              <code>{text.serverCommand}</code>
            </p>
          </details>

          {user?.isDev && (
            <div className="admin-settings-action-card">
              <p className="admin-settings-action-desc">{text.devClearTitle}</p>
              <button
                type="button"
                onClick={handleClearLocalAnalytics}
                className="admin-settings-btn admin-settings-btn--warning"
                disabled={clearing}
              >
                {clearing ? text.devClearingButton : text.devClearButton}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
