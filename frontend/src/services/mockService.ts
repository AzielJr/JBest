import { User, LoginCredentials, RegisterData, AuthResponse, ApiResponse } from '../types';

// Mock data for demo mode
const MOCK_USERS = [
  {
    id: '1',
    name: 'Demo Player',
    email: 'player@jbest.com',
    phone: '(11) 99999-9999',
    role: 'jogador' as const,
    isAuthenticated: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Admin JBest',
    email: 'admin@jbest.com',
    phone: '(11) 88888-8888',
    role: 'admin' as const,
    isAuthenticated: true,
    createdAt: new Date().toISOString()
  }
];

const MOCK_TOKEN = 'demo-jwt-token-12345';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
  // Mock login
  login: async (credentials: LoginCredentials): Promise<{ data: ApiResponse<AuthResponse> }> => {
    await delay(1000); // Simulate network delay
    
    console.log('MockService - Login attempt:', credentials);
    
    // Admin login
    if (credentials.email === 'admin@jbest.com' && credentials.password === '123456') {
      return {
        data: {
          success: true,
          message: 'Login administrativo realizado com sucesso',
          data: {
            success: true,
            token: MOCK_TOKEN,
            user: MOCK_USERS[1] // Admin user
          }
        }
      };
    }
    
    // Player login
    if (credentials.email === 'player@jbest.com' && credentials.password === '123456') {
      return {
        data: {
          success: true,
          message: 'Login realizado com sucesso',
          data: {
            success: true,
            token: MOCK_TOKEN,
            user: MOCK_USERS[0] // Player user
          }
        }
      };
    }
    
    // Allow any email/password for demo (defaults to player)
    if (credentials.email && credentials.password) {
      const isAdmin = credentials.email.includes('admin');
      const userTemplate = isAdmin ? MOCK_USERS[1] : MOCK_USERS[0];
      
      const demoUser = {
        ...userTemplate,
        email: credentials.email,
        name: credentials.email.split('@')[0],
        role: isAdmin ? 'admin' as const : 'jogador' as const
      };
      
      return {
        data: {
          success: true,
          message: `Login ${isAdmin ? 'administrativo' : ''} realizado com sucesso (modo demo)`,
          data: {
            success: true,
            token: MOCK_TOKEN,
            user: demoUser
          }
        }
      };
    }
    
    throw new Error('Email e senha são obrigatórios');
  },

  // Mock register
  register: async (userData: RegisterData): Promise<{ data: ApiResponse<AuthResponse> }> => {
    await delay(1500);
    
    console.log('MockService - Register attempt:', userData);
    
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: '(11) 99999-9999',
      role: 'jogador' as const,
      isAuthenticated: true,
      createdAt: new Date().toISOString()
    };
    
    return {
      data: {
        success: true,
        message: 'Conta criada com sucesso (modo demo)',
        data: {
          success: true,
          token: MOCK_TOKEN,
          user: newUser
        }
      }
    };
  },

  // Mock profile
  getProfile: async (): Promise<{ data: ApiResponse<User> }> => {
    await delay(500);
    
    return {
      data: {
        success: true,
        message: 'Perfil carregado com sucesso',
        data: MOCK_USERS[0]
      }
    };
  },

  // Mock wallet balance
  getWalletBalance: async (): Promise<{ data: ApiResponse<{ balance: number }> }> => {
    await delay(300);
    
    return {
      data: {
        success: true,
        message: 'Saldo carregado com sucesso',
        data: {
          balance: 1000
        }
      }
    };
  },

  // Mock admin dashboard data
  getAdminDashboard: async (): Promise<{ data: ApiResponse<any> }> => {
    await delay(800);
    
    const mockData = {
      totalUsers: 1247,
      activeUsers: 892,
      totalBets: 15634,
      totalRevenue: 234567.89,
      todayRevenue: 12345.67,
      pendingWithdrawals: 8,
      bettingModalityStats: [
        { modality: 'milhar', totalBets: 4521, totalAmount: 89420.50, totalPrizes: 67890.25 },
        { modality: 'centena', totalBets: 3892, totalAmount: 67834.20, totalPrizes: 45623.15 },
        { modality: 'dezena', totalBets: 2156, totalAmount: 32340.80, totalPrizes: 21560.40 },
        { modality: 'terno', totalBets: 1876, totalAmount: 28140.60, totalPrizes: 18760.30 },
        { modality: 'milhar_pura', totalBets: 987, totalAmount: 19740.00, totalPrizes: 15792.00 },
        { modality: 'grupo', totalBets: 2202, totalAmount: 33030.00, totalPrizes: 22020.00 }
      ],
      revenueByPeriod: {
        daily: [
          { date: '2024-01-15', revenue: 12345.67 },
          { date: '2024-01-14', revenue: 10987.43 },
          { date: '2024-01-13', revenue: 15432.21 },
          { date: '2024-01-12', revenue: 9876.54 },
          { date: '2024-01-11', revenue: 13245.78 }
        ],
        monthly: [
          { month: '2024-01', revenue: 234567.89 },
          { month: '2023-12', revenue: 198765.43 },
          { month: '2023-11', revenue: 176543.21 }
        ]
      }
    };
    
    return {
      data: {
        success: true,
        message: 'Dados do dashboard carregados com sucesso',
        data: mockData
      }
    };
  }
};