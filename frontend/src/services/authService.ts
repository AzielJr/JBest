import { apiClient } from './api';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import { API_ENDPOINTS, STORAGE_KEYS } from '../types/constants';

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Debug: Log the credentials being sent
      console.log('AuthService - Sending login request:', {
        url: API_ENDPOINTS.AUTH.LOGIN,
        credentials: {
          email: credentials.email,
          password: credentials.password ? '[HIDDEN]' : 'EMPTY',
          emailLength: credentials.email?.length || 0,
          passwordLength: credentials.password?.length || 0
        }
      });
      
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      console.log('AuthService - Received response:', {
        status: response.status,
        success: response.data?.success,
        hasData: !!response.data?.data,
        message: response.data?.message
      });
      
      // Backend returns: { success, message, data: { user, token } }
      // Frontend expects: { success, user, token }
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        
        // Store token and user data
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        // Return in expected format
        return {
          success: true,
          user,
          token
        };
      }
      
      throw new Error(response.data.message || 'Erro ao fazer login');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Erro ao fazer login');
    }
  },
  
  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );
      
      // Backend returns: { success, message, data: { user, token } }
      // Frontend expects: { success, user, token }
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        
        // Store token and user data
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        // Return in expected format
        return {
          success: true,
          user,
          token
        };
      }
      
      throw new Error(response.data.message || 'Erro ao criar conta');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Erro ao criar conta');
    }
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint to invalidate token on server
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with logout even if server call fails
      console.warn('Error during server logout:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },
  
  // Get current user profile
  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar perfil');
    }
  },
  
  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await apiClient.put<User>(
        API_ENDPOINTS.AUTH.PROFILE,
        userData
      );
      
      // Update stored user data
      if (response.data) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao atualizar perfil');
    }
  },
  
  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword
      });
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao alterar senha');
    }
  },
  
  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao solicitar recuperação de senha');
    }
  },
  
  // Reset password with token
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword
      });
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao redefinir senha');
    }
  },
  
  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao verificar email');
    }
  },
  
  // Resend verification email
  resendVerification: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao reenviar email de verificação');
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },
  
  // Get stored user data
  getStoredUser: (): User | null => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  },
  
  // Get stored auth token
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }
};