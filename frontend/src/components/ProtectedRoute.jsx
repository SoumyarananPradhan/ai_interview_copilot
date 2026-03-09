import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('access');

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}