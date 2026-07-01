import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../api/eventsApi';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EventList } from '../../components/events/EventList';

export function OrganizerEventsPage() {
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
      <div className="page-heading with-action">
        <div>
          <p className="eyebrow">Organizer dashboard</p>
          <h1>My events</h1>
          <p>See every event you own, from first draft to live registration.</p>
        </div>
        <Link className="button button-primary" to="/organizer/events/new">
          Create event
        </Link>
      </div>

      {isLoading ? <LoadingSpinner label="Loading organizer events..." /> : null}
      {!isLoading && error ? <ErrorMessage error={error} title="Unable to load organizer events" /> : null}
      {!isLoading && !error && events.length === 0 ? (
        <EmptyState
          action={
            <Link className="button button-primary" to="/organizer/events/new">
              Create draft event
            </Link>
          }
          title="No events yet"
          message="Create your first event draft to start planning the next activity."
        />
      ) : null}
      {!isLoading && !error && events.length > 0 ? (
        <EventList events={events} getEventPath={(event) => `/organizer/events/${event.id}`} />
      ) : null}
    </section>
  );
}
