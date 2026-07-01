import { clearStoredTokens, getStoredTokens } from '../utils/storage';

const DEFAULT_API_URL = 'http://127.0.0.1:8000/api';
const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL || DEFAULT_API_URL);

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(path, options = {}) {
  return request(path, options);
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = true,
  } = options;

  const requestHeaders = { ...headers };
  const hasJsonBody = body !== undefined && body !== null && !(body instanceof FormData);

  if (hasJsonBody) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const storedTokens = getStoredTokens();
    if (storedTokens?.token) {
      requestHeaders.Authorization = `Token ${storedTokens.token}`;
    } else if (storedTokens?.access) {
      requestHeaders.Authorization = `Bearer ${storedTokens.access}`;
    }
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: requestHeaders,
    body: hasJsonBody ? JSON.stringify(body) : body,
  });

  if (response.status === 401 && auth) {
    clearStoredTokens();
    window.dispatchEvent(new CustomEvent('auth:expired'));
  }

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(resolveErrorMessage(data, response.status), response.status, data);
  }

  return data;
}

function buildUrl(path) {
  const normalizedPath = String(path || '').replace(/^\/+/, '');
  return `${API_BASE_URL}/${normalizedPath}`;
}

function normalizeBaseUrl(url) {
  return String(url || DEFAULT_API_URL).replace(/\/+$/, '');
}

async function parseResponseBody(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!text) {
    return null;
  }

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function resolveErrorMessage(data, status) {
  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (data?.detail) {
    return normalizeMessage(data.detail);
  }

  if (data?.message) {
    return normalizeMessage(data.message);
  }

  if (status === 400 || status === 422) {
    return 'Please review the validation errors.';
  }

  if (status === 401) {
    return 'Please sign in to continue.';
  }

  if (status === 403) {
    return 'You do not have permission to access this resource.';
  }

  if (status === 404) {
    return 'We could not find what you were looking for.';
  }

  return `Request failed with status ${status}.`;
}

function normalizeMessage(value) {
  if (Array.isArray(value)) {
    return value.join(' ');
  }

  if (typeof value === 'object') {
    return Object.values(value).flat().join(' ');
  }

  return String(value);
}
