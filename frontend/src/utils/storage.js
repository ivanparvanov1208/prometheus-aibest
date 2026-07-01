const TOKEN_STORAGE_KEY = 'attendly_auth_tokens';
const USER_STORAGE_KEY = 'attendly_auth_user';

export function getStoredTokens() {
  try {
    const rawValue = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

export function setStoredTokens(tokens) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

export function clearStoredTokens() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getStoredUser() {
  try {
    const rawValue = window.localStorage.getItem(USER_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  window.localStorage.removeItem(USER_STORAGE_KEY);
}
