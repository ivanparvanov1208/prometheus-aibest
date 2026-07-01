import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <Header />
      <main className="page-shell">
        <div className="page-shell-content" key={location.pathname}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
