import React, { useState, useEffect } from 'react';
import {
  Target,
  DollarSign,
  Clock,
  Trophy,
  Plus,
  Minus,
  Shuffle,
  Check,
  X,
  Info,
  Calendar
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { bettingService } from '../../services/bettingService';
import { BETTING_MODALITIES } from '../../types/constants';
import { BetRequest, Draw, BettingModality } from '../../types';
import { toast } from 'sonner';

interface BetSlip {
  modality: string;
  numbers: number[];
  amount: number;
}

const Betting: React.FC = () => {
  const { user, wallet, updateWallet } = useAppStore();
  const [selectedModality, setSelectedModality] = useState<string>('milhar');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState<number>(2);
  const [betSlips, setBetSlips] = useState<BetSlip[]>([]);
  const [currentDraw, setCurrentDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState(false);
  const [placingBet, setPlacingBet] = useState(false);

  const modalityConfig = BETTING_MODALITIES[selectedModality as keyof typeof BETTING_MODALITIES];

  useEffect(() => {
    loadCurrentDraw();
  }, [selectedModality]);

  const loadCurrentDraw = async () => {
    try {
      setLoading(true);
      const draw = await bettingService.getCurrentDraw();
      setCurrentDraw(draw);
    } catch (error) {
      console.error('Error loading current draw:', error);
      toast.error('Erro ao carregar sorteio atual');
    } finally {
      setLoading(false);
    }
  };

  const generateRandomNumbers = () => {
    if (!modalityConfig) return;
    
    const numbers: number[] = [];
    const [min, max] = modalityConfig.numberRange;
    const count = modalityConfig.maxNumbers;
    
    while (numbers.length < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    
    setSelectedNumbers(numbers.sort((a, b) => a - b));
  };

  const toggleNumber = (number: number) => {
    const isSelected = selectedNumbers.includes(number);
    
    if (isSelected) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else {
      if (selectedNumbers.length < modalityConfig.maxNumbers) {
        setSelectedNumbers([...selectedNumbers, number].sort((a, b) => a - b));
      } else {
        toast.error(`Você pode selecionar no máximo ${modalityConfig.maxNumbers} números`);
      }
    }
  };

  const addToBetSlip = () => {
    if (!modalityConfig) return;
    
    if (selectedNumbers.length !== modalityConfig.maxNumbers) {
      toast.error(`Selecione exatamente ${modalityConfig.maxNumbers} números`);
      return;
    }

    if (betAmount < modalityConfig.minBet) {
      toast.error(`Valor mínimo da aposta é ${formatCurrency(modalityConfig.minBet)}`);
      return;
    }

    if (betAmount > modalityConfig.maxBet) {
      toast.error(`Valor máximo da aposta é ${formatCurrency(modalityConfig.maxBet)}`);
      return;
    }

    const newBetSlip: BetSlip = {
      modality: selectedModality,
      numbers: [...selectedNumbers],
      amount: betAmount
    };

    setBetSlips([...betSlips, newBetSlip]);
    setSelectedNumbers([]);
    setBetAmount(modalityConfig.minBet);
    toast.success('Aposta adicionada ao bilhete!');
  };

  const removeBetSlip = (index: number) => {
    setBetSlips(betSlips.filter((_, i) => i !== index));
    toast.success('Aposta removida do bilhete!');
  };

  const getTotalAmount = () => {
    return betSlips.reduce((total, slip) => total + slip.amount, 0);
  };

  const placeBets = async () => {
    if (betSlips.length === 0) {
      toast.error('Adicione pelo menos uma aposta ao bilhete');
      return;
    }

    const totalAmount = getTotalAmount();
    if (totalAmount > (wallet?.balance || 0)) {
      toast.error('Saldo insuficiente para realizar as apostas');
      return;
    }

    try {
      setPlacingBet(true);
      
      for (const slip of betSlips) {
        const betRequest: BetRequest = {
          modalidade: slip.modality as BettingModality,
          numeros: slip.numbers,
          valor: slip.amount,
          drawId: currentDraw?.id || ''
        };
        
        const response = await bettingService.placeBet(betRequest);
        if (!response.success) {
          throw new Error('Erro ao realizar aposta');
        }
      }

      // Update wallet balance
      if (wallet) {
        updateWallet({
          ...wallet,
          balance: wallet.balance - totalAmount
        });
      }

      setBetSlips([]);
      toast.success(`${betSlips.length} aposta(s) realizada(s) com sucesso!`);
    } catch (error) {
      console.error('Error placing bets:', error);
      toast.error('Erro ao realizar apostas. Tente novamente.');
    } finally {
      setPlacingBet(false);
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

  const renderNumberGrid = () => {
    if (!modalityConfig) return null;
    
    const numbers = [];
    const [min, max] = modalityConfig.numberRange;
    for (let i = min; i <= max; i++) {
      numbers.push(i);
    }

    return (
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2">
        {numbers.map((number) => {
          const isSelected = selectedNumbers.includes(number);
          return (
            <button
              key={number}
              onClick={() => toggleNumber(number)}
              className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium text-xs sm:text-sm transition-all
                ${isSelected
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              {number.toString().padStart(2, '0')}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Fazer Apostas
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Escolha seus números da sorte e boa sorte!
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-blue-100">Saldo Disponível</p>
            <p className="text-lg sm:text-xl font-bold">
              {formatCurrency(wallet?.balance || 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Betting Panel */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Modality Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Escolha a Modalidade
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {Object.entries(BETTING_MODALITIES).map(([key, modality]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedModality(key);
                    setSelectedNumbers([]);
                  }}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-left
                    ${selectedModality === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }
                  `}
                >
                  <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                    {modality.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {modality.maxNumbers} números
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Min: {formatCurrency(modality.minBet)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Draw Info */}
          {currentDraw && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    Próximo Sorteio - {modalityConfig.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Sorteio #{currentDraw.id}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="flex items-center text-blue-600 dark:text-blue-400">
                    <Calendar size={14} className="mr-1" />
                    <span className="text-xs sm:text-sm font-medium">
                      {formatDate(currentDraw.dataExtracao)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Number Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Escolha seus Números
              </h2>
              <button
                onClick={generateRandomNumbers}
                className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
              >
                <Shuffle size={14} className="mr-1 sm:mr-2" />
                Surpresinha
              </button>
            </div>
            
            <div className="mb-3 sm:mb-4">
              <div className="flex items-start text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Info size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                <span>Selecione {modalityConfig?.maxNumbers || 0} números de {modalityConfig?.numberRange[0].toString().padStart(2, '0') || '00'} a {modalityConfig?.numberRange[1].toString().padStart(2, '0') || '00'}</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Selecionados: {selectedNumbers.length}/{modalityConfig?.maxNumbers || 0}
              </div>
            </div>

            {renderNumberGrid()}

            {/* Selected Numbers Display */}
            {selectedNumbers.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Números Selecionados:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedNumbers.map((number) => (
                    <span
                      key={number}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-sm font-medium"
                    >
                      {number.toString().padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bet Amount */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Valor da Aposta
            </h2>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setBetAmount(Math.max(modalityConfig.minBet, betAmount - 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
              >
                <Minus size={14} />
              </button>
              
              <div className="flex-1">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  min={modalityConfig.minBet}
                  max={modalityConfig.maxBet}
                  step="1"
                  className="w-full px-2 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-medium text-sm sm:text-base"
                />
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {formatCurrency(betAmount)}
                </div>
              </div>
              
              <button
                onClick={() => setBetAmount(Math.min(modalityConfig.maxBet, betAmount + 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <span>Mín: {formatCurrency(modalityConfig.minBet)}</span>
                <span>Máx: {formatCurrency(modalityConfig.maxBet)}</span>
              </div>
            </div>
            
            <button
              onClick={addToBetSlip}
              disabled={!modalityConfig || selectedNumbers.length !== modalityConfig.maxNumbers}
              className="w-full mt-3 sm:mt-4 bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
            >
              Adicionar ao Bilhete
            </button>
          </div>
        </div>

        {/* Bet Slip */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm h-fit">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Bilhete de Apostas
          </h2>
          
          {betSlips.length === 0 ? (
            <div className="text-center py-8">
              <Target className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma aposta no bilhete
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Adicione apostas para continuar
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                {betSlips.map((slip, index) => (
                  <div key={index} className="p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                        {BETTING_MODALITIES[slip.modality as keyof typeof BETTING_MODALITIES].name}
                      </span>
                      <button
                        onClick={() => removeBetSlip(index)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Números: {slip.numbers.map(n => n.toString().padStart(2, '0')).join(', ')}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(slip.amount)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3 sm:pt-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                    {formatCurrency(getTotalAmount())}
                  </span>
                </div>
                
                <button
                  onClick={placeBets}
                  disabled={placingBet || getTotalAmount() > (wallet?.balance || 0)}
                  className="w-full bg-green-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center text-sm sm:text-base"
                >
                  {placingBet ? (
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Check size={16} className="mr-2" />
                  )}
                  {placingBet ? 'Realizando Apostas...' : 'Confirmar Apostas'}
                </button>
                
                {getTotalAmount() > (wallet?.balance || 0) && (
                  <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mt-2 text-center">
                    Saldo insuficiente
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Betting;