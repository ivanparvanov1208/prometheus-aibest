import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api/client';
import { getCurrentUser, login as loginRequest } from '../api/authApi';
import { normalizeRole, normalizeUser } from '../api/normalizers';
import {
  clearStoredTokens,
  clearStoredUser,
  getStoredTokens,
  getStoredUser,
  setStoredTokens,
  setStoredUser,
} from '../utils/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roleIssue, setRoleIssue] = useState(null);

  const applyTokens = useCallback(async (nextTokens, fallbackUser = null) => {
    setStoredTokens(nextTokens);
    setTokens(nextTokens);

    const userFromSession = normalizeUser(fallbackUser || getStoredUser() || decodeJwtPayload(nextTokens.access));
    let resolvedUser = userFromSession;

    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        resolvedUser = normalizeUser(currentUser);
      }
    } catch (error) {
      if (error.status === 401) {
        clearStoredTokens();
        clearStoredUser();
        setTokens(null);
        setUser(null);
        setRoleIssue(null);
        return null;
      }
    }

    if (!resolvedUser?.role) {
      const detectedRole = await detectRoleFromPermissions();
      if (detectedRole) {
        resolvedUser = {
          ...(resolvedUser || {}),
          role: detectedRole,
        };
      }
    }

    if (resolvedUser) {
      setStoredUser(resolvedUser);
      setUser(resolvedUser);
    } else {
      clearStoredUser();
      setUser(null);
    }

    setRoleIssue(resolvedUser?.role ? null : 'We could not confirm your account access yet.');
    return resolvedUser;
  }, []);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    const storedTokens = getStoredTokens();

    if (!storedTokens?.token && !storedTokens?.access) {
      setTokens(null);
      setUser(null);
      setRoleIssue(null);
      setIsLoading(false);
      return null;
    }

    const restoredUser = await applyTokens(storedTokens, getStoredUser());
    setIsLoading(false);
    return restoredUser;
  }, [applyTokens]);

  useEffect(() => {
    restoreSession();

    const handleExpiredAuth = () => {
      clearStoredTokens();
      setTokens(null);
      setUser(null);
      setRoleIssue(null);
    };

    window.addEventListener('auth:expired', handleExpiredAuth);
    return () => window.removeEventListener('auth:expired', handleExpiredAuth);
  }, [restoreSession]);

  const login = useCallback(
    async (credentials) => {
      const tokenResponse = await loginRequest(credentials);

      if (!tokenResponse?.token) {
        throw new Error('We could not complete sign-in. Please try again.');
      }

      return applyTokens(
        { token: tokenResponse.token },
        normalizeUser(tokenResponse.user) || { username: credentials.username.trim() }
      );
    },
    [applyTokens]
  );

  const logout = useCallback(() => {
    clearStoredTokens();
    clearStoredUser();
    setTokens(null);
    setUser(null);
    setRoleIssue(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: normalizeRole(user?.role),
      tokens,
      isAuthenticated: Boolean(tokens?.token || tokens?.access),
      isLoading,
      roleIssue,
      login,
      logout,
      restoreSession,
    }),
    [isLoading, login, logout, restoreSession, roleIssue, tokens, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Optional fallback to detect role if /auth/me doesn't provide it.
 * In the new restructured backend, /auth/me always returns the role.
 */
async function detectRoleFromPermissions() {
  try {
    await apiRequest('/registrations/me');
    return 'student';
  } catch (error) {
    // 403 Forbidden usually means the user is an organizer (can't access student registrations)
    if (error.status === 403) {
      try {
        await apiRequest('/notification-jobs');
        return 'organizer';
      } catch {
        return null;
      }
    }
    return null;
  }
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const [, payload] = token.split('.');
  if (!payload) {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(window.atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')));

    return {
      id: decoded.user_id ?? decoded.sub ?? null,
      username: decoded.username ?? '',
      email: decoded.email ?? '',
      role: decoded.role,
    };
  } catch {
    return null;
  }
}
