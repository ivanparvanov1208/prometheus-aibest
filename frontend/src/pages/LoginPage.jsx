import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/common/Button';
import { Notice } from '../components/common/Notice';
import { useAuth } from '../hooks/useAuth';
import { getNonFieldError } from '../utils/errors';

export function LoginPage() {
  const { isAuthenticated, login, role } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const intendedPath = location.state?.from?.pathname;

  useEffect(() => {
    if (!isAuthenticated || !role) {
      return;
    }

    navigate(getRedirectPath(role, intendedPath), { replace: true });
  }, [intendedPath, isAuthenticated, navigate, role]);

  if (isAuthenticated && !role) {
    return <Navigate replace to="/role-unavailable" state={{ from: location.state?.from }} />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const authenticatedUser = await login({
        username: credentials.username.trim(),
        password: credentials.password,
      });

      if (!authenticatedUser?.role) {
        navigate('/role-unavailable', { replace: true, state: { from: location.state?.from } });
        return;
      }

      navigate(getRedirectPath(authenticatedUser.role, intendedPath), { replace: true });
    } catch (requestError) {
      setError(requestError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Already have an account?"
      title="Sign in and keep your plans moving."
      description="Use your Attendly account to register, manage events, and return to the page you were trying to open."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-heading">
          <h2>Sign in</h2>
          <p>Enter your username and password to continue.</p>
        </div>

        {error ? <Notice variant="error">{getNonFieldError(error)}</Notice> : null}

        <label htmlFor="username">Username</label>
        <input
          autoComplete="username"
          id="username"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          autoComplete="current-password"
          id="password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="auth-switch">
        Need an account? <Link to="/register">Create one here</Link>. <Link to="/">Back to homepage</Link>.
      </p>
    </AuthLayout>
  );
}

function getRedirectPath(role, intendedPath) {
  if (intendedPath && intendedPath !== '/login' && intendedPath !== '/register') {
    return intendedPath;
  }

  return role === 'organizer' ? '/organizer/events' : '/events';
}
