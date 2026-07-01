import { apiRequest } from './client';
import { normalizeListResponse, normalizeRegistration } from './normalizers';

export async function getConfirmedRegistrations(eventId) {
  const data = await apiRequest(`/events/${eventId}/registrations`);
  return normalizeListResponse(data).map(normalizeRegistration).filter(Boolean);
}

export async function getWaitlist(eventId) {
  const data = await apiRequest(`/events/${eventId}/waitlist`);
  return normalizeListResponse(data).map(normalizeRegistration).filter(Boolean);
}
