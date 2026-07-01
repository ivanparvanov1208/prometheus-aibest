import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getEventById } from '../api/eventsApi';
import { getMyRegistrations, registerForEvent } from '../api/registrationsApi';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Notice } from '../components/common/Notice';
import { StatusBadge } from '../components/common/StatusBadge';
import { EventDetails } from '../components/events/EventDetails';
import { useAuth } from '../hooks/useAuth';
import { getNonFieldError } from '../utils/errors';

export function EventDetailsPage() {
  const { eventId } = useParams();
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [registrationListError, setRegistrationListError] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const [successRegistration, setSuccessRegistration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const activeRegistration = useMemo(
    () =>
      registrations.find(
        (registration) =>
          String(registration.eventId) === String(eventId) &&
          registration.status !== 'CANCELLED' &&
          registration.status !== 'CANCELED'
      ),
    [eventId, registrations]
  );

  async function loadPageData() {
    setIsLoading(true);
    setLoadError(null);
    setRegistrationListError(null);

    try {
      const nextEvent = await getEventById(eventId);
      setEvent(nextEvent);
    } catch (requestError) {
      setLoadError(requestError);
    }

    if (isAuthenticated && role === 'student') {
      try {
        const nextRegistrations = await getMyRegistrations();
        setRegistrations(nextRegistrations);
      } catch (requestError) {
        setRegistrationListError(requestError);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setRegistrations([]);
    setIsLoading(false);
  }

  useEffect(() => {
    loadPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, isAuthenticated, role]);

  async function handleRegister() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (role !== 'student') {
      setMutationError(new Error('Only student accounts can register for events.'));
      return;
    }

    setIsRegistering(true);
    setMutationError(null);
    setSuccessRegistration(null);

    try {
      const registration = await registerForEvent(eventId);
      setSuccessRegistration(registration);
      await loadPageData();
    } catch (requestError) {
      setMutationError(requestError);
    } finally {
      setIsRegistering(false);
    }
  }

  const isPublished = event?.status === 'PUBLISHED';
  const canRegister =
    isPublished && !activeRegistration && !successRegistration && (!isAuthenticated || role === 'student');
  const registrationLabel = getRegistrationLabel({
    isAuthenticated,
    isRegistering,
    role,
    activeRegistration,
    successRegistration,
  });

  return (
    <section>
      {isLoading ? <LoadingSpinner label="Loading event..." /> : null}
      {!isLoading && loadError?.status === 401 && !isAuthenticated ? (
        <EmptyState
          title="Sign in to view this event"
          message="Create an account or sign in to see event details and register."
          action={
            <div className="inline-actions">
              <Link className="button button-primary" to="/register">
                Create account
              </Link>
              <Link className="button button-secondary" to="/login" state={{ from: location }}>
                Sign in
              </Link>
            </div>
          }
        />
      ) : null}
      {!isLoading && loadError && !(loadError.status === 401 && !isAuthenticated) ? (
        <ErrorMessage error={loadError} title="Unable to load event" />
      ) : null}

      {!isLoading && event ? (
        <>
          <EventDetails event={event} />

          {registrationListError ? (
            <Notice variant="warning" title="Registration status unavailable">
              We could not refresh your saved registrations just now. You can still continue and we will confirm the
              result right away.
            </Notice>
          ) : null}

          {activeRegistration ? (
            <Notice variant="success" title="Already registered">
              Your registration status is <StatusBadge status={activeRegistration.status} />{' '}
              {activeRegistration.waitlistPosition ? `Position ${activeRegistration.waitlistPosition}.` : ''}
            </Notice>
          ) : null}

          {successRegistration ? (
            <Notice variant="success" title="Registration submitted">
              {successRegistration.waitlistPosition ? (
                <>
                  You are <StatusBadge status={successRegistration.status} /> at position{' '}
                  {successRegistration.waitlistPosition}.
                </>
              ) : (
                <>
                  You are <StatusBadge status={successRegistration.status} /> for this event.
                </>
              )}
            </Notice>
          ) : null}

          {mutationError ? <Notice variant="error">{getNonFieldError(mutationError)}</Notice> : null}

          <div className="page-actions">
            <Button disabled={!canRegister} isLoading={isRegistering} onClick={handleRegister}>
              {registrationLabel}
            </Button>
            {event.status !== 'PUBLISHED' ? (
              <span className="help-text">Registration is available only for published events.</span>
            ) : null}
            {role === 'organizer' ? (
              <span className="help-text">Organizer accounts manage attendees from the organizer dashboard.</span>
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
}

function getRegistrationLabel({ isAuthenticated, isRegistering, role, activeRegistration, successRegistration }) {
  if (isRegistering) {
    return 'Registering...';
  }

  if (!isAuthenticated) {
    return 'Sign in to register';
  }

  if (role !== 'student') {
    return 'Student registration only';
  }

  if (activeRegistration || successRegistration) {
    return 'Registered';
  }

  return 'Register';
}
