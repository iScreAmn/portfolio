/**
 * Запросы админки. Всё идёт через Express по NEXT_PUBLIC_API_URL,
 * авторизация — по httpOnly-куке, которую ставит /api/auth/login.
 */
import { apiRequest, ApiError } from './apiClient';

/* ------------------------------------------------------------------- сессия */

export async function signIn(email, password) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  return data.user;
}

export const signOut = () => apiRequest('/api/auth/logout', { method: 'POST' });

/**
 * @returns вошедший пользователь (с примешанным isDev — режимом бэкенда,
 * не фронта) или null, если сессии нет.
 */
export async function getSession() {
  try {
    const data = await apiRequest('/api/auth/me');
    return data.user ? { ...data.user, isDev: data.isDev } : null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export const changePassword = (currentPassword, newPassword) =>
  apiRequest('/api/auth/change-password', {
    method: 'POST',
    body: { currentPassword, newPassword },
  });

/* ---------------------------------------------------------------- аналитика */

/** Сводка за период: тоталы, график по дням, топ страниц, источники, гео. */
export const getSummary = (from, to = new Date()) =>
  apiRequest('/api/analytics/summary', { query: { from, to } });

export const getDevices = (from, to = new Date(), limit = 10) =>
  apiRequest('/api/analytics/devices', { query: { from, to, limit } });

/** Список визитов за период. Одна строка = одна сессия. */
export const getSessionsList = (from, to = new Date(), limit = 100) =>
  apiRequest('/api/analytics/sessions', { query: { from, to, limit } });

/** Лента событий одной сессии — для раскрытия карточки визита. */
export const getSessionEvents = (sessionId, limit = 500) =>
  apiRequest(`/api/analytics/sessions/${encodeURIComponent(sessionId)}/events`, {
    query: { limit },
  });

/** Только для dev-бэкенда — сервер отвечает 403 в production. */
export const deleteAllAnalytics = () => apiRequest('/api/analytics', { method: 'DELETE' });
