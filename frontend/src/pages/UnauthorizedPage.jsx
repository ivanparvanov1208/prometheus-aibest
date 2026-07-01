import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  return (
    <section className="message-page">
      <h1>This page is not available for your account</h1>
      <p>Head back to your main area to keep exploring events and registrations.</p>
      <Link className="button button-primary" to="/">
        Back to home
      </Link>
    </section>
  );
}
