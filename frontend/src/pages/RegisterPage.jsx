import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../api/authApi';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/common/Button';
import { Notice } from '../components/common/Notice';
import { extractFieldErrors, getNonFieldError } from '../utils/errors';

export function RegisterPage() {
  const [values, setValues] = useState({
    username: '',
    email: '',
    role: 'student',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [clientErrors, setClientErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldErrors = extractFieldErrors(error);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setError(null);
    setClientErrors((current) => ({ ...current, [name]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = {};

    if (!values.username.trim()) {
      validationErrors.username = 'Username is required.';
    }

    if (!values.password) {
      validationErrors.password = 'Password is required.';
    }

    if (!values.role || !['student', 'organizer'].includes(values.role)) {
      validationErrors.role = 'Please choose how you want to use Attendly.';
    }

    if (values.password !== values.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords must match.';
    }

    setClientErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');

    try {
      await register({
        username: values.username.trim(),
        email: values.email.trim(),
        role: values.role,
        password: values.password,
      });
      setSuccessMessage('Account created. You can now sign in.');
      setValues({ username: '', email: '', role: 'student', password: '', confirmPassword: '' });
    } catch (requestError) {
      setError(requestError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Create your account"
      title="Create your Attendly account."
      description="Create an Attendly account to register faster, track your spots, and follow waitlist updates."
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form-heading">
          <h2>Create account</h2>
          <p>Fill in the details below to get started.</p>
        </div>

        {successMessage ? <Notice variant="success">{successMessage}</Notice> : null}
        {error ? <Notice variant="error">{getNonFieldError(error)}</Notice> : null}

        <FieldError error={clientErrors.username || fieldErrors.username} />
        <label htmlFor="register-username">Username</label>
        <input
          autoComplete="username"
          id="register-username"
          name="username"
          value={values.username}
          onChange={handleChange}
          required
        />

        <FieldError error={fieldErrors.email} />
        <label htmlFor="register-email">Email</label>
        <input
          autoComplete="email"
          id="register-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
        />

        <FieldError error={clientErrors.role || fieldErrors.role} />
        <label htmlFor="register-role">Account type</label>
        <select
          id="register-role"
          name="role"
          value={values.role}
          onChange={handleChange}
          required
        >
          <option value="student">Student</option>
          <option value="organizer">Organizer</option>
        </select>

        <FieldError error={clientErrors.password || fieldErrors.password} />
        <label htmlFor="register-password">Password</label>
        <input
          autoComplete="new-password"
          id="register-password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          required
        />

        <FieldError error={clientErrors.confirmPassword} />
        <label htmlFor="confirm-password">Confirm password</label>
        <input
          autoComplete="new-password"
          id="confirm-password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>. <Link to="/">Back to homepage</Link>.
      </p>
    </AuthLayout>
  );
}

function FieldError({ error }) {
  return error ? <p className="field-error">{error}</p> : null;
}
