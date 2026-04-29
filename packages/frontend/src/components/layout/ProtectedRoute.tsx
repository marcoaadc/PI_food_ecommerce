import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
