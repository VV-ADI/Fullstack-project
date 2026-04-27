import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-2 border-black border-t-transparent animate-spin mx-auto" />
          <p className="mt-4 text-on-surface-variant mono text-xs uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center uber-panel p-12 max-w-md animate-fade-in">
          <div className="w-16 h-16 bg-zone-critical/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-zone-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">ACCESS DENIED</h1>
          <p className="text-on-surface-variant">
            You don't have permission to access this area.
          </p>
          <p className="mono text-xs text-on-surface-variant mt-4 uppercase tracking-widest">
            Required: {requiredRole} clearance
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
