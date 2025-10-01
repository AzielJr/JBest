import { ModalityConfig, BettingModality } from './index';

// Betting modality configurations
export const BETTING_MODALITIES: Record<BettingModality, ModalityConfig> = {
  milhar: {
    name: 'milhar',
    displayName: 'Milhar',
    description: 'Aposte em 4 números de 0000 a 9999',
    minNumbers: 4,
    maxNumbers: 4,
    numberRange: [0, 9999],
    multiplicador: 4000,
    minBet: 1,
    maxBet: 1000
  },
  centena: {
    name: 'centena',
    displayName: 'Centena',
    description: 'Aposte em 3 números de 000 a 999',
    minNumbers: 3,
    maxNumbers: 3,
    numberRange: [0, 999],
    multiplicador: 600,
    minBet: 1,
    maxBet: 1000
  },
  dezena: {
    name: 'dezena',
    displayName: 'Dezena',
    description: 'Aposte em uma dezena de 00 a 99',
    minNumbers: 1,
    maxNumbers: 1,
    numberRange: [0, 99],
    multiplicador: 100,
    minBet: 1,
    maxBet: 1000
  },
  terno: {
    name: 'terno',
    displayName: 'Terno',
    description: 'Aposte em 3 números em qualquer ordem',
    minNumbers: 3,
    maxNumbers: 3,
    numberRange: [0, 999],
    multiplicador: 24,
    minBet: 1,
    maxBet: 1000
  },
  milhar_pura: {
    name: 'milhar_pura',
    displayName: 'Milhar Pura',
    description: 'Aposte no milhar exato sem inversões',
    minNumbers: 4,
    maxNumbers: 4,
    numberRange: [0, 9999],
    multiplicador: 8000,
    minBet: 1,
    maxBet: 500
  },
  grupo: {
    name: 'grupo',
    displayName: 'Grupo',
    description: 'Aposte no grupo do animal (1-25)',
    minNumbers: 1,
    maxNumbers: 1,
    numberRange: [1, 25],
    multiplicador: 18,
    minBet: 1,
    maxBet: 1000
  }
};

// Animal groups for "Grupo" betting
export const ANIMAL_GROUPS = [
  { id: 1, name: 'Avestruz', numbers: [1, 2, 3, 4] },
  { id: 2, name: 'Águia', numbers: [5, 6, 7, 8] },
  { id: 3, name: 'Burro', numbers: [9, 10, 11, 12] },
  { id: 4, name: 'Borboleta', numbers: [13, 14, 15, 16] },
  { id: 5, name: 'Cachorro', numbers: [17, 18, 19, 20] },
  { id: 6, name: 'Cabra', numbers: [21, 22, 23, 24] },
  { id: 7, name: 'Carneiro', numbers: [25, 26, 27, 28] },
  { id: 8, name: 'Camelo', numbers: [29, 30, 31, 32] },
  { id: 9, name: 'Cobra', numbers: [33, 34, 35, 36] },
  { id: 10, name: 'Coelho', numbers: [37, 38, 39, 40] },
  { id: 11, name: 'Cavalo', numbers: [41, 42, 43, 44] },
  { id: 12, name: 'Elefante', numbers: [45, 46, 47, 48] },
  { id: 13, name: 'Galo', numbers: [49, 50, 51, 52] },
  { id: 14, name: 'Gato', numbers: [53, 54, 55, 56] },
  { id: 15, name: 'Jacaré', numbers: [57, 58, 59, 60] },
  { id: 16, name: 'Leão', numbers: [61, 62, 63, 64] },
  { id: 17, name: 'Macaco', numbers: [65, 66, 67, 68] },
  { id: 18, name: 'Porco', numbers: [69, 70, 71, 72] },
  { id: 19, name: 'Pavão', numbers: [73, 74, 75, 76] },
  { id: 20, name: 'Peru', numbers: [77, 78, 79, 80] },
  { id: 21, name: 'Touro', numbers: [81, 82, 83, 84] },
  { id: 22, name: 'Tigre', numbers: [85, 86, 87, 88] },
  { id: 23, name: 'Urso', numbers: [89, 90, 91, 92] },
  { id: 24, name: 'Veado', numbers: [93, 94, 95, 96] },
  { id: 25, name: 'Vaca', numbers: [97, 98, 99, 0] }
];

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    CHANGE_PASSWORD: '/api/auth/change-password'
  },
  BETS: {
    CREATE: '/api/bets',
    HISTORY: '/api/bets/history',
    BY_ID: (id: string) => `/api/bets/${id}`
  },
  BETTING: {
    PLACE_BET: '/api/bets',
    HISTORY: '/api/bets/history',
    RESULTS: '/api/draws/results',
    CANCEL: (betId: string) => `/api/bets/${betId}`,
    STATS: '/api/bets/stats',
    CURRENT_DRAW: '/api/draws/current'
  },
  WALLET: {
    BALANCE: '/api/wallet/balance',
    DEPOSIT: '/api/wallet/deposit',
    WITHDRAW: '/api/wallet/withdraw',
    TRANSACTIONS: '/api/wallet/transactions'
  },
  DRAWS: {
    ACTIVE: '/api/draws/active',
    RESULTS: '/api/draws/results',
    BY_ID: (id: string) => `/api/draws/${id}`
  },
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    USERS: '/api/admin/users',
    REPORTS: '/api/admin/reports',
    SETTINGS: '/api/admin/settings'
  }
};

// App configuration
export const APP_CONFIG = {
  APP_NAME: 'JBest',
  VERSION: '1.0.0',
  DEFAULT_CURRENCY: 'BRL',
  CURRENCY_SYMBOL: 'R$',
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
  PAGINATION_SIZE: 20,
  MAX_CONCURRENT_USERS: 10000,
  RESPONSE_TIMEOUT: 2000
};

// Theme colors
export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#1E40AF', // Primary blue
    700: '#1d4ed8',
    800: '#1e3a8a',
    900: '#1e40af'
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10B981', // Success green
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#EF4444', // Error red
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  neutral: {
    50: '#F8FAFC', // Light background
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#6B7280', // Secondary text
    600: '#475569',
    700: '#334155',
    800: '#1F2937', // Dark text
    900: '#0f172a'
  }
};

// Validation rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  BET_MIN_VALUE: 1,
  BET_MAX_VALUE: 1000
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'jbest_auth_token',
  USER_DATA: 'jbest_user_data',
  THEME: 'jbest_theme',
  SIDEBAR_STATE: 'jbest_sidebar_state'
};

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  BETTING: '/betting',
  BET: '/bet',
  BET_MODALITY: (modality: string) => `/bet/${modality}`,
  WALLET: '/wallet',
  HISTORY: '/history',
  PROFILE: '/profile',
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    DRAWS: '/admin/draws',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings'
  }
};