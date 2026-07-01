import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cancelEvent, getEventById, publishEvent } from '../../api/eventsApi';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Notice } from '../../components/common/Notice';
import { EventDetails } from '../../components/events/EventDetails';
import { getNonFieldError } from '../../utils/errors';

export function OrganizerEventDetailsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  async function loadEvent() {
    setIsLoading(true);
    setLoadError(null);

    try {
      setEvent(await getEventById(eventId));
    } catch (requestError) {
      setLoadError(requestError);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function handlePublish() {
    setIsPublishing(true);
    setMutationError(null);
    setSuccessMessage('');

    try {
      const publishedEvent = await publishEvent(eventId);
      setEvent(publishedEvent);
      setSuccessMessage('Event published.');
    } catch (requestError) {
      setMutationError(requestError);
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleCancel() {
    setIsCancelling(true);
    setMutationError(null);
    setSuccessMessage('');

    try {
      const cancelledEvent = await cancelEvent(eventId);
      setEvent(cancelledEvent);
      setSuccessMessage('Event cancelled.');
      setShowCancelModal(false);
    } catch (requestError) {
      setMutationError(requestError);
    } finally {
      setIsCancelling(false);
    }
  }

  const isDraft = event?.status === 'DRAFT';
  const isCancelled = event?.status === 'CANCELLED' || event?.status === 'CANCELED';

  return (
    <section>
      {successMessage ? <Notice variant="success">{successMessage}</Notice> : null}
      {mutationError ? <Notice variant="error">{getNonFieldError(mutationError)}</Notice> : null}
      {isLoading ? <LoadingSpinner label="Loading event..." /> : null}
      {!isLoading && loadError ? <ErrorMessage error={loadError} title="Unable to load event" /> : null}

      {!isLoading && event ? (
        <>
          <EventDetails event={event} />

          <div className="page-actions">
            <Link className="button button-secondary" to={`/organizer/events/${event.id}/edit`}>
              Edit
            </Link>
            <Link className="button button-secondary" to={`/organizer/events/${event.id}/preview`}>
              Preview
            </Link>
            <Link className="button button-secondary" to={`/organizer/events/${event.id}/registrations`}>
              Registrations
            </Link>
            <Button disabled={!isDraft || isCancelled} isLoading={isPublishing} onClick={handlePublish}>
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
            <Button disabled={isCancelled} isLoading={isCancelling} variant="danger" onClick={() => setShowCancelModal(true)}>
              {isCancelling ? 'Cancelling...' : 'Cancel event'}
            </Button>
          </div>
        </>
      ) : null}

      <Modal
        confirmLabel="Cancel event"
        isLoading={isCancelling}
        isOpen={showCancelModal}
        message="This will cancel the event and may notify students who already registered."
        title="Cancel this event?"
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
      />
    </section>
  );
}
