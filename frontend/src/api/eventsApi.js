import { apiRequest } from './client';
import { normalizeEvent, normalizeListResponse } from './normalizers';

export async function getEvents() {
  const data = await apiRequest('/events');
  return normalizeListResponse(data).map(normalizeEvent).filter(Boolean);
}

export async function getEventById(eventId) {
  const data = await apiRequest(`/events/${eventId}`);
  return normalizeEvent(data);
}

export async function createEvent(payload) {
  const data = await apiRequest('/events', {
    method: 'POST',
    body: payload,
  });
  return normalizeEvent(data);
}

export async function updateEvent(eventId, payload) {
  const data = await apiRequest(`/events/${eventId}`, {
    method: 'PUT',
    body: payload,
  });
  return normalizeEvent(data);
}

export async function publishEvent(eventId) {
  const data = await apiRequest(`/events/${eventId}/publish`, {
    method: 'POST',
  });
  return normalizeEvent(data);
}

export async function cancelEvent(eventId) {
  const data = await apiRequest(`/events/${eventId}/cancel`, {
    method: 'POST',
  });
  return normalizeEvent(data);
}
