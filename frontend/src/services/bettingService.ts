import { apiClient } from './api';
import { Bet, BetRequest, BetResponse, Draw, DrawResult } from '../types';
import { API_ENDPOINTS } from '../types/constants';

export const bettingService = {
  // Place a new bet
  placeBet: async (betData: BetRequest): Promise<BetResponse> => {
    try {
      const response = await apiClient.post<BetResponse>(
        API_ENDPOINTS.BETTING.PLACE_BET,
        betData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao realizar aposta');
    }
  },
  
  // Get user's betting history
  getBetHistory: async (page = 1, limit = 20, status?: string): Promise<{
    bets: Bet[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    try {
      const params = { page, limit, ...(status && { status }) };
      const response = await apiClient.get(API_ENDPOINTS.BETTING.HISTORY, params);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar histórico de apostas');
    }
  },
  
  // Get current active draw
  getCurrentDraw: async (): Promise<Draw> => {
    try {
      const response = await apiClient.get<Draw>(API_ENDPOINTS.BETTING.CURRENT_DRAW);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar sorteio atual');
    }
  },
  
  // Get draw results
  getDrawResults: async (drawId?: string, page = 1, limit = 20): Promise<{
    results: DrawResult[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    try {
      const params = { page, limit, ...(drawId && { drawId }) };
      const response = await apiClient.get(API_ENDPOINTS.BETTING.RESULTS, params);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar resultados');
    }
  },
  
  // Get specific bet details
  getBet: async (betId: string): Promise<Bet> => {
    try {
      const response = await apiClient.get<Bet>(
        `${API_ENDPOINTS.BETTING.PLACE_BET}/${betId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar aposta');
    }
  },
  
  // Cancel a bet (if allowed)
  cancelBet: async (betId: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.BETTING.PLACE_BET}/${betId}`);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao cancelar aposta');
    }
  },
  
  // Get betting statistics
  getBettingStats: async (period = '30d'): Promise<{
    totalBets: number;
    totalAmount: number;
    totalWinnings: number;
    winRate: number;
    favoriteModality: string;
    biggestWin: number;
    currentStreak: number;
  }> => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.BETTING.HISTORY}/stats`,
        { period }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar estatísticas');
    }
  },
  
  // Get available betting modalities
  getModalities: async (): Promise<{
    id: string;
    name: string;
    description: string;
    minBet: number;
    maxBet: number;
    odds: number;
    enabled: boolean;
  }[]> => {
    try {
      const response = await apiClient.get('/betting/modalities');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar modalidades');
    }
  },
  
  // Get draw schedule
  getDrawSchedule: async (): Promise<{
    id: string;
    name: string;
    scheduledAt: string;
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
    prizePool: number;
  }[]> => {
    try {
      const response = await apiClient.get('/betting/schedule');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar cronograma');
    }
  },
  
  // Get live draw updates
  getLiveDraw: async (drawId: string): Promise<{
    id: string;
    status: 'waiting' | 'drawing' | 'completed';
    drawnNumbers: number[];
    remainingTime: number;
    totalBets: number;
    prizePool: number;
  }> => {
    try {
      const response = await apiClient.get(`/betting/live/${drawId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar sorteio ao vivo');
    }
  },
  
  // Get winning numbers for specific draw
  getWinningNumbers: async (drawId: string): Promise<{
    drawId: string;
    drawDate: string;
    numbers: number[];
    prizes: {
      modality: string;
      winners: number;
      prizeAmount: number;
    }[];
  }> => {
    try {
      const response = await apiClient.get(`/betting/results/${drawId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar números sorteados');
    }
  },
  
  // Check if numbers are valid for modality
  validateNumbers: async (modality: string, numbers: number[]): Promise<{
    valid: boolean;
    errors: string[];
  }> => {
    try {
      const response = await apiClient.post('/betting/validate', {
        modality,
        numbers
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao validar números');
    }
  },
  
  // Get popular numbers
  getPopularNumbers: async (modality: string, period = '30d'): Promise<{
    mostChosen: number[];
    leastChosen: number[];
    hotNumbers: number[];
    coldNumbers: number[];
  }> => {
    try {
      const response = await apiClient.get('/betting/popular-numbers', {
        modality,
        period
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar números populares');
    }
  }
};