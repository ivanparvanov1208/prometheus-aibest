import { Button } from './Button';

export function Modal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {isLoading ? 'Working...' : confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}

