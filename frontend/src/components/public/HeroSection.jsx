import { Link } from 'react-router-dom';
import { formatDateTime } from '../../utils/dates';

export function HeroSection({ eventStats, featuredEvent, isAuthenticated, isLoading, loadError, role }) {
  const secondaryAction = getSecondaryAction({ isAuthenticated, role });
  const isAuthBlocked = loadError?.status === 401 && !isAuthenticated;
  const hasLiveStats = !isLoading && !loadError;
  const eventCount = eventStats?.totalEvents ?? 0;
  const contextLabel = role === 'organizer' ? 'Your event lineup' : 'Upcoming Attendly picks';
  const catalogLink = isAuthBlocked
    ? { to: '/login', state: { from: { pathname: '/events' } } }
    : { to: '/events' };

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Attendly</p>
        <h1 className="hero-title">Discover. Join. Experience.</h1>
        <p className="hero-lede">
          Explore workshops, clubs, talks, and community events. Register in seconds and keep every plan in one place.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/events">
            Browse events
          </Link>
          <Link className="button button-secondary" to={secondaryAction.to} state={secondaryAction.state}>
            {secondaryAction.label}
          </Link>
        </div>
      </div>

      <div className="hero-visual hero-live-board" aria-label="Event highlights">
        <div className="hero-live-topline">
          <span className="live-dot" aria-hidden="true" />
          <span>{isAuthBlocked ? 'Members get the full picture' : 'Happening around campus'}</span>
        </div>

        <div className="hero-count-stage">
          <div>
            <span>{contextLabel}</span>
            <strong>{getMainCount({ eventStats, isAuthBlocked, isLoading })}</strong>
          </div>
          <p>{getMainCaption({ eventStats, isAuthBlocked, isLoading, role })}</p>
          <Link className="hero-board-link" to={catalogLink.to} state={catalogLink.state}>
            {isAuthBlocked ? 'Sign in for details' : eventCount > 0 ? 'See all events' : 'Browse event catalog'}
          </Link>
        </div>

        <div className="hero-feature-strip">
          <div className="hero-feature-date">
            <span>{featuredEvent ? getMonth(featuredEvent.startsAt) : 'Soon'}</span>
            <strong>{featuredEvent ? getDay(featuredEvent.startsAt) : '--'}</strong>
          </div>
          <div>
            <span>{featuredEvent ? 'Next on the calendar' : 'Featured event'}</span>
            <h2>{featuredEvent?.title || getNextEventFallback({ isAuthBlocked, isLoading, hasLiveStats })}</h2>
            <p>
              {featuredEvent
                ? `${formatDateTime(featuredEvent.startsAt)} | ${featuredEvent.location || 'Location to be announced'}`
                : getNextEventDetail({ isAuthBlocked, isLoading, hasLiveStats })}
            </p>
          </div>
        </div>

        <div className="hero-stat-grid">
          <StatCard label="Live events" value={formatStatValue(eventStats?.publishedEvents, isLoading, isAuthBlocked)} />
          <StatCard label="Total seats" value={formatStatValue(eventStats?.totalCapacity, isLoading, isAuthBlocked)} />
          <StatCard label="Spots left" value={formatStatValue(eventStats?.remainingSpaces, isLoading, isAuthBlocked)} />
          <StatCard label="Waitlist" value={formatStatValue(eventStats?.waitlistCount, isLoading, isAuthBlocked)} />
        </div>
      </div>
    </section>
  );
}

function getSecondaryAction({ isAuthenticated, role }) {
  if (!isAuthenticated) {
    return { to: '/register', label: 'Create account' };
  }

  if (role === 'organizer') {
    return { to: '/organizer/events', label: 'Manage events' };
  }

  return { to: '/my-registrations', label: 'My registrations' };
}

function StatCard({ label, value }) {
  return (
    <div className="hero-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getMainCount({ eventStats, isAuthBlocked, isLoading }) {
  if (isLoading) {
    return '...';
  }

  if (isAuthBlocked) {
    return '--';
  }

  return String(eventStats?.totalEvents ?? 0);
}

function getMainCaption({ eventStats, isAuthBlocked, isLoading, role }) {
  if (isLoading) {
    return 'Gathering the latest event snapshot.';
  }

  if (isAuthBlocked) {
    return 'Sign in to unlock the full event overview.';
  }

  if (role === 'organizer') {
    return `${eventStats?.totalEvents ?? 0} event${eventStats?.totalEvents === 1 ? '' : 's'} in your lineup`;
  }

  return `${eventStats?.totalEvents ?? 0} upcoming event${eventStats?.totalEvents === 1 ? '' : 's'} to explore`;
}

function formatStatValue(value, isLoading, isAuthBlocked) {
  if (isLoading) {
    return '...';
  }

  if (isAuthBlocked || value === null || value === undefined) {
    return '--';
  }

  return String(value);
}

function getNextEventFallback({ hasLiveStats, isAuthBlocked, isLoading }) {
  if (isLoading) {
    return 'Loading featured event';
  }

  if (isAuthBlocked) {
    return 'Sign in to see what is coming up next';
  }

  if (hasLiveStats) {
    return 'More events are on the way';
  }

  return 'Event details unavailable';
}

function getNextEventDetail({ hasLiveStats, isAuthBlocked, isLoading }) {
  if (isLoading) {
    return 'Checking upcoming activities.';
  }

  if (isAuthBlocked) {
    return 'Sign in to explore the full event lineup.';
  }

  if (hasLiveStats) {
    return 'New events will appear here as soon as they are published.';
  }

  return 'Please try again in a moment.';
}

function getMonth(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Soon';
  }

  return new Intl.DateTimeFormat(undefined, { month: 'short' }).format(date);
}

function getDay(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return new Intl.DateTimeFormat(undefined, { day: '2-digit' }).format(date);
}
