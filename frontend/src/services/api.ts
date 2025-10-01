import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '../types';
import { STORAGE_KEYS } from '../types/constants';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug: Log all outgoing requests
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Forbidden - show error message
      console.error('Access forbidden');
    }
    
    if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const apiClient = {
  get: async <T = any>(url: string, params?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    try {
      const response = await api.get(url, { params });
      return response;
    } catch (error: any) {
      throw error;
    }
  },
  
  post: async <T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    try {
      const response = await api.post(url, data);
      return response;
    } catch (error: any) {
      throw error;
    }
  },
  
  put: async <T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    try {
      const response = await api.put(url, data);
      return response;
    } catch (error: any) {
      throw error;
    }
  },
  
  delete: async <T = any>(url: string): Promise<AxiosResponse<ApiResponse<T>>> => {
    try {
      const response = await api.delete(url);
      return response;
    } catch (error: any) {
      throw error;
    }
  }
};

export default api;