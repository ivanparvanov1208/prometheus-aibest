export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) {
    return fallback;
  }

  if (error.status === 401) {
    // If we're on the login page, 401 means bad credentials, not expired session
    if (window.location.pathname.includes('/login')) {
      return 'Invalid username or password.';
    }
    return 'Your session has expired. Please sign in again.';
  }

  if (error.status === 403) {
    return 'You do not have permission to access this resource.';
  }

  if (error.status === 404) {
    return 'We could not find what you were looking for.';
  }

  if (error.status === 409) {
    return 'This request conflicts with the current server state.';
  }

  if (error.status === 422) {
    return 'Please review the highlighted validation errors.';
  }

  if (error.status >= 500) {
    return 'The server had a temporary problem. Please try again later.';
  }

  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export function extractFieldErrors(error) {
  const data = error?.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {};
  }

  return Object.entries(data).reduce((fields, [key, value]) => {
    if (key === 'detail' || key === 'message' || key === 'error' || key === 'non_field_errors') {
      return fields;
    }

    fields[key] = stringifyErrorValue(value);
    return fields;
  }, {});
}

export function getNonFieldError(error) {
  const data = error?.data;
  if (!data) {
    return getErrorMessage(error);
  }

  if (typeof data === 'string') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(stringifyErrorValue).join(' ');
  }

  if (typeof data === 'object') {
    const mainError = data.error || data.detail || data.message || data.non_field_errors;
    return stringifyErrorValue(mainError) || getErrorMessage(error);
  }

  return getErrorMessage(error);
}

function stringifyErrorValue(value) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(stringifyErrorValue).filter(Boolean).join(' ');
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${key}: ${stringifyErrorValue(nestedValue)}`)
      .join(' ');
  }

  return String(value);
}
