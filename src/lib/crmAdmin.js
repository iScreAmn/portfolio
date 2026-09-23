import { apiRequest } from './apiClient';

export const CLIENT_STATUSES = ['new', 'in_progress', 'promotion', 'done'];

/**
 * @returns {{ items: Array, total: number, counts: Record<string, number> }}
 * `counts` считается по всей таблице, а не по выборке — на нём держатся
 * счётчики рядом с фильтром статусов.
 */
export const getClients = ({ status, source, limit } = {}) =>
  apiRequest('/api/leads', { query: { status, source, limit } });

export const createClient = ({ name, company, contactMethod, contactValue, message, note }) =>
  apiRequest('/api/leads', {
    method: 'POST',
    body: { name, company, contactMethod, contactValue, message, note },
  });

export const updateClient = (id, patch) =>
  apiRequest(`/api/leads/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch });

export const reorderClients = (ids) =>
  apiRequest('/api/leads/reorder', { method: 'PATCH', body: { ids } });

export const deleteClient = (id) =>
  apiRequest(`/api/leads/${encodeURIComponent(id)}`, { method: 'DELETE' });
