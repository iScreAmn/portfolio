import { apiRequest } from './apiClient';
import { getApiBase } from '../utils/apiBase';

/**
 * Редактируемые блоки сайта (см. /admin/content). Пока блок ни разу не
 * сохраняли, API отдаёт null — тогда в ход идут статичные тексты из src/data.
 */
export const getSiteContent = (key) => apiRequest(`/api/content/${encodeURIComponent(key)}`);

export const saveSiteContent = (key, data) =>
  apiRequest(`/api/content/${encodeURIComponent(key)}`, { method: 'PUT', body: data });

/** API отдаёт путь картинки от своего корня — браузеру нужен полный адрес. */
export const contentImageUrl = (path) => (path ? `${getApiBase()}${path}` : null);

/**
 * Для серверных компонентов: тот же запрос, но без кук и refresh, и с
 * таймаутом — лежащий API не должен вешать страницу, она просто покажет
 * тексты по умолчанию. Относительный адрес на сервере не сработает, поэтому
 * в dev идём прямо туда, куда проксирует rewrite из next.config.mjs.
 */
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
