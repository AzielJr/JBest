import express, { Request, Response } from 'express';

const router = express.Router();

// Mock data for development
const mockBets = [
  {
    id: '1',
    modality: 'milhar',
    numbers: [1234],
    amount: 10.00,
    status: 'pending',
    createdAt: new Date().toISOString(),
    drawDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    prize: null
  },
  {
    id: '2',
    modality: 'centena',
    numbers: [123],
    amount: 5.00,
    status: 'won',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    drawDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    prize: 50.00
  }
];

// Get betting history
router.get('/history', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      bets: mockBets,
      total: mockBets.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get betting history'
    });
  }
});

// Place a bet
router.post('/', (req: Request, res: Response) => {
  try {
    const { modality, numbers, amount } = req.body;
    
    const newBet = {
      id: Date.now().toString(),
      modality,
      numbers,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      drawDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      prize: null
    };
    
    mockBets.push(newBet);
    
    res.json({
      success: true,
      bet: newBet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to place bet'
    });
  }
});

// Get current draw
router.get('/current-draw', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      draw: {
        id: '1',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'open'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get current draw'
    });
  }
});

export default router;