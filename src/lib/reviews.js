import { apiRequest } from './apiClient';

export const getPublishedReviews = () => apiRequest('/api/reviews');

export const submitReview = ({ name, company, text, photo, logo }) =>
  apiRequest('/api/reviews', {
    method: 'POST',
    body: { name, company, text, photo, logo },
  });
