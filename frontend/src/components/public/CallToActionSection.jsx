import { Link } from 'react-router-dom';

export function CallToActionSection({ isAuthenticated, role }) {
  const dashboardPath = role === 'organizer' ? '/organizer/events' : '/my-registrations';

  return (
    <section className="landing-cta">
      <div>
        <p className="eyebrow">Start exploring</p>
        <h2>Ready to find your next Attendly moment?</h2>
      </div>
      <div className="cta-actions">
        <Link className="button button-primary" to="/events">
          Explore events
        </Link>
        {isAuthenticated ? (
          <Link className="button button-secondary" to={dashboardPath}>
            Go to dashboard
          </Link>
        ) : (
          <Link className="button button-secondary" to="/register">
            Create account
          </Link>
        )}
      </div>
    </section>
  );
}
