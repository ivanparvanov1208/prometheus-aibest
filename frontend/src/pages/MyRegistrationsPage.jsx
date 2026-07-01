import { useEffect, useState } from 'react';
import { cancelRegistration, getMyRegistrations } from '../api/registrationsApi';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { Notice } from '../components/common/Notice';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDateTime } from '../utils/dates';
import { getNonFieldError } from '../utils/errors';

export function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [pendingCancel, setPendingCancel] = useState(null);

  async function loadRegistrations() {
    setIsLoading(true);
    setLoadError(null);

    try {
      setRegistrations(await getMyRegistrations());
    } catch (requestError) {
      setLoadError(requestError);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRegistrations();
  }, []);

  async function handleCancel() {
    if (!pendingCancel) {
      return;
    }

    setCancellingId(pendingCancel.id);
    setMutationError(null);
    setSuccessMessage('');

    try {
      await cancelRegistration(pendingCancel.id);
      setSuccessMessage('Registration cancelled.');
      setPendingCancel(null);
      await loadRegistrations();
    } catch (requestError) {
      setMutationError(requestError);
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Student dashboard</p>
        <h1>My registrations</h1>
        <p>Keep track of every confirmed spot and waitlist update in one place.</p>
      </div>

      {successMessage ? <Notice variant="success">{successMessage}</Notice> : null}
      {mutationError ? <Notice variant="error">{getNonFieldError(mutationError)}</Notice> : null}
      {isLoading ? <LoadingSpinner label="Loading registrations..." /> : null}
      {!isLoading && loadError ? <ErrorMessage error={loadError} title="Unable to load registrations" /> : null}
      {!isLoading && !loadError && registrations.length === 0 ? (
        <EmptyState title="No registrations" message="You have not registered for any events yet." />
      ) : null}
      {!isLoading && !loadError && registrations.length > 0 ? (
        <div className="responsive-list">
          {registrations.map((registration) => (
            <article className="registration-row" key={registration.id}>
              <div>
                <h2>{registration.event?.title || `Event ${registration.eventId || 'details unavailable'}`}</h2>
                <p>{registration.event?.startsAt ? formatDateTime(registration.event.startsAt) : 'Date to be confirmed'}</p>
              </div>
              <div className="registration-status">
                <StatusBadge status={registration.status} />
                {registration.waitlistPosition ? <span>Position {registration.waitlistPosition}</span> : null}
              </div>
              <Button
                disabled={registration.status === 'CANCELLED'}
                isLoading={cancellingId === registration.id}
                variant="danger"
                onClick={() => setPendingCancel(registration)}
              >
                {cancellingId === registration.id ? 'Cancelling...' : 'Cancel'}
              </Button>
            </article>
          ))}
        </div>
      ) : null}

      <Modal
        confirmLabel="Cancel registration"
        isLoading={Boolean(cancellingId)}
        isOpen={Boolean(pendingCancel)}
        message="This will release your spot for this event."
        title="Cancel registration?"
        onCancel={() => setPendingCancel(null)}
        onConfirm={handleCancel}
      />
    </section>
  );
}
