import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Could replace with a better spinner component
  }

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If admin is required but user is not admin, redirect to home
  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated (and authorized if admin required)
  return <Outlet />;
};
