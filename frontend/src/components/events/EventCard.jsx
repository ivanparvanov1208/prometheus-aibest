import { Link } from 'react-router-dom';
import { formatDateTime } from '../../utils/dates';
import { StatusBadge } from '../common/StatusBadge';

export function EventCard({ event, to, actions }) {
  return (
    <article className="event-card">
      <div className="event-card-main">
        <div className="event-card-title-row">
          <h2>
            <Link to={to}>{event.title || 'Untitled event'}</Link>
          </h2>
          <StatusBadge status={event.status} />
        </div>
        <p className="event-card-description">{event.description || 'No description provided.'}</p>
        <dl className="compact-meta">
          <div>
            <dt>Starts</dt>
            <dd>{formatDateTime(event.startsAt)}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{event.location || 'Not provided'}</dd>
          </div>
          <div>
            <dt>Capacity</dt>
            <dd>{event.capacity || 'Not available'}</dd>
          </div>
          <div>
            <dt>Remaining</dt>
            <dd>{event.remainingSpaces ?? 'Not available'}</dd>
          </div>
        </dl>
      </div>
      {actions ? <div className="event-card-actions">{actions}</div> : null}
    </article>
  );
}
