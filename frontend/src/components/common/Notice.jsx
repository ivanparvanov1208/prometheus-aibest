export function Notice({ children, variant = 'info', title }) {
  return (
    <div className={`alert alert-${variant}`} role={variant === 'error' ? 'alert' : 'status'} aria-live="polite">
      {title ? <strong>{title}</strong> : null}
      <span>{children}</span>
    </div>
  );
}

