import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" to="/">
          Attendly
        </Link>
        <p>Attendly keeps discovery, registration, and event planning in one calm place.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/login">Sign in</Link>
        <Link to="/register">Create account</Link>
      </nav>
      <small>Copyright 2026 Attendly</small>
    </footer>
  );
}
