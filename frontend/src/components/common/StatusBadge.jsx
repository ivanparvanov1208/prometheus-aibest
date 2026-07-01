const STATUS_LABELS = {
  CONFIRMED: 'Confirmed',
  WAITLISTED: 'Waitlisted',
  CANCELLED: 'Cancelled',
  CANCELED: 'Cancelled',
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  CLOSED: 'Closed',
  UNKNOWN: 'Unknown',
};

export function StatusBadge({ status }) {
  const normalizedStatus = typeof status === 'string' ? status.toUpperCase() : 'UNKNOWN';
  const label = STATUS_LABELS[normalizedStatus] || toTitleCase(normalizedStatus);

  return <span className={`status-badge status-${normalizedStatus.toLowerCase()}`}>{label}</span>;
}

function toTitleCase(value) {
  return value
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

