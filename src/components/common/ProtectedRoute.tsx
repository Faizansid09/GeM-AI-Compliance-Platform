import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, the route is accessible even if profile is incomplete. */
  allowIncompleteProfile?: boolean;
}

/**
 * Guards routes from unauthenticated access.
 *
 * Flow:
 *   Not authenticated → /login (with redirect-back `from` state)
 *   Authenticated + profile incomplete → /profile-setup
 *   Authenticated + profile complete → render children
 */
export function ProtectedRoute({ children, allowIncompleteProfile = false }: ProtectedRouteProps) {
  const { user, profileComplete, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profileComplete && !allowIncompleteProfile) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <>{children}</>;
}
