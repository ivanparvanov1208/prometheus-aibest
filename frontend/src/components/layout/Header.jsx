import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

export function Header() {
  const { isAuthenticated, logout, role, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate('/');
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand-mark">AT</span>
        <span>Attendly</span>
      </Link>

      <button
        aria-controls="primary-navigation"
        aria-expanded={isMenuOpen}
        className="menu-toggle"
        onClick={() => setIsMenuOpen((current) => !current)}
        type="button"
      >
        Menu
      </button>

      <nav
        className={`site-nav ${isMenuOpen ? 'site-nav-open' : ''}`}
        id="primary-navigation"
        aria-label="Primary navigation"
      >
        <NavLink to="/" end onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/events" onClick={closeMenu}>
          Events
        </NavLink>
        <Link to="/#how-it-works" onClick={closeMenu}>
          How it works
        </Link>
        <Link to="/#about" onClick={closeMenu}>
          About
        </Link>

        {isAuthenticated && role === 'student' ? (
          <NavLink to="/my-registrations" onClick={closeMenu}>
            My Registrations
          </NavLink>
        ) : null}

        {isAuthenticated && role === 'organizer' ? (
          <>
            <NavLink to="/organizer/events" onClick={closeMenu}>
              My Events
            </NavLink>
            <NavLink to="/organizer/events/new" onClick={closeMenu}>
              Create Event
            </NavLink>
          </>
        ) : null}

        {!isAuthenticated ? (
          <div className="nav-actions">
            <NavLink className="nav-login" to="/login" onClick={closeMenu}>
              Sign in
            </NavLink>
            <NavLink className="nav-register" to="/register" onClick={closeMenu}>
              Create account
            </NavLink>
          </div>
        ) : (
          <div className="session-nav">
            <span>{user?.username || 'Signed in'}</span>
            <Button variant="secondary" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
