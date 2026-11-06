import { getApiBase } from '../utils/apiBase';

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

  return payload && 'data' in payload ? payload.data : payload;
}
