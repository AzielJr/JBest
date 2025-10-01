import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { bettingService } from '../../services/bettingService';
import { walletService } from '../../services/walletService';
import { BETTING_MODALITIES, ROUTES } from '../../types/constants';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalBets: number;
  totalWinnings: number;
  pendingWithdrawals: number;
  systemHealth: 'good' | 'warning' | 'critical';
}

interface RecentActivity {
  id: string;
  type: 'bet' | 'deposit' | 'withdrawal' | 'registration';
  user: string;
  amount?: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

interface ModalityStats {
  modality: string;
  totalBets: number;
  totalAmount: number;
  winRate: number;
  revenue: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    totalBets: 0,
    totalWinnings: 0,
    pendingWithdrawals: 0,
    systemHealth: 'good'
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [modalityStats, setModalityStats] = useState<ModalityStats[]>([]);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('today');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls for admin dashboard data
      // In a real app, these would be actual API endpoints
      const [statsResponse, activityResponse, modalityResponse] = await Promise.all([
        // Mock stats data
        Promise.resolve({
          success: true,
          data: {
            totalUsers: 15420,
            activeUsers: 3240,
            totalRevenue: 2450000,
            totalBets: 45680,
            totalWinnings: 1890000,
            pendingWithdrawals: 125000,
            systemHealth: 'good' as const
          }
        }),
        // Mock recent activity
        Promise.resolve({
          success: true,
          data: [
            {
              id: '1',
              type: 'bet' as const,
              user: 'João Silva',
              amount: 50,
              status: 'completed' as const,
              timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
            },
            {
              id: '2',
              type: 'withdrawal' as const,
              user: 'Maria Santos',
              amount: 1200,
              status: 'pending' as const,
              timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
            },
            {
              id: '3',
              type: 'deposit' as const,
              user: 'Pedro Costa',
              amount: 300,
              status: 'completed' as const,
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
            },
            {
              id: '4',
              type: 'registration' as const,
              user: 'Ana Oliveira',
              status: 'completed' as const,
              timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
            },
            {
              id: '5',
              type: 'bet' as const,
              user: 'Carlos Lima',
              amount: 25,
              status: 'failed' as const,
              timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
            }
          ]
        }),
        // Mock modality stats
        Promise.resolve({
          success: true,
          data: [
            { modality: 'Milhar', totalBets: 12500, totalAmount: 625000, winRate: 15.2, revenue: 93750 },
            { modality: 'Centena', totalBets: 8900, totalAmount: 267000, winRate: 18.5, revenue: 40050 },
            { modality: 'Dezena', totalBets: 15600, totalAmount: 468000, winRate: 22.1, revenue: 70200 },
            { modality: 'Terno', totalBets: 6700, totalAmount: 335000, winRate: 12.8, revenue: 50250 },
            { modality: 'Grupo', totalBets: 4200, totalAmount: 210000, winRate: 25.5, revenue: 31500 }
          ]
        })
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      
      if (activityResponse.success) {
        setRecentActivity(activityResponse.data);
      }
      
      if (modalityResponse.success) {
        setModalityStats(modalityResponse.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast.success('Dados atualizados!');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bet':
        return <TrendingUp className="text-blue-600" size={16} />;
      case 'deposit':
        return <ArrowUpRight className="text-green-600" size={16} />;
      case 'withdrawal':
        return <ArrowDownRight className="text-orange-600" size={16} />;
      case 'registration':
        return <Users className="text-purple-600" size={16} />;
      default:
        return <Activity className="text-gray-600" size={16} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'pending':
        return <Clock className="text-yellow-600" size={16} />;
      case 'failed':
        return <XCircle className="text-red-600" size={16} />;
      default:
        return <Activity className="text-gray-600" size={16} />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'good':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard Administrativo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Bem-vindo, {user?.name}! Aqui está o resumo do sistema.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Hoje</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mês</option>
              <option value="year">Este Ano</option>
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
              <span>Atualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Usuários
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(stats.totalUsers)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {formatNumber(stats.activeUsers)} ativos
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Receita Total
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                +12.5% vs mês anterior
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Apostas
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(stats.totalBets)}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Prêmios: {formatCurrency(stats.totalWinnings)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Saques Pendentes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.pendingWithdrawals)}
              </p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getHealthColor(stats.systemHealth)}`}>
                <Activity size={12} className="mr-1" />
                Sistema {stats.systemHealth === 'good' ? 'Saudável' : stats.systemHealth === 'warning' ? 'Atenção' : 'Crítico'}
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Atividade Recente
            </h2>
            <Link
              to={ROUTES.ADMIN.USERS}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              Ver todas
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {activity.user}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      {activity.type === 'bet' && 'Fez uma aposta'}
                      {activity.type === 'deposit' && 'Fez um depósito'}
                      {activity.type === 'withdrawal' && 'Solicitou saque'}
                      {activity.type === 'registration' && 'Se cadastrou'}
                      {activity.amount && ` de ${formatCurrency(activity.amount)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(activity.status)}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modality Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance por Modalidade
            </h2>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              <Download size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {modalityStats.map((modality) => (
              <div key={modality.modality} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {modality.modality}
                  </h3>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(modality.revenue)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Apostas</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(modality.totalBets)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Volume</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(modality.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Taxa de Vitória</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {modality.winRate}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Ações Rápidas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to={ROUTES.ADMIN.USERS}
            className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
          >
            <Users className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" size={20} />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Gerenciar Usuários</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ver e editar usuários</p>
            </div>
          </Link>
          
          <Link
            to={ROUTES.ADMIN.DRAWS}
            className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
          >
            <Calendar className="text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" size={20} />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Sorteios</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerenciar sorteios</p>
            </div>
          </Link>
          
          <Link
            to={ROUTES.ADMIN.REPORTS}
            className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
          >
            <BarChart3 className="text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" size={20} />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Relatórios</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Análises e métricas</p>
            </div>
          </Link>
          
          <Link
            to={ROUTES.ADMIN.SETTINGS}
            className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group"
          >
            <Activity className="text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" size={20} />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Configurações</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sistema e parâmetros</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;