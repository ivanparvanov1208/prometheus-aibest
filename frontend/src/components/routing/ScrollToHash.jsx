import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.querySelector(location.hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.pathname, location.hash]);

  return null;
}
