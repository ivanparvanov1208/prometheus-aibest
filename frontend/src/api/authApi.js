import { apiRequest } from './client';
import { normalizeUser } from './normalizers';

export async function register(payload) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  });

  return normalizeUser(data) || data;
}

export async function login(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

export async function refreshToken() {
  return Promise.reject(new Error('Automatic session refresh is not available right now.'));
}

export async function getCurrentUser() {
  const data = await apiRequest('/auth/me');
  return normalizeUser(data);
}
