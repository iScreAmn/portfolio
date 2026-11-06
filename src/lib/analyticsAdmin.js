import { apiRequest, ApiError } from './apiClient';

export async function signIn(email, password) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  return data.user;
}

export const signOut = () => apiRequest('/api/auth/logout', { method: 'POST' });

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

export const getSummary = (from, to = new Date()) =>
  apiRequest('/api/analytics/summary', { query: { from, to } });

export const getDevices = (from, to = new Date(), limit = 10) =>
  apiRequest('/api/analytics/devices', { query: { from, to, limit } });

export const getSessionsList = (from, to = new Date(), limit = 100) =>
  apiRequest('/api/analytics/sessions', { query: { from, to, limit } });

export const getSessionEvents = (sessionId, limit = 500) =>
  apiRequest(`/api/analytics/sessions/${encodeURIComponent(sessionId)}/events`, {
    query: { limit },
  });

export const deleteAllAnalytics = () => apiRequest('/api/analytics', { method: 'DELETE' });
