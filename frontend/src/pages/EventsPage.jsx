import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../api/eventsApi';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EventList } from '../components/events/EventList';
import { useAuth } from '../hooks/useAuth';

export function EventsPage() {
  const { isAuthenticated, role } = useAuth();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      setIsLoading(true);
      setError(null);

      try {
        const nextEvents = await getEvents();
        if (isMounted) {
          setEvents(nextEvents);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Attendly catalog</p>
        <h1>{role === 'organizer' ? 'Events available to your account' : 'Live events on Attendly'}</h1>
        <p>Browse what is coming up, check availability, and open each event for details.</p>
      </div>

      {isLoading ? <LoadingSpinner label="Loading events..." /> : null}

      {!isLoading && error?.status === 401 && !isAuthenticated ? (
        <EmptyState
          title="Sign in to view the event catalog"
          message="Sign in or create an account to browse every published event."
          action={
            <div className="inline-actions">
              <Link className="button button-primary" to="/register">
                Create account
              </Link>
              <Link className="button button-secondary" to="/login" state={{ from: { pathname: '/events' } }}>
                Sign in
              </Link>
            </div>
          }
        />
      ) : null}

      {!isLoading && error && !(error.status === 401 && !isAuthenticated) ? (
        <ErrorMessage error={error} title="Unable to load events" />
      ) : null}

      {!isLoading && !error ? (
        <div className={`catalog-layout ${!isAuthenticated ? 'catalog-layout-guest' : ''}`}>
          <div className="catalog-main">
            {events.length === 0 ? (
              <EmptyState title="No live events" message="There are no events available right now." />
            ) : (
              <EventList events={events} getEventPath={(event) => `/events/${event.id}`} />
            )}
          </div>

          {!isAuthenticated ? (
            <GuestInvitePanel />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function GuestInvitePanel() {
  return (
    <aside className="guest-invite-panel" aria-label="Attendly account invitation">
      <div className="guest-invite-card">
        <p className="guest-invite-kicker">Attendly</p>
        <h2>Want to sign up for your next event?</h2>
        <p>Create an Attendly account to save your spot and keep every booking together.</p>
        <div className="guest-invite-actions">
          <Link className="button button-primary guest-signup-button" to="/register">
            Sign up
          </Link>
          <Link className="guest-signin-link" to="/login" state={{ from: { pathname: '/events' } }}>
            Sign in
          </Link>
        </div>
      </div>
    </aside>
  );
}
