import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Trophy,
  Clock,
  Plus,
  Minus,
  Play,
  History,
  Wallet,
  Bell,
  Calendar,
  Target
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { walletService } from '../../services/walletService';
import { bettingService } from '../../services/bettingService';
import { ROUTES, BETTING_MODALITIES } from '../../types/constants';
import { Bet, Draw, Transaction } from '../../types';

const Dashboard: React.FC = () => {
  const { user, wallet, updateWallet } = useAppStore();
  const [recentBets, setRecentBets] = useState<Bet[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [upcomingDraws, setUpcomingDraws] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBets: 0,
    totalWinnings: 0,
    winRate: 0,
    favoriteModality: 'milhar'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load wallet data
      const walletResponse = await walletService.getBalance();
      updateWallet(walletResponse);

      // Load recent bets
      const betsResponse = await bettingService.getBetHistory(1, 5);
      setRecentBets(betsResponse.bets);

      // Load recent transactions
      const transactionsResponse = await walletService.getTransactions(1, 5);
      setRecentTransactions(transactionsResponse.transactions);

      // Load upcoming draws
      const drawsResponse = await bettingService.getDrawSchedule();
      setUpcomingDraws(drawsResponse.slice(0, 3));

      // Load betting statistics
      const statsResponse = await bettingService.getBettingStats();
      setStats(statsResponse);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
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

  const getModalityName = (modality: string) => {
    return BETTING_MODALITIES[modality as keyof typeof BETTING_MODALITIES]?.name || modality;
  };

  const getBetStatusColor = (status: string) => {
    switch (status) {
      case 'vencedora':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'perdedora':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'ativa':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelada':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600 dark:text-green-400';
      case 'withdrawal':
        return 'text-red-600 dark:text-red-400';
      case 'bet':
        return 'text-blue-600 dark:text-blue-400';
      case 'prize':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Aqui está um resumo da sua atividade de apostas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Balance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Saldo Disponível
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(wallet?.balance || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Wallet className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link
                to={ROUTES.WALLET}
                className="flex-1 bg-green-600 text-white text-center py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Plus size={16} className="inline mr-1" />
                Depositar
              </Link>
              <Link
                to={ROUTES.WALLET}
                className="flex-1 bg-gray-600 text-white text-center py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <Minus size={16} className="inline mr-1" />
                Sacar
              </Link>
            </div>
          </div>

          {/* Total Bets */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Apostas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalBets}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Target className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          {/* Total Winnings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Ganho
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalWinnings)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Trophy className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
          </div>

          {/* Win Rate */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taxa de Acerto
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.winRate.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to={ROUTES.BETTING}
              className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Play className="text-blue-600 dark:text-blue-400 mb-2" size={24} />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Fazer Aposta
              </span>
            </Link>
            
            <Link
              to={ROUTES.WALLET}
              className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <Wallet className="text-green-600 dark:text-green-400 mb-2" size={24} />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Carteira
              </span>
            </Link>
            
            <Link
              to={ROUTES.HISTORY}
              className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <History className="text-purple-600 dark:text-purple-400 mb-2" size={24} />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Histórico
              </span>
            </Link>
            
            <Link
              to={ROUTES.PROFILE}
              className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Bell className="text-gray-600 dark:text-gray-400 mb-2" size={24} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Perfil
              </span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Bets */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Apostas Recentes
              </h2>
              <Link
                to={ROUTES.HISTORY}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                Ver todas
              </Link>
            </div>
            
            {recentBets.length === 0 ? (
              <div className="text-center py-8">
                <Target className="mx-auto text-gray-400 mb-2" size={48} />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhuma aposta realizada ainda
                </p>
                <Link
                  to={ROUTES.BETTING}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium mt-2 inline-block"
                >
                  Fazer primeira aposta
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBets.map((bet) => (
                  <div key={bet.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {getModalityName(bet.modalidade)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBetStatusColor(bet.status)}`}>
                          {bet.status === 'vencedora' ? 'Ganhou' : bet.status === 'perdedora' ? 'Perdeu' : bet.status === 'ativa' ? 'Ativa' : 'Cancelada'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Números: {bet.numeros.join(', ')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(bet.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(bet.valor)}
                      </p>
                      {bet.premio && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          +{formatCurrency(bet.premio)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transações Recentes
              </h2>
              <Link
                to={ROUTES.WALLET}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                Ver todas
              </Link>
            </div>
            
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="mx-auto text-gray-400 mb-2" size={48} />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhuma transação realizada ainda
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {transaction.type === 'deposito' ? 'Depósito' :
                         transaction.type === 'retirada' ? 'Saque' :
                         transaction.type === 'aposta' ? 'Aposta' : 'Prêmio'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getTransactionTypeColor(transaction.type)}`}>
                        {transaction.type === 'retirada' || transaction.type === 'aposta' ? '-' : '+'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Draws */}
        {upcomingDraws.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Próximos Sorteios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingDraws.map((draw) => (
                <div key={draw.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getModalityName(draw.modalidade)}
                    </span>
                    <Calendar className="text-blue-600 dark:text-blue-400" size={16} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Sorteio #{draw.numeroSorteio}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDate(draw.dataExtracao)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;