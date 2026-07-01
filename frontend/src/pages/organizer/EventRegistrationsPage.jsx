import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getConfirmedRegistrations, getWaitlist } from '../../api/organizerRegistrationsApi';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/dates';

export function EventRegistrationsPage() {
  const { eventId } = useParams();
  const [confirmed, setConfirmed] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [confirmedError, setConfirmedError] = useState(null);
  const [waitlistError, setWaitlistError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadLists() {
      setIsLoading(true);
      setConfirmedError(null);
      setWaitlistError(null);

      const [confirmedResult, waitlistResult] = await Promise.allSettled([
        getConfirmedRegistrations(eventId),
        getWaitlist(eventId),
      ]);

      if (!isMounted) {
        return;
      }

      if (confirmedResult.status === 'fulfilled') {
        setConfirmed(confirmedResult.value);
      } else {
        setConfirmedError(confirmedResult.reason);
      }

      if (waitlistResult.status === 'fulfilled') {
        setWaitlist(waitlistResult.value);
      } else {
        setWaitlistError(waitlistResult.reason);
      }

      setIsLoading(false);
    }

    loadLists();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  return (
    <section>
      <div className="page-heading with-action">
        <div>
          <p className="eyebrow">Organizer</p>
          <h1>Registrations and waitlist</h1>
          <p>Review confirmed attendees and keep an eye on the waitlist order.</p>
        </div>
        <Link className="button button-secondary" to={`/organizer/events/${eventId}`}>
          Back to event
        </Link>
      </div>

      {isLoading ? <LoadingSpinner label="Loading registration lists..." /> : null}

      {!isLoading ? (
        <div className="split-sections">
          <section>
            <h2>Confirmed registrations</h2>
            {confirmedError ? <ErrorMessage error={confirmedError} title="Unable to load confirmed registrations" /> : null}
            {!confirmedError && confirmed.length === 0 ? (
              <EmptyState title="No confirmed registrations" message="No students are confirmed for this event yet." />
            ) : null}
            {!confirmedError && confirmed.length > 0 ? <RegistrationList registrations={confirmed} /> : null}
          </section>

          <section>
            <h2>Waitlist</h2>
            {waitlistError ? <ErrorMessage error={waitlistError} title="Unable to load waitlist" /> : null}
            {!waitlistError && waitlist.length === 0 ? (
              <EmptyState title="No waitlist" message="No students are waitlisted for this event." />
            ) : null}
            {!waitlistError && waitlist.length > 0 ? <RegistrationList registrations={waitlist} showPosition /> : null}
          </section>
        </div>
      ) : null}
    </section>
  );
}

function RegistrationList({ registrations, showPosition = false }) {
  return (
    <div className="responsive-list">
      {registrations.map((registration) => (
        <article className="registration-row" key={registration.id}>
          <div>
            <h3>{registration.studentName || 'Student details unavailable'}</h3>
            <p>Registered {formatDateTime(registration.createdAt)}</p>
          </div>
          <div className="registration-status">
            <StatusBadge status={registration.status} />
            {showPosition ? <span>Position {registration.waitlistPosition ?? 'Pending'}</span> : null}
          </div>
        </article>
      ))}
    </div>
  );
}
