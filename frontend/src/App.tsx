import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAppStore } from './stores/useAppStore';
import { authService } from './services/authService';
import { ROUTES } from './types/constants';

// Layout Components
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/player/Dashboard';
import Betting from './pages/player/Betting';
import Wallet from './pages/player/Wallet';
import History from './pages/player/History';
import Profile from './pages/player/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminDraws from './pages/admin/Draws';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { user, setUser, setLoading, refreshWallet } = useAppStore();

  // Initialize app and check authentication
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            console.log('Setting stored user:', storedUser);
            setUser(storedUser);
            
            // Load wallet data
            try {
              await refreshWallet();
            } catch (error) {
              console.warn('Failed to load wallet data:', error);
            }
            
            // Optionally refresh user data from server
            try {
              const currentUser = await authService.getProfile();
              console.log('Refreshed user data:', currentUser);
              setUser(currentUser);
            } catch (error) {
              console.warn('Failed to refresh user data:', error);
            }
          }
        } else {
          console.log('User not authenticated, clearing state');
          setUser(null);
        }
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [setUser, setLoading, refreshWallet]);

  // Debug log
  useEffect(() => {
    console.log('Current user state:', user);
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<Home />} />
            
            {/* Auth Routes */}
            <Route
              path={ROUTES.LOGIN}
              element={
                <ProtectedRoute requireAuth={false}>
                  <AuthLayout>
                    <Login />
                  </AuthLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.REGISTER}
              element={
                <ProtectedRoute requireAuth={false}>
                  <AuthLayout>
                    <Register />
                  </AuthLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Protected Player Routes */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.BET}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Betting />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.WALLET}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Wallet />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.HISTORY}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <History />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path={ROUTES.ADMIN.DASHBOARD}
              element={
                <ProtectedRoute requireAdmin>
                  <MainLayout>
                    <AdminDashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.USERS}
              element={
                <ProtectedRoute requireAdmin>
                  <MainLayout>
                    <AdminUsers />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.ADMIN.DRAWS}
              element={
                <ProtectedRoute requireAdmin>
                  <MainLayout>
                    <AdminDraws />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.REPORTS}
              element={
                <ProtectedRoute requireAdmin>
                  <MainLayout>
                    <AdminReports />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.SETTINGS}
              element={
                <ProtectedRoute requireAdmin>
                  <MainLayout>
                    <AdminSettings />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
          
          {/* Toast notifications */}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton 
            duration={4000}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
