import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/useAppStore';
import { ROUTES } from '../../types/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo
}) => {
  const { isAuthenticated, user } = useAppStore();
  const location = useLocation();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo || ROUTES.LOGIN} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If admin access is required but user is not admin
  if (requireAdmin && (!user || user.role !== 'admin')) {
    return (
      <Navigate 
        to={redirectTo || ROUTES.DASHBOARD} 
        replace 
      />
    );
  }

  // If user is authenticated but trying to access auth pages
  if (!requireAuth && isAuthenticated) {
    const authPages = [ROUTES.LOGIN, ROUTES.REGISTER];
    if (authPages.includes(location.pathname)) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;