import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  DollarSign,
  Users,
  Target,
  Award,
  Clock,
  PieChart,
  LineChart,
  Activity,
  FileText,
  Eye,
  Settings
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { toast } from 'sonner';
import { BETTING_MODALITIES } from '../../types/constants';

interface ReportData {
  period: string;
  totalRevenue: number;
  totalBets: number;
  totalUsers: number;
  totalWinnings: number;
  averageBetAmount: number;
  winRate: number;
  modalityBreakdown: ModalityData[];
  dailyRevenue: DailyData[];
  userGrowth: UserGrowthData[];
  topWinners: TopWinner[];
}

interface ModalityData {
  modality: string;
  bets: number;
  revenue: number;
  winnings: number;
  participants: number;
}

interface DailyData {
  date: string;
  revenue: number;
  bets: number;
  users: number;
}

interface UserGrowthData {
  date: string;
  newUsers: number;
  activeUsers: number;
  totalUsers: number;
}

interface TopWinner {
  id: string;
  name: string;
  email: string;
  totalWinnings: number;
  totalBets: number;
  winRate: number;
  lastWin: string;
}

type ReportPeriod = '7d' | '30d' | '90d' | '1y' | 'custom';
type ReportType = 'overview' | 'financial' | 'users' | 'modalities' | 'winners';

const Reports: React.FC = () => {
  const { user: currentUser } = useAppStore();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('30d');
  const [reportType, setReportType] = useState<ReportType>('overview');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('all');

  useEffect(() => {
    loadReportData();
  }, [reportPeriod, reportType, selectedModality]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      
      // Mock report data - in a real app, this would be an API call
      const mockReportData: ReportData = {
        period: getPeriodLabel(reportPeriod),
        totalRevenue: 125750.50,
        totalBets: 2847,
        totalUsers: 456,
        totalWinnings: 87525.35,
        averageBetAmount: 44.18,
        winRate: 12.5,
        modalityBreakdown: [
          {
            modality: 'milhar',
            bets: 1245,
            revenue: 62250.00,
            winnings: 43575.00,
            participants: 234
          },
          {
            modality: 'centena',
            bets: 678,
            revenue: 33900.00,
            winnings: 23730.00,
            participants: 156
          },
          {
            modality: 'dezena',
            bets: 456,
            revenue: 22800.00,
            winnings: 15960.00,
            participants: 123
          },
          {
            modality: 'terno',
            bets: 289,
            revenue: 14450.00,
            winnings: 10115.00,
            participants: 89
          },
          {
            modality: 'milhar_pura',
            bets: 123,
            revenue: 6150.00,
            winnings: 4305.00,
            participants: 67
          },
          {
            modality: 'grupo',
            bets: 56,
            revenue: 2800.00,
            winnings: 1960.00,
            participants: 34
          }
        ],
        dailyRevenue: generateDailyData(),
        userGrowth: generateUserGrowthData(),
        topWinners: [
          {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            totalWinnings: 15750.00,
            totalBets: 89,
            winRate: 23.6,
            lastWin: '2024-01-19T15:30:00Z'
          },
          {
            id: '2',
            name: 'Maria Santos',
            email: 'maria@email.com',
            totalWinnings: 12340.00,
            totalBets: 67,
            winRate: 19.4,
            lastWin: '2024-01-18T20:15:00Z'
          },
          {
            id: '3',
            name: 'Pedro Costa',
            email: 'pedro@email.com',
            totalWinnings: 9875.00,
            totalBets: 54,
            winRate: 16.7,
            lastWin: '2024-01-17T18:45:00Z'
          },
          {
            id: '4',
            name: 'Ana Oliveira',
            email: 'ana@email.com',
            totalWinnings: 8650.00,
            totalBets: 43,
            winRate: 14.0,
            lastWin: '2024-01-16T21:20:00Z'
          },
          {
            id: '5',
            name: 'Carlos Lima',
            email: 'carlos@email.com',
            totalWinnings: 7420.00,
            totalBets: 38,
            winRate: 13.2,
            lastWin: '2024-01-15T19:10:00Z'
          }
        ]
      };
      
      setReportData(mockReportData);
    } catch (error) {
      console.error('Error loading report data:', error);
      toast.error('Erro ao carregar dados do relatório');
    } finally {
      setLoading(false);
    }
  };

  const generateDailyData = (): DailyData[] => {
    const data: DailyData[] = [];
    const days = reportPeriod === '7d' ? 7 : reportPeriod === '30d' ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.random() * 5000 + 1000,
        bets: Math.floor(Math.random() * 100) + 20,
        users: Math.floor(Math.random() * 50) + 10
      });
    }
    
    return data;
  };

  const generateUserGrowthData = (): UserGrowthData[] => {
    const data: UserGrowthData[] = [];
    const days = reportPeriod === '7d' ? 7 : reportPeriod === '30d' ? 30 : 90;
    let totalUsers = 400;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const newUsers = Math.floor(Math.random() * 10) + 2;
      totalUsers += newUsers;
      
      data.push({
        date: date.toISOString().split('T')[0],
        newUsers,
        activeUsers: Math.floor(totalUsers * 0.3),
        totalUsers
      });
    }
    
    return data;
  };

  const getPeriodLabel = (period: ReportPeriod): string => {
    const labels = {
      '7d': 'Últimos 7 dias',
      '30d': 'Últimos 30 dias',
      '90d': 'Últimos 90 dias',
      '1y': 'Último ano',
      'custom': 'Período personalizado'
    };
    return labels[period];
  };

  const getModalityName = (modalityId: string): string => {
    const modality = BETTING_MODALITIES[modalityId as keyof typeof BETTING_MODALITIES];
    return modality ? modality.name : modalityId;
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      // In a real app, this would generate and download the report
      toast.success(`Relatório exportado em ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Erro ao exportar relatório');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Nenhum dado encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <BarChart3 className="mr-3 text-blue-600 dark:text-blue-400" size={28} />
              Relatórios e Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {reportData.period}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={loadReportData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Atualizar</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => exportReport('pdf')}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download size={16} />
                <span>PDF</span>
              </button>
              
              <button 
                onClick={() => exportReport('excel')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                <span>Excel</span>
              </button>
              
              <button 
                onClick={() => exportReport('csv')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                <span>CSV</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="overview">Visão Geral</option>
              <option value="financial">Financeiro</option>
              <option value="users">Usuários</option>
              <option value="modalities">Modalidades</option>
              <option value="winners">Ganhadores</option>
            </select>
            
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value as ReportPeriod)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
              <option value="custom">Personalizado</option>
            </select>
            
            {reportPeriod === 'custom' && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-500 dark:text-gray-400">até</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            
            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as Modalidades</option>
              {BETTING_MODALITIES.map(modality => (
                <option key={modality.id} value={modality.id}>
                  {modality.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Receita Total</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(reportData.totalRevenue)}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +12.5% vs período anterior
              </p>
            </div>
            <DollarSign className="text-green-600 dark:text-green-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Apostas</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(reportData.totalBets)}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +8.3% vs período anterior
              </p>
            </div>
            <Target className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usuários Ativos</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatNumber(reportData.totalUsers)}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +15.7% vs período anterior
              </p>
            </div>
            <Users className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taxa de Vitória</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatPercentage(reportData.winRate)}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                <TrendingDown size={12} className="mr-1" />
                -2.1% vs período anterior
              </p>
            </div>
            <Award className="text-orange-600 dark:text-orange-400" size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <LineChart className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
              Receita Diária
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Média:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(reportData.totalRevenue / reportData.dailyRevenue.length)}
              </span>
            </div>
          </div>
          
          {/* Simple chart representation */}
          <div className="space-y-2">
            {reportData.dailyRevenue.slice(-7).map((day, index) => {
              const maxRevenue = Math.max(...reportData.dailyRevenue.map(d => d.revenue));
              const width = (day.revenue / maxRevenue) * 100;
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-16">
                    {new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white w-20 text-right">
                    {formatCurrency(day.revenue)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Modality Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <PieChart className="mr-2 text-green-600 dark:text-green-400" size={20} />
              Modalidades
            </h3>
          </div>
          
          <div className="space-y-3">
            {reportData.modalityBreakdown.map((modality, index) => {
              const percentage = (modality.revenue / reportData.totalRevenue) * 100;
              const colors = [
                'bg-blue-500',
                'bg-green-500',
                'bg-purple-500',
                'bg-yellow-500',
                'bg-red-500',
                'bg-indigo-500'
              ];
              
              return (
                <div key={modality.modality} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {getModalityName(modality.modality)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(modality.revenue)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatPercentage(percentage)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modality Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Activity className="mr-2 text-purple-600 dark:text-purple-400" size={20} />
              Performance por Modalidade
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Modalidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Apostas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Receita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Margem
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reportData.modalityBreakdown.map((modality) => {
                  const margin = ((modality.revenue - modality.winnings) / modality.revenue) * 100;
                  
                  return (
                    <tr key={modality.modality} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {getModalityName(modality.modality)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <p className="font-medium">{formatNumber(modality.bets)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {modality.participants} jogadores
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(modality.revenue)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          margin > 30 ? 'text-green-600 dark:text-green-400' :
                          margin > 20 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {formatPercentage(margin)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Top Winners */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Award className="mr-2 text-yellow-600 dark:text-yellow-400" size={20} />
              Maiores Ganhadores
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Jogador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ganhos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Taxa
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reportData.topWinners.map((winner, index) => (
                  <tr key={winner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          #{index + 1}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {winner.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {winner.totalBets} apostas
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <p className="font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(winner.totalWinnings)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Último: {formatDateTime(winner.lastWin)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        winner.winRate > 20 ? 'text-green-600 dark:text-green-400' :
                        winner.winRate > 15 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {formatPercentage(winner.winRate)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
          Métricas Adicionais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(reportData.averageBetAmount)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Valor Médio por Aposta</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(reportData.totalWinnings)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Pago em Prêmios</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(reportData.totalRevenue - reportData.totalWinnings)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Margem Bruta</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;