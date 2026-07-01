export function EmptyState({ title, message, action }) {
  return (
    <section className="empty-state">
      <h2>{title}</h2>
      {message ? <p>{message}</p> : null}
      {action ? <div className="empty-state-action">{action}</div> : null}
    </section>
  );
}

