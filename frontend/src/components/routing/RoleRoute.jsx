import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function RoleRoute({ allowedRoles }) {
  const { role, roleIssue } = useAuth();
  const location = useLocation();

  if (!role) {
    return <Navigate replace to="/role-unavailable" state={{ from: location, roleIssue }} />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate replace to="/unauthorized" />;
  }

  return <Outlet />;
}

