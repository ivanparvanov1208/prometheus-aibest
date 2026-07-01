import { apiRequest } from './client';
import { normalizeListResponse, normalizeRegistration } from './normalizers';

export async function registerForEvent(eventId) {
  const data = await apiRequest(`/events/${eventId}/registrations`, {
    method: 'POST',
  });
  return normalizeRegistration(data);
}

export async function getMyRegistrations() {
  const data = await apiRequest('/registrations/me');
  return normalizeListResponse(data).map(normalizeRegistration).filter(Boolean);
}

export async function cancelRegistration(registrationId) {
  return apiRequest(`/registrations/${registrationId}`, {
    method: 'DELETE',
  });
}
