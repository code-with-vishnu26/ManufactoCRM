import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RoleBasedRoute — Only allows access if user has the exact required role.
 * If wrong role → redirect to /unauthorized
 * If not logged in → redirect to /login (handled by ProtectedRoute above)
 */
export default function RoleBasedRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // ProtectedRoute already handles loading

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
