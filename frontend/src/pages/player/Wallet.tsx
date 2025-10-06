import React, { useState, useEffect } from 'react';
import {
  Wallet as WalletIcon,
  Plus,
  Minus,
  CreditCard,
  Smartphone,
  Building2,
  History,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { walletService } from '../../services/walletService';
import { Transaction } from '../../types';
import { toast } from 'sonner';

type TabType = 'overview' | 'deposit' | 'withdraw' | 'history';
type PaymentMethod = 'pix' | 'credit_card' | 'bank_transfer';
type TransactionFilter = 'all' | 'deposito' | 'retirada' | 'aposta' | 'premio';

const Wallet: React.FC = () => {
  const { user, wallet, updateWallet } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<TransactionFilter>('all');
  const [showBalance, setShowBalance] = useState(true);
  const [copiedPix, setCopiedPix] = useState(false);
  
  // Deposit form
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositMethod, setDepositMethod] = useState<PaymentMethod>('pix');
  const [depositLoading, setDepositLoading] = useState(false);
  
  // Withdraw form
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawMethod, setWithdrawMethod] = useState<PaymentMethod>('pix');
  const [pixKey, setPixKey] = useState<string>('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  
  // Statistics
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalBets: 0,
    totalWinnings: 0,
    netBalance: 0
  });

  useEffect(() => {
    loadWalletData();
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, transactionFilter]);

  const loadWalletData = async () => {
    try {
      const response = await walletService.getBalance();
      if (response) {
        updateWallet(response);
      }
      
      const statsResponse = await walletService.getStats();
      if (statsResponse) {
        setStats(statsResponse);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await walletService.getTransactions(1, 50);
      if (response) {
        setTransactions(response.transactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Erro ao carregar histórico de transações');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    if (transactionFilter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.type === transactionFilter));
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    
    if (!amount || amount <= 0) {
      toast.error('Digite um valor válido para depósito');
      return;
    }
    
    if (amount < 10) {
      toast.error('Valor mínimo para depósito é R$ 10,00');
      return;
    }
    
    if (amount > 10000) {
      toast.error('Valor máximo para depósito é R$ 10.000,00');
      return;
    }

    try {
      setDepositLoading(true);
      const response = await walletService.deposit(amount, depositMethod);
      
      if (response) {
        toast.success('Depósito realizado com sucesso!');
        setDepositAmount('');
        loadWalletData();
        loadTransactions();
        setActiveTab('overview');
      }
    } catch (error) {
      console.error('Error making deposit:', error);
      toast.error('Erro ao realizar depósito. Tente novamente.');
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) {
      toast.error('Digite um valor válido para saque');
      return;
    }
    
    if (amount < 20) {
      toast.error('Valor mínimo para saque é R$ 20,00');
      return;
    }
    
    if (amount > (wallet?.balance || 0)) {
      toast.error('Saldo insuficiente para saque');
      return;
    }
    
    if (withdrawMethod === 'pix' && !pixKey) {
      toast.error('Digite uma chave PIX válida');
      return;
    }

    try {
      setWithdrawLoading(true);
      const response = await walletService.withdraw(amount, {
        method: withdrawMethod,
        pixKey: withdrawMethod === 'pix' ? pixKey : undefined
      });
      
      if (response) {
        toast.success('Solicitação de saque enviada com sucesso!');
        setWithdrawAmount('');
        setPixKey('');
        loadWalletData();
        loadTransactions();
        setActiveTab('overview');
      }
    } catch (error) {
      console.error('Error making withdrawal:', error);
      toast.error('Erro ao solicitar saque. Tente novamente.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const copyPixKey = () => {
    const pixKey = 'pix@jbest.com.br';
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    toast.success('Chave PIX copiada!');
    setTimeout(() => setCopiedPix(false), 2000);
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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposito':
        return <TrendingUp className="text-green-600 dark:text-green-400" size={20} />;
      case 'retirada':
        return <TrendingDown className="text-red-600 dark:text-red-400" size={20} />;
      case 'aposta':
        return <DollarSign className="text-blue-600 dark:text-blue-400" size={20} />;
      case 'premio':
        return <TrendingUp className="text-purple-600 dark:text-purple-400" size={20} />;
      default:
        return <DollarSign className="text-gray-600 dark:text-gray-400" size={20} />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposito':
      case 'premio':
        return 'text-green-600 dark:text-green-400';
      case 'retirada':
      case 'aposta':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Depósito';
      case 'withdrawal':
        return 'Saque';
      case 'bet':
        return 'Aposta';
      case 'prize':
        return 'Prêmio';
      default:
        return type;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Saldo da Carteira</h2>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-blue-100 hover:text-white transition-colors"
          >
            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="text-3xl font-bold mb-2">
          {showBalance ? formatCurrency(wallet?.balance || 0) : '••••••'}
        </div>
        <p className="text-blue-100">Disponível para apostas</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('deposit')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <Plus className="text-green-600 dark:text-green-400" size={24} />
            <span className="text-2xl">💰</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Depositar</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Adicionar fundos</p>
        </button>
        
        <button
          onClick={() => setActiveTab('withdraw')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <Minus className="text-red-600 dark:text-red-400" size={24} />
            <span className="text-2xl">🏦</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Sacar</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Retirar fundos</p>
        </button>
      </div>

      {/* Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Estatísticas do Mês
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(stats.totalDeposits)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Depósitos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(stats.totalWithdrawals)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Saques</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(stats.totalBets)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Apostas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(stats.totalWinnings)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Prêmios</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeposit = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Fazer Depósito
        </h2>
        
        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Método de Pagamento
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setDepositMethod('pix')}
              className={`p-4 border-2 rounded-lg transition-all ${
                depositMethod === 'pix'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <Smartphone className="mx-auto mb-2 text-blue-600 dark:text-blue-400" size={24} />
              <div className="font-medium text-gray-900 dark:text-white">PIX</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Instantâneo</div>
            </button>
            
            <button
              onClick={() => setDepositMethod('credit_card')}
              className={`p-4 border-2 rounded-lg transition-all ${
                depositMethod === 'credit_card'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <CreditCard className="mx-auto mb-2 text-green-600 dark:text-green-400" size={24} />
              <div className="font-medium text-gray-900 dark:text-white">Cartão</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Crédito/Débito</div>
            </button>
            
            <button
              onClick={() => setDepositMethod('bank_transfer')}
              className={`p-4 border-2 rounded-lg transition-all ${
                depositMethod === 'bank_transfer'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <Building2 className="mx-auto mb-2 text-purple-600 dark:text-purple-400" size={24} />
              <div className="font-medium text-gray-900 dark:text-white">TED/DOC</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">1-2 dias úteis</div>
            </button>
          </div>
        </div>
        
        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valor do Depósito
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              R$
            </span>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0,00"
              min="10"
              max="10000"
              step="0.01"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Valor mínimo: R$ 10,00 | Valor máximo: R$ 10.000,00
          </p>
        </div>
        
        {/* PIX Instructions */}
        {depositMethod === 'pix' && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Instruções PIX
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Use a chave PIX abaixo para fazer o depósito:
            </p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded text-sm">
                pix@jbest.com.br
              </code>
              <button
                onClick={copyPixKey}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {copiedPix ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        )}
        
        <button
          onClick={handleDeposit}
          disabled={depositLoading || !depositAmount || parseFloat(depositAmount) < 10}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
        >
          {depositLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          ) : (
            <Plus size={20} className="mr-2" />
          )}
          {depositLoading ? 'Processando...' : 'Confirmar Depósito'}
        </button>
      </div>
    </div>
  );

  const renderWithdraw = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Solicitar Saque
        </h2>
        
        {/* Available Balance */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Saldo Disponível</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(wallet?.balance || 0)}
          </div>
        </div>
        
        {/* Withdraw Method */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Método de Saque
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setWithdrawMethod('pix')}
              className={`p-4 border-2 rounded-lg transition-all ${
                withdrawMethod === 'pix'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <Smartphone className="mx-auto mb-2 text-blue-600 dark:text-blue-400" size={24} />
              <div className="font-medium text-gray-900 dark:text-white">PIX</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Até 1 hora</div>
            </button>
            
            <button
              onClick={() => setWithdrawMethod('bank_transfer')}
              className={`p-4 border-2 rounded-lg transition-all ${
                withdrawMethod === 'bank_transfer'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <Building2 className="mx-auto mb-2 text-purple-600 dark:text-purple-400" size={24} />
              <div className="font-medium text-gray-900 dark:text-white">Transferência</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">1-2 dias úteis</div>
            </button>
          </div>
        </div>
        
        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valor do Saque
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              R$
            </span>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0,00"
              min="20"
              max={wallet?.balance || 0}
              step="0.01"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Valor mínimo: R$ 20,00 | Disponível: {formatCurrency(wallet?.balance || 0)}
          </p>
        </div>
        
        {/* PIX Key Input */}
        {withdrawMethod === 'pix' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chave PIX
            </label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="Digite sua chave PIX (CPF, e-mail, telefone ou chave aleatória)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        )}
        
        <button
          onClick={handleWithdraw}
          disabled={withdrawLoading || !withdrawAmount || parseFloat(withdrawAmount) < 20 || parseFloat(withdrawAmount) > (wallet?.balance || 0) || (withdrawMethod === 'pix' && !pixKey)}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
        >
          {withdrawLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          ) : (
            <Minus size={20} className="mr-2" />
          )}
          {withdrawLoading ? 'Processando...' : 'Solicitar Saque'}
        </button>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Histórico de Transações
          </h2>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={transactionFilter}
              onChange={(e) => setTransactionFilter(e.target.value as TransactionFilter)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Todas</option>
              <option value="deposit">Depósitos</option>
              <option value="withdrawal">Saques</option>
              <option value="bet">Apostas</option>
              <option value="prize">Prêmios</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <History className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500 dark:text-gray-400">
              {transactionFilter === 'all' ? 'Nenhuma transação encontrada' : `Nenhuma transação do tipo "${getTransactionLabel(transactionFilter)}" encontrada`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {getTransactionLabel(transaction.type)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${getTransactionColor(transaction.type)}`}>
                    {(transaction.type === 'retirada' || transaction.type === 'aposta') ? '-' : '+'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'aprovado' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    transaction.status === 'pendente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {transaction.status === 'aprovado' ? 'Concluída' :
                     transaction.status === 'pendente' ? 'Pendente' : 'Cancelada'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <WalletIcon className="text-blue-600 dark:text-blue-400" size={24} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Carteira
          </h1>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Visão Geral', icon: WalletIcon },
            { id: 'deposit', label: 'Depositar', icon: Plus },
            { id: 'withdraw', label: 'Sacar', icon: Minus },
            { id: 'history', label: 'Histórico', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={16} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'deposit' && renderDeposit()}
      {activeTab === 'withdraw' && renderWithdraw()}
      {activeTab === 'history' && renderHistory()}
    </div>
  );
};

export default Wallet;