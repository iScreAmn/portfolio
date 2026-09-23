import { apiRequest } from './apiClient';

/**
 * @returns {{ items: Array, counts: { pending: number, approved: number } }}
 * `counts` считается по всей таблице, на нём держатся счётчики вкладок
 */
export const getReviews = ({ status } = {}) =>
  apiRequest('/api/reviews/admin', { query: { status } });

export const updateReview = (id, patch) =>
  apiRequest(`/api/reviews/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch });

export const approveReview = (id) =>
  apiRequest(`/api/reviews/${encodeURIComponent(id)}/approve`, { method: 'POST' });

export const deleteReview = (id) =>
  apiRequest(`/api/reviews/${encodeURIComponent(id)}`, { method: 'DELETE' });
