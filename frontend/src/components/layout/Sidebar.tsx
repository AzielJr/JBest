import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  DollarSign,
  Wallet,
  History,
  User,
  Settings,
  BarChart3,
  Users,
  FileText,
  Shield,
  X
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { ROUTES } from '../../types/constants';

const Sidebar: React.FC = () => {
  const { user, sidebarOpen, toggleSidebar } = useAppStore();
  const location = useLocation();

  const playerMenuItems = [
    {
      name: 'Dashboard',
      href: ROUTES.DASHBOARD,
      icon: Home
    },
    {
      name: 'Apostar',
      href: ROUTES.BET,
      icon: DollarSign
    },
    {
      name: 'Carteira',
      href: ROUTES.WALLET,
      icon: Wallet
    },
    {
      name: 'Histórico',
      href: ROUTES.HISTORY,
      icon: History
    },
    {
      name: 'Perfil',
      href: ROUTES.PROFILE,
      icon: User
    }
  ];

  const adminMenuItems = [
    {
      name: 'Dashboard Admin',
      href: ROUTES.ADMIN.DASHBOARD,
      icon: BarChart3
    },
    {
      name: 'Usuários',
      href: ROUTES.ADMIN.USERS,
      icon: Users
    },

    {
      name: 'Sorteios',
      href: ROUTES.ADMIN.DRAWS,
      icon: Settings
    },
    {
      name: 'Relatórios',
      href: ROUTES.ADMIN.REPORTS,
      icon: FileText
    },
    {
      name: 'Configurações',
      href: ROUTES.ADMIN.SETTINGS,
      icon: Shield
    }
  ];

  const menuItems = user?.role === 'admin' ? [...playerMenuItems, ...adminMenuItems] : playerMenuItems;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:fixed lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">JBest</h1>
          </Link>
          
          {/* Close button for mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200
                  ${active 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon size={20} className={active ? 'text-blue-500' : ''} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.role === 'admin' ? 'Administrador' : 'Jogador'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;