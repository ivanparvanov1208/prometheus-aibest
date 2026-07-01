import { getErrorMessage } from '../../utils/errors';

export function ErrorMessage({ error, title = 'Request failed' }) {
  if (!error) {
    return null;
  }

  return (
    <div className="alert alert-error" role="alert">
      <strong>{title}</strong>
      <span>{getErrorMessage(error)}</span>
    </div>
  );
}

