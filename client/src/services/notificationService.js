import { apiFetch } from '../utils/api';

export const getNotifications = async () => {
  return apiFetch('/api/notifications');
};

export const markRead = async (id) => {
  return apiFetch(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  });
};

export const markAllRead = async () => {
  return apiFetch('/api/notifications/read-all', {
    method: 'PATCH',
  });
};

export const dismiss = async (id) => {
  return apiFetch(`/api/notifications/${id}`, {
    method: 'DELETE',
  });
};
