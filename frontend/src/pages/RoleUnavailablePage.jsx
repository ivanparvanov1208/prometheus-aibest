import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Notice } from '../components/common/Notice';
import { useAuth } from '../hooks/useAuth';

export function RoleUnavailablePage() {
  const { logout, roleIssue } = useAuth();
  const location = useLocation();
  const issue = location.state?.roleIssue || roleIssue;

  return (
    <section className="message-page">
      <h1>We could not finish setting up your access</h1>
      <Notice variant="warning" title="Please try again">
        {issue || 'Your account details are incomplete right now. Please sign in again in a moment.'}
      </Notice>
      <p>Some parts of the app are not available until we can confirm the right access level for your account.</p>
      <div className="inline-actions">
        <Button variant="secondary" onClick={logout}>
          Sign out
        </Button>
        <Link className="button button-primary" to="/login">
          Try again
        </Link>
      </div>
    </section>
  );
}
