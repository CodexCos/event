import { apiFetch } from '../utils/api';

export const getEvents = async (filters = {}, currentUserId = null) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.sortBy) params.append('sort', filters.sortBy);

  let result = await apiFetch(`/api/events?${params.toString()}`);

  if (filters.date) {
    result = result.filter(e => e.date >= filters.date);
  }

  return result;
};

export const getEventById = async (id) => {
  return apiFetch(`/api/events/${id}`);
};

export const getFeaturedEvents = async () => {
  const events = await getEvents();
  return events.filter(e => e.featured);
};

export const getTrendingEvents = async () => {
  const events = await getEvents();
  return events.filter(e => e.trending);
};

export const getEventsByOrganizer = async (organizerId) => {
  return apiFetch(`/api/events/organizer/${organizerId}`);
};

// Recommendation logic mapped locally to stay robust without adding complex DB queries
export const getRecommendedEvents = async (userId, userInterests = []) => {
  const events = await getEvents();
  const scored = events.map(event => {
    let score = 0;
    if (userInterests.includes(event.category)) score += 40;
    score += Math.min(30, (event.registeredCount / event.capacity) * 30);
    if (event.trending) score += 20;
    if (event.featured) score += 10;
    return { ...event, score };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, 8);
};

export const createEvent = async (eventData) => {
  return apiFetch('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
};

export const updateEvent = async (id, updates) => {
  return apiFetch(`/api/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const deleteEvent = async (id) => {
  await apiFetch(`/api/events/${id}`, {
    method: 'DELETE',
  });
  return true;
};
