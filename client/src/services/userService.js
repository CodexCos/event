import { apiFetch } from '../utils/api';

export const getUsers = async () => {
  return apiFetch('/api/users');
};

export const getUserById = async (id) => {
  return apiFetch(`/api/users/${id}`);
};

export const updateUserStatus = async (id, status) => {
  return apiFetch(`/api/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const getOrganizerProfile = async (id) => {
  const user = await getUserById(id);
  if (!user || user.role !== 'organizer') return null;
  return user;
};
