import { apiClient } from './api';
import { Wallet, Transaction } from '../types';
import { API_ENDPOINTS } from '../types/constants';

export const walletService = {
  // Get wallet balance
  getBalance: async (): Promise<Wallet> => {
    try {
      const response = await apiClient.get<Wallet>(API_ENDPOINTS.WALLET.BALANCE);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar saldo');
    }
  },
  
  // Get transaction history
  getTransactions: async (page = 1, limit = 20, type?: string): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    try {
      const params = { page, limit, ...(type && { type }) };
      const response = await apiClient.get(API_ENDPOINTS.WALLET.TRANSACTIONS, params);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar histórico');
    }
  },
  
  // Add funds to wallet
  deposit: async (amount: number, paymentMethod: string): Promise<Transaction> => {
    try {
      const response = await apiClient.post<Transaction>(
        API_ENDPOINTS.WALLET.DEPOSIT,
        { amount, paymentMethod }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao realizar depósito');
    }
  },
  
  // Withdraw funds from wallet
  withdraw: async (amount: number, bankAccount: any): Promise<Transaction> => {
    try {
      const response = await apiClient.post<Transaction>(
        API_ENDPOINTS.WALLET.WITHDRAW,
        { amount, bankAccount }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao realizar saque');
    }
  },
  
  // Get transaction by ID
  getTransaction: async (transactionId: string): Promise<Transaction> => {
    try {
      const response = await apiClient.get<Transaction>(
        `${API_ENDPOINTS.WALLET.TRANSACTIONS}/${transactionId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar transação');
    }
  },
  
  // Get wallet statistics
  getStats: async (period = '30d'): Promise<{
    totalDeposits: number;
    totalWithdrawals: number;
    totalBets: number;
    totalWinnings: number;
    netBalance: number;
  }> => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.WALLET.BALANCE}/stats`,
        { period }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar estatísticas');
    }
  },
  
  // Get available payment methods
  getPaymentMethods: async (): Promise<{
    id: string;
    name: string;
    type: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer';
    enabled: boolean;
    minAmount: number;
    maxAmount: number;
    fee: number;
  }[]> => {
    try {
      const response = await apiClient.get('/payment-methods');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar métodos de pagamento');
    }
  },
  
  // Process PIX payment
  createPixPayment: async (amount: number): Promise<{
    qrCode: string;
    pixKey: string;
    expiresAt: string;
    transactionId: string;
  }> => {
    try {
      const response = await apiClient.post('/payment/pix', { amount });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao gerar PIX');
    }
  },
  
  // Check PIX payment status
  checkPixPayment: async (transactionId: string): Promise<{
    status: 'pending' | 'completed' | 'expired' | 'cancelled';
    amount: number;
    paidAt?: string;
  }> => {
    try {
      const response = await apiClient.get(`/payment/pix/${transactionId}/status`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao verificar pagamento PIX');
    }
  },
  
  // Get bank accounts for withdrawal
  getBankAccounts: async (): Promise<{
    id: string;
    bankName: string;
    accountNumber: string;
    accountType: 'checking' | 'savings';
    holderName: string;
    holderDocument: string;
    isDefault: boolean;
  }[]> => {
    try {
      const response = await apiClient.get('/wallet/bank-accounts');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar contas bancárias');
    }
  },
  
  // Add bank account
  addBankAccount: async (bankAccount: {
    bankName: string;
    accountNumber: string;
    accountType: 'checking' | 'savings';
    holderName: string;
    holderDocument: string;
  }): Promise<void> => {
    try {
      await apiClient.post('/wallet/bank-accounts', bankAccount);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao adicionar conta bancária');
    }
  },
  
  // Remove bank account
  removeBankAccount: async (accountId: string): Promise<void> => {
    try {
      await apiClient.delete(`/wallet/bank-accounts/${accountId}`);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao remover conta bancária');
    }
  }
};