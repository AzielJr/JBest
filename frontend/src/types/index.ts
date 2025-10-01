// Main TypeScript interfaces for JBest betting platform

// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'jogador' | 'admin' | 'operador';
  isAuthenticated: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Wallet related types
export interface Wallet {
  userId: string;
  balance: number;
  blockedAmount: number;
  transactions: Transaction[];
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  type: 'deposito' | 'retirada' | 'aposta' | 'premio';
  amount: number;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  createdAt: string;
  description?: string;
}

// Betting related types
export type BettingModality = 'milhar' | 'centena' | 'dezena' | 'terno' | 'milhar_pura' | 'grupo';

export interface Bet {
  id: string;
  userId: string;
  drawId: string;
  modalidade: BettingModality;
  numeros: number[];
  valor: number;
  multiplicador: number;
  status: 'ativa' | 'vencedora' | 'perdedora' | 'cancelada';
  premio?: number;
  createdAt: string;
}

export interface BetRequest {
  modalidade: BettingModality;
  numeros: number[];
  valor: number;
  drawId: string;
}

// Draw related types
export interface Draw {
  id: string;
  dataExtracao: string;
  horarioLimite: string;
  status: 'aberta' | 'fechada' | 'apurada';
  resultados: DrawResult[];
  totalApostado: number;
  totalPremios: number;
  lucroLiquido: number;
}

export interface DrawResult {
  modalidade: string;
  numerosVencedores: number[];
  multiplicador: number;
  quantidadeGanhadores: number;
  valorTotalPremios: number;
}

// UI related types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface BetResponse {
  success: boolean;
  bet_id: string;
  comprovante: {
    id: string;
    modalidade: BettingModality;
    numeros: number[];
    valor: number;
    dataAposta: string;
  };
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined;
}

// Betting modality configuration
export interface ModalityConfig {
  name: string;
  displayName: string;
  description: string;
  minNumbers: number;
  maxNumbers: number;
  numberRange: [number, number];
  multiplicador: number;
  minBet: number;
  maxBet: number;
}

// Admin dashboard types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBets: number;
  totalRevenue: number;
  todayRevenue: number;
  pendingWithdrawals: number;
}

export interface ReportFilter {
  startDate: string;
  endDate: string;
  modalidade?: BettingModality;
  userId?: string;
  status?: string;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Theme types
export type Theme = 'light' | 'dark';

// Route types
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  protected?: boolean;
  adminOnly?: boolean;
}

// Store types
export interface AppState {
  // Auth State
  user: User | null;
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
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateWallet: (wallet: Wallet) => void;
  placeBet: (bet: Omit<Bet, 'id' | 'createdAt'>) => Promise<void>;
  toggleTheme: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  toggleSidebar: () => void;
}