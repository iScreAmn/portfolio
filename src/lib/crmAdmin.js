/**
 * Запросы мини-CRM. Как и аналитика, всё идёт через Express по
 * NEXT_PUBLIC_API_URL с httpOnly-кукой — см. lib/apiClient.js.
 *
 * Сущность «клиент» на бэкенде — это строка таблицы leads: заявка с формы,
 * заявка из калькулятора и клиент, заведённый руками, различаются полем
 * `source` ('form' | 'calculator' | 'manual').
 */
import { apiRequest } from './apiClient';

/** Порядок статусов совпадает с бэкендом (enum LeadStatus). */
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

/** Частичное обновление: передаём только то, что меняем. */
export const updateClient = (id, patch) =>
  apiRequest(`/api/leads/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch });

export const deleteClient = (id) =>
  apiRequest(`/api/leads/${encodeURIComponent(id)}`, { method: 'DELETE' });
