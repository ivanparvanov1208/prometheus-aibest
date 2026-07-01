export function normalizeRole(role) {
  return typeof role === 'string' ? role.toLowerCase() : null;
}

export function normalizeStatus(status) {
  return typeof status === 'string' ? status.toUpperCase() : 'UNKNOWN';
}

export function normalizeListResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.events)) {
    return data.events;
  }

  if (Array.isArray(data?.registrations)) {
    return data.registrations;
  }

  if (Array.isArray(data?.waitlist)) {
    return data.waitlist;
  }

  return [];
}

export function normalizeUser(rawUser) {
  if (!rawUser || typeof rawUser !== 'object') {
    return null;
  }

  return {
    id: rawUser.id ?? rawUser.user_id ?? rawUser.sub ?? null,
    username: rawUser.username ?? rawUser.user?.username ?? '',
    email: rawUser.email ?? rawUser.user?.email ?? '',
    role: normalizeRole(rawUser.role ?? rawUser.profile?.role ?? rawUser.user?.role),
  };
}

export function normalizeEvent(rawEvent) {
  if (!rawEvent || typeof rawEvent !== 'object') {
    return null;
  }

  const capacity = Number(rawEvent.capacity ?? 0);
  const confirmedCount =
    rawEvent.confirmed_count ??
    rawEvent.confirmed_registrations_count ??
    rawEvent.registration_count ??
    rawEvent.registrations_count ??
    null;
  const waitlistCount = rawEvent.waitlist_count ?? rawEvent.waitlist_size ?? null;

  return {
    id: rawEvent.id,
    title: rawEvent.title ?? '',
    description: rawEvent.description ?? '',
    startsAt: rawEvent.starts_at ?? rawEvent.start_time ?? null,
    endsAt: rawEvent.ends_at ?? rawEvent.end_time ?? null,
    capacity,
    status: normalizeStatus(rawEvent.status),
    location: rawEvent.location ?? rawEvent.url ?? rawEvent.link ?? '',
    confirmedCount,
    waitlistCount,
    remainingSpaces:
      confirmedCount === null || Number.isNaN(capacity)
        ? null
        : Math.max(capacity - Number(confirmedCount), 0),
    organizerId: rawEvent.organizer_id ?? rawEvent.organizer?.id ?? null,
    organizerName: rawEvent.organizer_username ?? rawEvent.organizer?.username ?? '',
    raw: rawEvent,
  };
}

export function normalizeRegistration(rawRegistration) {
  if (!rawRegistration || typeof rawRegistration !== 'object') {
    return null;
  }

  const event = normalizeEvent(rawRegistration.event);

  return {
    id: rawRegistration.id ?? rawRegistration.registration_id,
    status: normalizeStatus(rawRegistration.status),
    createdAt: rawRegistration.created_at ?? rawRegistration.registered_at ?? null,
    updatedAt: rawRegistration.updated_at ?? null,
    waitlistPosition: rawRegistration.waitlist_position ?? rawRegistration.position ?? null,
    eventId: rawRegistration.event_id ?? event?.id ?? rawRegistration.event,
    event,
    studentName:
      rawRegistration.student_username ??
      rawRegistration.student?.username ??
      rawRegistration.user?.username ??
      '',
    raw: rawRegistration,
  };
}

