import React from 'react';
import { useAppStore } from '../../stores/useAppStore';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { loading } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header - Fixed position */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-30">
          <Header />
        </div>

        {/* Page content - Add top padding to account for fixed header */}
        <main className="pt-16 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* Notification Center */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Notifications will be rendered here */}
      </div>
    </div>
  );
};

export default MainLayout;