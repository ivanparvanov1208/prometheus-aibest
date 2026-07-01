import { EventCard } from './EventCard';

export function EventList({ events, getEventPath, getActions }) {
  return (
    <div className="event-list">
      {events.map((event) => (
        <EventCard
          actions={getActions ? getActions(event) : null}
          event={event}
          key={event.id}
          to={getEventPath(event)}
        />
      ))}
    </div>
  );
}

