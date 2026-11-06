import { apiRequest } from './apiClient';
import { getApiBase } from '../utils/apiBase';

export const getSiteContent = (key) => apiRequest(`/api/content/${encodeURIComponent(key)}`);

export const saveSiteContent = (key, data) =>
  apiRequest(`/api/content/${encodeURIComponent(key)}`, { method: 'PUT', body: data });

export const contentImageUrl = (path) => (path ? `${getApiBase()}${path}` : null);

export async function fetchSiteContent(key) {
  const base =
    getApiBase() || (process.env.API_PROXY_TARGET || 'http://127.0.0.1:5050').replace(/\/$/, '');

  try {
    const response = await fetch(`${base}/api/content/${encodeURIComponent(key)}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data ?? null;
  } catch {
    return null;
  }
}
