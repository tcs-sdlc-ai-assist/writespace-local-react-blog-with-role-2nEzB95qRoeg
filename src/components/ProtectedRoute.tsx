import { Navigate } from 'react-router-dom';
import type { UserRole } from '../utils/types';
import { getSession } from '../utils/auth';

interface ProtectedRouteProps {
  role?: UserRole;
  children: React.ReactNode;
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps): JSX.Element {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && session.role !== 'admin') {
    return <Navigate to="/blogs" replace />;
  }

  return <>{children}</>;
}