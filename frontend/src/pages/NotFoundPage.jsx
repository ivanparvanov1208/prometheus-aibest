import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="message-page">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link className="button button-primary" to="/">
        Back home
      </Link>
    </section>
  );
}

