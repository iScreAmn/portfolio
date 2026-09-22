import { getApiBase } from '../utils/apiBase';

/**
 * Тонкая обёртка над fetch для запросов к Express.
 *
 * Токенов в localStorage нет: сессию держат httpOnly-куки, поэтому каждому
 * запросу нужен credentials: 'include'. Когда access-кука протухает, запрос
 * получает 401 — тогда молча обновляем сессию и повторяем запрос один раз.
 */

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const buildUrl = (path, query) => {
  const url = `${getApiBase()}${path}`;
  if (!query) return url;

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, value instanceof Date ? value.toISOString() : String(value));
  });

  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
};

const parseBody = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

/**
 * Одно обновление сессии на всех: если 401 прилетел сразу в нескольких
 * параллельных запросах, refresh должен уйти один раз, иначе токен
 * ротируется несколько раз подряд и часть запросов останется ни с чем.
 */
let refreshPromise = null;

const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = fetch(buildUrl('/api/auth/refresh'), {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, query, allowRefresh = true } = options;

  const response = await fetch(buildUrl(path, query), {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && allowRefresh) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiRequest(path, { ...options, allowRefresh: false });
    }
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(payload?.message || `Request failed (${response.status})`, response.status);
  }

  // Эндпоинты отвечают { success, data }; наружу отдаём саму data.
  return payload?.data ?? payload;
}
