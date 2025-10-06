import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Wallet, Draw, Bet, Notification, Theme, LoginCredentials, AuthResponse } from '../types';
import { STORAGE_KEYS } from '../types/constants';
import { authService } from '../services/authService';
import { walletService } from '../services/walletService';
import { bettingService } from '../services/bettingService';

interface AppState {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Wallet State
  wallet: Wallet | null;
  
  // Betting State
  activeDraw: Draw | null;
  currentBet: Partial<Bet> | null;
  
  // UI State
  theme: Theme;
  sidebarOpen: boolean;
  notifications: Notification[];
  
  // Auth Actions
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: any) => Promise<AuthResponse>;
  logout: () => void;
  setUser: (user: User | null) => void;
  
  // Wallet Actions
  updateWallet: (wallet: Wallet) => void;
  refreshWallet: () => Promise<void>;
  
  // Betting Actions
  setActiveDraw: (draw: Draw | null) => void;
  setCurrentBet: (bet: Partial<Bet> | null) => void;
  placeBet: (bet: Omit<Bet, 'id' | 'createdAt'>) => Promise<void>;
  
  // UI Actions
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading Actions
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      wallet: null,
      activeDraw: null,
      currentBet: null,
      theme: 'light',
      sidebarOpen: false,
      notifications: [],
      
      // Auth Actions
      login: async (credentials: LoginCredentials) => {
    try {
      console.log('useAppStore.login called with:', {
        email: credentials.email,
        hasPassword: !!credentials.password,
        passwordLength: credentials.password?.length || 0
      });
      
      set({ isLoading: true });
      const response = await authService.login(credentials);
      
      console.log('authService.login response:', {
        success: response.success,
        hasUser: !!response.user,
        hasToken: !!response.token
      });
          
          if (response.success) {
            set({ 
              user: response.user, 
              isAuthenticated: true,
              isLoading: false 
            });
            
            // Load wallet data after successful login
            get().refreshWallet();
            
            get().addNotification({
              type: 'success',
              title: 'Login realizado',
              message: `Bem-vindo, ${response.user.name}!`
            });
            
            return response;
          } else {
            set({ isLoading: false });
            return response;
          }
        } catch (error: any) {
          set({ isLoading: false });
          get().addNotification({
            type: 'error',
            title: 'Erro no login',
            message: error.message || 'Credenciais inválidas'
          });
          throw error;
        }
      },
      
      register: async (userData: any) => {
        try {
          set({ isLoading: true });
          const response = await authService.register(userData);
          
          if (response.success) {
            set({ 
              user: response.user, 
              isAuthenticated: true,
              isLoading: false 
            });
            
            // Load wallet data after successful registration
            get().refreshWallet();
            
            get().addNotification({
              type: 'success',
              title: 'Cadastro realizado',
              message: 'Conta criada com sucesso!'
            });
            
            return response;
          } else {
            set({ isLoading: false });
            return response;
          }
        } catch (error: any) {
          set({ isLoading: false });
          get().addNotification({
            type: 'error',
            title: 'Erro no cadastro',
            message: error.message || 'Erro ao criar conta'
          });
          throw error;
        }
      },
      
      logout: () => {
        authService.logout();
        set({ 
          user: null, 
          isAuthenticated: false, 
          wallet: null,
          currentBet: null,
          notifications: []
        });
        
        get().addNotification({
          type: 'info',
          title: 'Logout realizado',
          message: 'Você foi desconectado com sucesso'
        });
      },
      
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
      
      // Wallet Actions
      updateWallet: (wallet: Wallet) => {
        set({ wallet });
      },
      
      refreshWallet: async () => {
        try {
          const wallet = await walletService.getBalance();
          set({ wallet });
        } catch (error) {
          console.error('Error refreshing wallet:', error);
        }
      },
      
      // Betting Actions
      setActiveDraw: (activeDraw: Draw | null) => {
        set({ activeDraw });
      },
      
      setCurrentBet: (currentBet: Partial<Bet> | null) => {
        set({ currentBet });
      },
      
      placeBet: async (bet: Omit<Bet, 'id' | 'createdAt'>) => {
        try {
          set({ isLoading: true });
          const response = await bettingService.placeBet(bet);
          
          if (response.success) {
            // Refresh wallet after successful bet
            get().refreshWallet();
            
            // Clear current bet
            set({ currentBet: null, isLoading: false });
            
            get().addNotification({
              type: 'success',
              title: 'Aposta realizada',
              message: `Aposta de ${bet.modalidade} confirmada!`
            });
          }
        } catch (error: any) {
          set({ isLoading: false });
          get().addNotification({
            type: 'error',
            title: 'Erro na aposta',
            message: error.message || 'Erro ao realizar aposta'
          });
          throw error;
        }
      },
      
      // UI Actions
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
      },
      
      setTheme: (theme: Theme) => {
        set({ theme });
      },
      
      toggleSidebar: () => {
        set({ sidebarOpen: !get().sidebarOpen });
      },
      
      setSidebarOpen: (sidebarOpen: boolean) => {
        set({ sidebarOpen });
      },
      
      addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          read: false
        };
        
        set({ 
          notifications: [newNotification, ...get().notifications.slice(0, 9)] // Keep max 10 notifications
        });
        
        // Auto-remove notification after 5 seconds for success/info types
        if (notification.type === 'success' || notification.type === 'info') {
          setTimeout(() => {
            get().removeNotification(newNotification.id);
          }, 5000);
        }
      },
      
      removeNotification: (id: string) => {
        set({ 
          notifications: get().notifications.filter(n => n.id !== id)
        });
      },
      
      markNotificationAsRead: (id: string) => {
        set({ 
          notifications: get().notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        });
      },
      
      clearNotifications: () => {
        set({ notifications: [] });
      },
      
      // Loading Actions
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      }
    }),
    {
      name: STORAGE_KEYS.USER_DATA,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
);