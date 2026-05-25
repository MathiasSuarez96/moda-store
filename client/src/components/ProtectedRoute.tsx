import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.rol !== 'ADMIN') return <Navigate to="/" replace />;

  return <>{children}</>;
}
