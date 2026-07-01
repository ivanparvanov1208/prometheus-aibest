import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../api/eventsApi';
import { EventForm } from '../../components/events/EventForm';

export function EventCreatePage() {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(payload) {
    setIsSubmitting(true);
    setError(null);

    try {
      const event = await createEvent(payload);
      navigate(`/organizer/events/${event.id}`);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Organizer</p>
        <h1>Create draft event</h1>
        <p>New events should be created as drafts until explicitly published.</p>
      </div>

      <EventForm
        error={error}
        isSubmitting={isSubmitting}
        submitLabel="Create draft"
        submittingLabel="Creating event..."
        onSubmit={handleSubmit}
      />
    </section>
  );
}

