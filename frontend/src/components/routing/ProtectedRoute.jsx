import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner label="Restoring session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
}

