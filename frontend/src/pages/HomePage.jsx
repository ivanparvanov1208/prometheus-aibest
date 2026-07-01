import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../api/eventsApi';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EventList } from '../components/events/EventList';
import { CallToActionSection } from '../components/public/CallToActionSection';
import { HeroSection } from '../components/public/HeroSection';
import { HowItWorksSection } from '../components/public/HowItWorksSection';
import { RoleBenefitsSection } from '../components/public/RoleBenefitsSection';
import { SectionHeading } from '../components/public/SectionHeading';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
  const { isAuthenticated, isLoading: isAuthLoading, role } = useAuth();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const featuredEvents = useMemo(() => events.slice(0, 6), [events]);
  const eventStats = useMemo(() => getEventStats(events), [events]);

  useEffect(() => {
    if (isAuthLoading) {
      return undefined;
    }

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
          setEvents([]);
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
  }, [isAuthLoading, isAuthenticated, role]);

  return (
    <div className="landing-page">
      <HeroSection
        eventStats={eventStats}
        featuredEvent={featuredEvents[0]}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading || isAuthLoading}
        loadError={error}
        role={role}
      />

      <section className="landing-section" id="events">
        <SectionHeading eyebrow="Upcoming events" title="The next thing happening starts here.">
          Browse workshops, clubs, lectures, competitions, and activities as soon as they go live on Attendly.
        </SectionHeading>

        {isLoading ? <LoadingSpinner label="Loading upcoming events..." /> : null}

        {!isLoading && error && error.status !== 401 ? (
          <ErrorMessage error={error} title="Unable to load upcoming events" />
        ) : null}

        {!isLoading && error?.status === 401 ? (
          <EmptyState
            title="Sign in for full event access"
            message="Create an account or sign in to explore the latest events and save your place."
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

        {!isLoading && !error && role === 'organizer' ? (
          <EmptyState
            title="Manage your organizer events"
            message="Jump into your dashboard to create, publish, and manage upcoming events."
            action={
              <Link className="button button-primary" to="/organizer/events">
                Open my events
              </Link>
            }
          />
        ) : null}

        {!isLoading && !error && role !== 'organizer' && featuredEvents.length === 0 ? (
          <EmptyState title="No published events yet" message="When events are published, they will appear here." />
        ) : null}

        {!isLoading && !error && featuredEvents.length > 0 ? (
          <EventList events={featuredEvents} getEventPath={(event) => `/events/${event.id}`} />
        ) : null}
      </section>

      <HowItWorksSection />
      <RoleBenefitsSection />
      <CallToActionSection isAuthenticated={isAuthenticated} role={role} />
    </div>
  );
}

function getEventStats(events) {
  const numericValues = (field) =>
    events.map((event) => event[field]).filter((value) => typeof value === 'number' && !Number.isNaN(value));

  const sum = (values) => values.reduce((total, value) => total + value, 0);
  const capacityValues = numericValues('capacity');
  const remainingValues = numericValues('remainingSpaces');
  const confirmedValues = numericValues('confirmedCount');
  const waitlistValues = numericValues('waitlistCount');
  const publishedCount = events.filter((event) => event.status === 'PUBLISHED').length;

  return {
    totalEvents: events.length,
    publishedEvents: publishedCount,
    totalCapacity: capacityValues.length ? sum(capacityValues) : null,
    remainingSpaces: remainingValues.length ? sum(remainingValues) : null,
    confirmedCount: confirmedValues.length ? sum(confirmedValues) : null,
    waitlistCount: waitlistValues.length ? sum(waitlistValues) : null,
  };
}
