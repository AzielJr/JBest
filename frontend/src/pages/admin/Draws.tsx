import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Play,
  Pause,
  Square,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  Hash,
  Timer,
  Settings
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { toast } from 'sonner';
import { BETTING_MODALITIES } from '../../types/constants';

interface Draw {
  id: string;
  modality: string;
  drawNumber: number;
  scheduledTime: string;
  actualTime?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  winningNumbers: number[];
  totalBets: number;
  totalAmount: number;
  totalPrize: number;
  winners: number;
  participants: number;
}

type FilterType = 'all' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
type SortField = 'drawNumber' | 'scheduledTime' | 'totalBets' | 'totalAmount' | 'participants';
type SortOrder = 'asc' | 'desc';

const Draws: React.FC = () => {
  const { user: currentUser } = useAppStore();
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [modalityFilter, setModalityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('scheduledTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawsPerPage] = useState(10);

  useEffect(() => {
    loadDraws();
  }, []);

  const loadDraws = async () => {
    try {
      setLoading(true);
      
      // Mock draws data - in a real app, this would be an API call
      const mockDraws: Draw[] = [
        {
          id: '1',
          modality: 'milhar',
          drawNumber: 1001,
          scheduledTime: '2024-01-20T20:00:00Z',
          actualTime: '2024-01-20T20:02:15Z',
          status: 'completed',
          winningNumbers: [1, 2, 3, 4],
          totalBets: 245,
          totalAmount: 12250.00,
          totalPrize: 8575.00,
          winners: 3,
          participants: 189
        },
        {
          id: '2',
          modality: 'centena',
          drawNumber: 2001,
          scheduledTime: '2024-01-20T21:00:00Z',
          status: 'in_progress',
          winningNumbers: [],
          totalBets: 156,
          totalAmount: 7800.00,
          totalPrize: 5460.00,
          winners: 0,
          participants: 134
        },
        {
          id: '3',
          modality: 'dezena',
          drawNumber: 3001,
          scheduledTime: '2024-01-20T22:00:00Z',
          status: 'scheduled',
          winningNumbers: [],
          totalBets: 89,
          totalAmount: 4450.00,
          totalPrize: 3115.00,
          winners: 0,
          participants: 76
        },
        {
          id: '4',
          modality: 'terno',
          drawNumber: 4001,
          scheduledTime: '2024-01-19T20:00:00Z',
          actualTime: '2024-01-19T20:01:30Z',
          status: 'completed',
          winningNumbers: [5, 8, 9],
          totalBets: 178,
          totalAmount: 8900.00,
          totalPrize: 6230.00,
          winners: 2,
          participants: 145
        },
        {
          id: '5',
          modality: 'milhar_pura',
          drawNumber: 5001,
          scheduledTime: '2024-01-19T19:00:00Z',
          status: 'cancelled',
          winningNumbers: [],
          totalBets: 45,
          totalAmount: 2250.00,
          totalPrize: 0,
          winners: 0,
          participants: 38
        }
      ];
      
      setDraws(mockDraws);
    } catch (error) {
      console.error('Error loading draws:', error);
      toast.error('Erro ao carregar sorteios');
    } finally {
      setLoading(false);
    }
  };

  const filteredDraws = draws.filter(draw => {
    const matchesSearch = draw.drawNumber.toString().includes(searchTerm) ||
                         getModalityName(draw.modality).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || draw.status === filterType;
    const matchesModality = modalityFilter === 'all' || draw.modality === modalityFilter;
    
    return matchesSearch && matchesFilter && matchesModality;
  });

  const sortedDraws = [...filteredDraws].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    if (sortField === 'scheduledTime') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastDraw = currentPage * drawsPerPage;
  const indexOfFirstDraw = indexOfLastDraw - drawsPerPage;
  const currentDraws = sortedDraws.slice(indexOfFirstDraw, indexOfLastDraw);
  const totalPages = Math.ceil(sortedDraws.length / drawsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDrawAction = async (drawId: string, action: 'start' | 'pause' | 'complete' | 'cancel') => {
    try {
      // In a real app, this would be an API call
      const updatedDraws = draws.map(draw => {
        if (draw.id === drawId) {
          switch (action) {
            case 'start':
              return { ...draw, status: 'in_progress' as const };
            case 'pause':
              return { ...draw, status: 'scheduled' as const };
            case 'complete':
              return { 
                ...draw, 
                status: 'completed' as const,
                actualTime: new Date().toISOString(),
                winningNumbers: generateRandomNumbers(draw.modality)
              };
            case 'cancel':
              return { ...draw, status: 'cancelled' as const };
            default:
              return draw;
          }
        }
        return draw;
      });
      
      setDraws(updatedDraws);
      
      const actionLabels = {
        start: 'iniciado',
        pause: 'pausado',
        complete: 'finalizado',
        cancel: 'cancelado'
      };
      
      toast.success(`Sorteio ${actionLabels[action]} com sucesso!`);
    } catch (error) {
      console.error('Error updating draw:', error);
      toast.error('Erro ao atualizar sorteio');
    }
  };

  const generateRandomNumbers = (modality: string): number[] => {
    const modalityConfig = BETTING_MODALITIES[modality as keyof typeof BETTING_MODALITIES];
    if (!modalityConfig) return [];
    
    const numbers: number[] = [];
    for (let i = 0; i < modalityConfig.numbersCount; i++) {
      let num;
      do {
        num = Math.floor(Math.random() * modalityConfig.maxNumber) + 1;
      } while (numbers.includes(num));
      numbers.push(num);
    }
    
    return numbers.sort((a, b) => a - b);
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', label: 'Agendado', icon: Clock },
      in_progress: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', label: 'Em Andamento', icon: Play },
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', label: 'Finalizado', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Cancelado', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="mr-1" size={12} />
        {config.label}
      </span>
    );
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Calendar className="mr-3 text-blue-600 dark:text-blue-400" size={28} />
              Gerenciar Sorteios
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {sortedDraws.length} sorteios encontrados
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={loadDraws}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Atualizar</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download size={16} />
              <span>Exportar</span>
            </button>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>Novo Sorteio</span>
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar sorteios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-64"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="scheduled">Agendados</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Finalizados</option>
              <option value="cancelled">Cancelados</option>
            </select>
            
            <select
              value={modalityFilter}
              onChange={(e) => setModalityFilter(e.target.value)}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Agendados</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {draws.filter(d => d.status === 'scheduled').length}
              </p>
            </div>
            <Clock className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Andamento</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {draws.filter(d => d.status === 'in_progress').length}
              </p>
            </div>
            <Play className="text-yellow-600 dark:text-yellow-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Finalizados</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {draws.filter(d => d.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Arrecadado</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(draws.reduce((sum, draw) => sum + draw.totalAmount, 0))}
              </p>
            </div>
            <DollarSign className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
        </div>
      </div>

      {/* Draws Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('drawNumber')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Sorteio</span>
                    {sortField === 'drawNumber' && (
                      <span className="text-blue-600 dark:text-blue-400">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Modalidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('scheduledTime')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Data/Hora</span>
                    {sortField === 'scheduledTime' && (
                      <span className="text-blue-600 dark:text-blue-400">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Números
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('participants')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Participantes</span>
                    {sortField === 'participants' && (
                      <span className="text-blue-600 dark:text-blue-400">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Arrecadação</span>
                    {sortField === 'totalAmount' && (
                      <span className="text-blue-600 dark:text-blue-400">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentDraws.map((draw) => (
                <tr key={draw.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        #{draw.drawNumber}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Sorteio #{draw.drawNumber}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {draw.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {getModalityName(draw.modality)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(draw.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div>
                      <p className="font-medium">Agendado: {formatDateTime(draw.scheduledTime)}</p>
                      {draw.actualTime && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Realizado: {formatDateTime(draw.actualTime)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {draw.winningNumbers.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {draw.winningNumbers.map((number, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-bold"
                          >
                            {number}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-sm">Aguardando sorteio</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-1">
                        <Users size={14} className="text-gray-400" />
                        <span>{draw.participants} jogadores</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Hash size={14} className="text-gray-400" />
                        <span>{draw.totalBets} apostas</span>
                      </div>
                      {draw.winners > 0 && (
                        <div className="flex items-center space-x-1 mt-1">
                          <CheckCircle size={14} className="text-green-500" />
                          <span className="text-green-600 dark:text-green-400">{draw.winners} ganhadores</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <p className="font-medium">{formatCurrency(draw.totalAmount)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Prêmio: {formatCurrency(draw.totalPrize)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedDraw(draw);
                          setShowDrawModal(true);
                        }}
                        className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        title="Ver detalhes"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {draw.status === 'scheduled' && (
                        <button
                          onClick={() => handleDrawAction(draw.id, 'start')}
                          className="p-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                          title="Iniciar sorteio"
                        >
                          <Play size={16} />
                        </button>
                      )}
                      
                      {draw.status === 'in_progress' && (
                        <>
                          <button
                            onClick={() => handleDrawAction(draw.id, 'complete')}
                            className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            title="Finalizar sorteio"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleDrawAction(draw.id, 'pause')}
                            className="p-1 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300"
                            title="Pausar sorteio"
                          >
                            <Pause size={16} />
                          </button>
                        </>
                      )}
                      
                      {(draw.status === 'scheduled' || draw.status === 'in_progress') && (
                        <button
                          onClick={() => handleDrawAction(draw.id, 'cancel')}
                          className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          title="Cancelar sorteio"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      
                      <button
                        className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                        title="Editar"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando {indexOfFirstDraw + 1} a {Math.min(indexOfLastDraw, sortedDraws.length)} de {sortedDraws.length} sorteios
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Draw Details Modal */}
      {showDrawModal && selectedDraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Detalhes do Sorteio #{selectedDraw.drawNumber}
              </h2>
              <button
                onClick={() => setShowDrawModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Informações Básicas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Modalidade:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{getModalityName(selectedDraw.modality)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      {getStatusBadge(selectedDraw.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Agendado para:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatDateTime(selectedDraw.scheduledTime)}</span>
                    </div>
                    {selectedDraw.actualTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Realizado em:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatDateTime(selectedDraw.actualTime)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Winning Numbers */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Números Sorteados</h3>
                  {selectedDraw.winningNumbers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedDraw.winningNumbers.map((number, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-lg font-bold"
                        >
                          {number}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Aguardando realização do sorteio</p>
                  )}
                </div>
              </div>
              
              {/* Statistics */}
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Estatísticas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedDraw.participants}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Participantes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedDraw.totalBets}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total de Apostas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedDraw.winners}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Ganhadores</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {selectedDraw.totalBets > 0 ? ((selectedDraw.winners / selectedDraw.totalBets) * 100).toFixed(1) : 0}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Acerto</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Valores</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Arrecadado:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(selectedDraw.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total em Prêmios:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(selectedDraw.totalPrize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Margem da Casa:</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {formatCurrency(selectedDraw.totalAmount - selectedDraw.totalPrize)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600 mt-6">
              {selectedDraw.status === 'scheduled' && (
                <button 
                  onClick={() => {
                    handleDrawAction(selectedDraw.id, 'start');
                    setShowDrawModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Play size={16} />
                  <span>Iniciar Sorteio</span>
                </button>
              )}
              
              {selectedDraw.status === 'in_progress' && (
                <>
                  <button 
                    onClick={() => {
                      handleDrawAction(selectedDraw.id, 'complete');
                      setShowDrawModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle size={16} />
                    <span>Finalizar</span>
                  </button>
                  <button 
                    onClick={() => {
                      handleDrawAction(selectedDraw.id, 'pause');
                      setShowDrawModal(false);
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                  >
                    <Pause size={16} />
                    <span>Pausar</span>
                  </button>
                </>
              )}
              
              {(selectedDraw.status === 'scheduled' || selectedDraw.status === 'in_progress') && (
                <button 
                  onClick={() => {
                    handleDrawAction(selectedDraw.id, 'cancel');
                    setShowDrawModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <XCircle size={16} />
                  <span>Cancelar</span>
                </button>
              )}
              
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Draws;