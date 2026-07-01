import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEventById, updateEvent } from '../../api/eventsApi';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Notice } from '../../components/common/Notice';
import { EventForm } from '../../components/events/EventForm';

export function EventEditPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadEvent() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const nextEvent = await getEventById(eventId);
        if (isMounted) {
          setEvent(nextEvent);
        }
      } catch (requestError) {
        if (isMounted) {
          setLoadError(requestError);
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

  async function handleSubmit(payload) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const updatedEvent = await updateEvent(eventId, payload);
      navigate(`/organizer/events/${updatedEvent.id || eventId}`);
    } catch (requestError) {
      setSubmitError(requestError);
    } finally {
      setIsSubmitting(false);
    }
  }

  const editingDisabled = event?.status === 'CANCELLED' || event?.status === 'CANCELED';

  return (
    <section>
      <div className="page-heading with-action">
        <div>
          <p className="eyebrow">Organizer</p>
          <h1>Edit event</h1>
          <p>Update the event details before students start showing up.</p>
        </div>
        <Link className="button button-secondary" to={`/organizer/events/${eventId}/preview`}>
          Preview
        </Link>
      </div>

      {isLoading ? <LoadingSpinner label="Loading event..." /> : null}
      {!isLoading && loadError ? <ErrorMessage error={loadError} title="Unable to load event" /> : null}
      {!isLoading && !loadError && !event ? <EmptyState title="Event not found" /> : null}
      {!isLoading && event && editingDisabled ? (
        <Notice variant="warning">Cancelled events cannot be edited from this interface.</Notice>
      ) : null}
      {!isLoading && event && !editingDisabled ? (
        <EventForm
          error={submitError}
          initialEvent={event}
          isSubmitting={isSubmitting}
          submitLabel="Save changes"
          submittingLabel="Saving event..."
          onSubmit={handleSubmit}
        />
      ) : null}
    </section>
  );
}
