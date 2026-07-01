import { useMemo, useState } from 'react';
import { extractFieldErrors, getNonFieldError } from '../../utils/errors';
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '../../utils/dates';
import { Button } from '../common/Button';
import { Notice } from '../common/Notice';
import { EventDetails } from './EventDetails';

const EMPTY_FORM = {
  title: '',
  description: '',
  startsAt: '',
  endsAt: '',
  location: '',
  capacity: '1',
};

export function EventForm({
  initialEvent,
  submitLabel,
  submittingLabel,
  isSubmitting,
  error,
  onSubmit,
}) {
  const [values, setValues] = useState(() => ({
    title: initialEvent?.title ?? EMPTY_FORM.title,
    description: initialEvent?.description ?? EMPTY_FORM.description,
    startsAt: toDateTimeLocalValue(initialEvent?.startsAt),
    endsAt: toDateTimeLocalValue(initialEvent?.endsAt),
    location: initialEvent?.location ?? EMPTY_FORM.location,
    capacity: String(initialEvent?.capacity || EMPTY_FORM.capacity),
  }));
  const [clientErrors, setClientErrors] = useState({});

  const backendErrors = extractFieldErrors(error);
  const nonFieldError = error ? getNonFieldError(error) : '';

  const previewEvent = useMemo(
    () => ({
      id: initialEvent?.id ?? 'preview',
      title: values.title,
      description: values.description,
      startsAt: fromDateTimeLocalValue(values.startsAt),
      endsAt: fromDateTimeLocalValue(values.endsAt),
      location: values.location,
      capacity: Number(values.capacity),
      status: initialEvent?.status ?? 'DRAFT',
      confirmedCount: initialEvent?.confirmedCount ?? null,
      waitlistCount: initialEvent?.waitlistCount ?? null,
      remainingSpaces: initialEvent?.remainingSpaces ?? null,
    }),
    [initialEvent, values]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setClientErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateValues(values);
    setClientErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      starts_at: fromDateTimeLocalValue(values.startsAt),
      ends_at: fromDateTimeLocalValue(values.endsAt),
      location: values.location.trim(),
      capacity: Number(values.capacity),
    });
  }

  return (
    <div className="form-preview-layout">
      <form className="event-form" onSubmit={handleSubmit} noValidate>
        {nonFieldError ? <Notice variant="error">{nonFieldError}</Notice> : null}

        <FieldError error={clientErrors.title || backendErrors.title} inputId="title" />
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={values.title} onChange={handleChange} required />

        <FieldError error={clientErrors.description || backendErrors.description} inputId="description" />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="6"
          value={values.description}
          onChange={handleChange}
          required
        />

        <div className="form-grid">
          <div>
            <FieldError error={clientErrors.startsAt || backendErrors.starts_at} inputId="startsAt" />
            <label htmlFor="startsAt">Start date and time</label>
            <input
              id="startsAt"
              name="startsAt"
              type="datetime-local"
              value={values.startsAt}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <FieldError error={clientErrors.endsAt || backendErrors.ends_at} inputId="endsAt" />
            <label htmlFor="endsAt">End date and time</label>
            <input
              id="endsAt"
              name="endsAt"
              type="datetime-local"
              value={values.endsAt}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid">
          <div>
            <FieldError error={backendErrors.location} inputId="location" />
            <label htmlFor="location">Location or URL</label>
            <input id="location" name="location" value={values.location} onChange={handleChange} />
          </div>
          <div>
            <FieldError error={clientErrors.capacity || backendErrors.capacity} inputId="capacity" />
            <label htmlFor="capacity">Capacity</label>
            <input
              id="capacity"
              min="1"
              name="capacity"
              type="number"
              value={values.capacity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" isLoading={isSubmitting}>
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>

      <aside className="preview-panel" aria-label="Event preview">
        <EventDetails event={previewEvent} label="Preview" />
      </aside>
    </div>
  );
}

function validateValues(values) {
  const errors = {};
  const capacity = Number(values.capacity);

  if (!values.title.trim()) {
    errors.title = 'Title is required.';
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required.';
  }

  if (!values.startsAt) {
    errors.startsAt = 'Start date and time is required.';
  }

  if (!Number.isInteger(capacity) || capacity < 1) {
    errors.capacity = 'Capacity must be an integer of at least 1.';
  }

  if (values.startsAt && values.endsAt && new Date(values.endsAt) <= new Date(values.startsAt)) {
    errors.endsAt = 'End date and time must be after the start time.';
  }

  return errors;
}

function FieldError({ error, inputId }) {
  if (!error) {
    return null;
  }

  return (
    <p className="field-error" id={`${inputId}-error`}>
      {error}
    </p>
  );
}

