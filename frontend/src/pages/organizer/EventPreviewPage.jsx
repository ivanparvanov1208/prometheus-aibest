import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getEventById } from '../../api/eventsApi';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EventDetails } from '../../components/events/EventDetails';

export function EventPreviewPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadEvent() {
      setIsLoading(true);
      setError(null);

      try {
        const nextEvent = await getEventById(eventId);
        if (isMounted) {
          setEvent(nextEvent);
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

    loadEvent();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  return (
    <section>
      <div className="page-heading with-action">
        <div>
          <p className="eyebrow">Student-facing preview</p>
          <h1>Event preview</h1>
          <p>This view uses the same event presentation component as the student details page.</p>
        </div>
        <Link className="button button-secondary" to={`/organizer/events/${eventId}`}>
          Back to event
        </Link>
      </div>

      {isLoading ? <LoadingSpinner label="Loading preview..." /> : null}
      {!isLoading && error ? <ErrorMessage error={error} title="Unable to load preview" /> : null}
      {!isLoading && event ? <EventDetails event={event} label="Preview" /> : null}
    </section>
  );
}

