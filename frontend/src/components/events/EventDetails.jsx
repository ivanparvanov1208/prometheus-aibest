import { formatDateTime } from '../../utils/dates';
import { StatusBadge } from '../common/StatusBadge';

export function EventDetails({ event, label }) {
  if (!event) {
    return null;
  }

  const isFull = event.remainingSpaces === 0;

  return (
    <article className="event-details">
      <div className="event-details-header">
        <div>
          {label ? <p className="eyebrow">{label}</p> : null}
          <h1>{event.title || 'Untitled event'}</h1>
        </div>
        <StatusBadge status={event.status} />
      </div>

      <dl className="event-meta-grid">
        <div>
          <dt>Starts</dt>
          <dd>{formatDateTime(event.startsAt)}</dd>
        </div>
        <div>
          <dt>Ends</dt>
          <dd>{formatDateTime(event.endsAt)}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd className="wrap-text">{event.location || 'Not provided'}</dd>
        </div>
        <div>
          <dt>Capacity</dt>
          <dd>{event.capacity || 'Not available'}</dd>
        </div>
        <div>
          <dt>Confirmed</dt>
          <dd>{event.confirmedCount ?? 'Not available'}</dd>
        </div>
        <div>
          <dt>Remaining</dt>
          <dd>{event.remainingSpaces ?? 'Not available'}</dd>
        </div>
        <div>
          <dt>Waitlist</dt>
          <dd>{event.waitlistCount ?? 'Not available'}</dd>
        </div>
        <div>
          <dt>Full</dt>
          <dd>{event.remainingSpaces === null ? 'Unknown' : isFull ? 'Yes' : 'No'}</dd>
        </div>
      </dl>

      <section className="description-block">
        <h2>Description</h2>
        <p>{event.description || 'No description provided.'}</p>
      </section>
    </article>
  );
}
