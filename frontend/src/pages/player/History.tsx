import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  Calendar,
  Filter,
  Search,
  Eye,
  Download,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  DollarSign
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { bettingService } from '../../services/bettingService';
import { Bet } from '../../types';
import { BETTING_MODALITIES } from '../../types/constants';
import { toast } from 'sonner';

type FilterType = 'all' | 'pending' | 'won' | 'lost' | 'cancelled';
type PeriodType = 'today' | 'week' | 'month' | 'year' | 'custom';

const History: React.FC = () => {
  const { user } = useAppStore();
  const [bets, setBets] = useState<Bet[]>([]);
  const [filteredBets, setFilteredBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [periodFilter, setPeriodFilter] = useState<PeriodType>('month');
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [showBetDetails, setShowBetDetails] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  
  // Statistics
  const [stats, setStats] = useState({
    totalBets: 0,
    totalAmount: 0,
    totalWinnings: 0,
    winRate: 0,
    pendingBets: 0
  });

  useEffect(() => {
    loadBettingHistory();
  }, [periodFilter, dateRange]);

  useEffect(() => {
    filterBets();
    calculateStats();
  }, [bets, statusFilter, searchTerm]);

  const loadBettingHistory = async () => {
    try {
      setLoading(true);
      
      let startDate: string | undefined;
      let endDate: string | undefined;
      
      if (periodFilter === 'custom' && dateRange.start && dateRange.end) {
        startDate = dateRange.start;
        endDate = dateRange.end;
      } else if (periodFilter !== 'custom') {
        const now = new Date();
        const start = new Date();
        
        switch (periodFilter) {
          case 'today':
            start.setHours(0, 0, 0, 0);
            break;
          case 'week':
            start.setDate(now.getDate() - 7);
            break;
          case 'month':
            start.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            start.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        startDate = start.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
      }
      
      const response = await bettingService.getBetHistory(1, 100);
      setBets(response.bets);
    } catch (error) {
      console.error('Error loading betting history:', error);
      toast.error('Erro ao carregar histórico de apostas');
    } finally {
      setLoading(false);
    }
  };

  const filterBets = () => {
    let filtered = bets;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bet => bet.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(bet => 
        bet.numbers.some(num => num.toString().includes(searchTerm)) ||
        bet.modality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bet.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBets(filtered);
  };

  const calculateStats = () => {
    const totalBets = filteredBets.length;
    const totalAmount = filteredBets.reduce((sum, bet) => sum + bet.amount, 0);
    const wonBets = filteredBets.filter(bet => bet.status === 'won');
    const totalWinnings = wonBets.reduce((sum, bet) => sum + (bet.prize || 0), 0);
    const winRate = totalBets > 0 ? (wonBets.length / totalBets) * 100 : 0;
    const pendingBets = filteredBets.filter(bet => bet.status === 'pending').length;
    
    setStats({
      totalBets,
      totalAmount,
      totalWinnings,
      winRate,
      pendingBets
    });
  };

  const handleBetClick = (bet: Bet) => {
    setSelectedBet(bet);
    setShowBetDetails(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-600 dark:text-yellow-400" size={20} />;
      case 'won':
        return <CheckCircle className="text-green-600 dark:text-green-400" size={20} />;
      case 'lost':
        return <XCircle className="text-red-600 dark:text-red-400" size={20} />;
      case 'cancelled':
        return <AlertCircle className="text-gray-600 dark:text-gray-400" size={20} />;
      default:
        return <Clock className="text-gray-600 dark:text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'won':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'lost':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'won':
        return 'Ganha';
      case 'lost':
        return 'Perdida';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getModalityConfig = (modality: string) => {
    return BETTING_MODALITIES[modality as keyof typeof BETTING_MODALITIES] || Object.values(BETTING_MODALITIES)[0];
  };

  const exportHistory = () => {
    const csvContent = [
      ['Data', 'Modalidade', 'Números', 'Valor', 'Status', 'Prêmio'].join(','),
      ...filteredBets.map(bet => [
        formatDate(bet.createdAt),
        bet.modality,
        bet.numbers.join('-'),
        bet.amount.toString(),
        getStatusLabel(bet.status),
        (bet.prize || 0).toString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historico-apostas-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Histórico exportado com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <HistoryIcon className="text-blue-600 dark:text-blue-400" size={24} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Histórico de Apostas
            </h1>
          </div>
          <button
            onClick={exportHistory}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalBets}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total de Apostas</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(stats.totalAmount)}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">Valor Apostado</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(stats.totalWinnings)}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Total Ganho</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.winRate.toFixed(1)}%
            </div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Taxa de Acerto</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.pendingBets}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">Pendentes</div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por números, modalidade..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterType)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendentes</option>
            <option value="won">Ganhas</option>
            <option value="lost">Perdidas</option>
            <option value="cancelled">Canceladas</option>
          </select>
          
          {/* Period Filter */}
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value as PeriodType)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="today">Hoje</option>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="year">Último Ano</option>
            <option value="custom">Período Personalizado</option>
          </select>
          
          {/* Custom Date Range */}
          {periodFilter === 'custom' && (
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Betting History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredBets.length === 0 ? (
          <div className="text-center py-12">
            <HistoryIcon className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Nenhuma aposta encontrada
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Tente ajustar os filtros ou fazer uma nova aposta
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredBets.map((bet) => {
              const modalityConfig = getModalityConfig(bet.modality);
              return (
                <div
                  key={bet.id}
                  onClick={() => handleBetClick(bet)}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {modalityConfig.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {modalityConfig.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bet.status)}`}>
                            {getStatusLabel(bet.status)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>Números: {bet.numbers.join(', ')}</span>
                          <span>•</span>
                          <span>{formatDate(bet.createdAt)}</span>
                          <span>•</span>
                          <span>ID: {bet.id.slice(-8).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon(bet.status)}
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(bet.amount)}
                        </span>
                      </div>
                      {bet.status === 'won' && bet.prize && (
                        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                          <Trophy size={14} />
                          <span className="text-sm font-medium">
                            {formatCurrency(bet.prize)}
                          </span>
                        </div>
                      )}
                      {bet.status === 'pending' && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Aguardando resultado
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bet Details Modal */}
      {showBetDetails && selectedBet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Detalhes da Aposta
                </h2>
                <button
                  onClick={() => setShowBetDetails(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">ID da Aposta</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {selectedBet.id.slice(-12).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Modalidade</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getModalityConfig(selectedBet.modality).name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Números Apostados</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedBet.numbers.join(', ')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Valor da Aposta</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(selectedBet.amount)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBet.status)}`}>
                    {getStatusLabel(selectedBet.status)}
                  </span>
                </div>
                
                {selectedBet.status === 'won' && selectedBet.prize && (
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-green-700 dark:text-green-300">Prêmio</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(selectedBet.prize)}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Data da Aposta</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedBet.createdAt)}
                  </span>
                </div>
                
                {selectedBet.drawDate && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Data do Sorteio</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(selectedBet.drawDate)}
                    </span>
                  </div>
                )}
                
                {selectedBet.winningNumbers && selectedBet.winningNumbers.length > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                      Números Sorteados
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedBet.winningNumbers.map((number, index) => (
                        <span
                          key={index}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            selectedBet.numbers.includes(number)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {number.toString().padStart(2, '0')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setShowBetDetails(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;