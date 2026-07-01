import { Link } from 'react-router-dom';

export function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <section className="auth-layout">
      <div className="auth-brand-panel">
        <Link className="auth-home-link" to="/">
          Attendly
        </Link>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="auth-panel-note">
          <span>Attendly access</span>
          <strong>Make the next event easier to find, join, and remember.</strong>
        </div>
      </div>
      <div className="auth-form-panel">{children}</div>
    </section>
  );
}
