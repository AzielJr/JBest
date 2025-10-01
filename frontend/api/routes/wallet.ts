import express, { Request, Response } from 'express';

const router = express.Router();

// Mock wallet balance
let mockBalance = 100.00;

// Get wallet balance
router.get('/balance', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      balance: mockBalance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get wallet balance'
    });
  }
});

// Add funds to wallet
router.post('/deposit', (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
      });
    }
    
    mockBalance += parseFloat(amount);
    
    res.json({
      success: true,
      balance: mockBalance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to deposit funds'
    });
  }
});

// Withdraw funds from wallet
router.post('/withdraw', (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
      });
    }
    
    if (amount > mockBalance) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient funds'
      });
    }
    
    mockBalance -= parseFloat(amount);
    
    res.json({
      success: true,
      balance: mockBalance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to withdraw funds'
    });
  }
});

export default router;