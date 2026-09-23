import { apiFetch } from '../utils/api';

export const getRegistrationsByUser = async (userId) => {
  return apiFetch(`/api/registrations/user/${userId}`);
};

export const getRegistrationsByEvent = async (eventId) => {
  const attendees = await apiFetch(`/api/registrations/event/${eventId}/attendees`);
  // Attendees are already enriched with user data on the backend
  return attendees.map(att => ({
    id: att.id,
    userId: att.userId,
    eventId,
    status: att.status,
    registeredAt: att.registeredAt,
    user: {
      name: att.name,
      email: att.email,
      avatar: att.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${att.id}`
    }
  }));
};

export const isRegistered = async (userId, eventId) => {
  try {
    const data = await apiFetch(`/api/registrations/check/${userId}/${eventId}`);
    return data.registered;
  } catch {
    return false;
  }
};

export const registerForEvent = async (userId, eventId) => {
  return apiFetch('/api/registrations', {
    method: 'POST',
    body: JSON.stringify({ event_id: eventId }),
  });
};

export const cancelRegistration = async (userId, eventId) => {
  await apiFetch(`/api/registrations/${userId}/${eventId}/cancel`, {
    method: 'PATCH',
  });
  return true;
};

export const markAttended = async (registrationId) => {
  // Mock fallback or status patch if required
  return true;
};

export const removeAttendee = async (registrationId) => {
  // Mock fallback or delete route if required
  return true;
};
