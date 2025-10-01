import express, { Request, Response } from 'express';

const router = express.Router();

// Mock current draw data
const mockCurrentDraw = {
  id: '1',
  date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  status: 'open',
  closingTime: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
  drawTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
};

// Get current draw
router.get('/current', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      draw: mockCurrentDraw
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get current draw'
    });
  }
});

// Get draw results
router.get('/results/:drawId', (req: Request, res: Response) => {
  try {
    const { drawId } = req.params;
    
    res.json({
      success: true,
      result: {
        id: drawId,
        numbers: [1234, 567, 89, 123],
        date: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get draw results'
    });
  }
});

// Get draw schedule
router.get('/schedule', (req: Request, res: Response) => {
  try {
    const schedule = [];
    const now = new Date();
    
    // Generate next 7 days of draws
    for (let i = 0; i < 7; i++) {
      const drawDate = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
      schedule.push({
        id: `draw-${i + 1}`,
        date: drawDate.toISOString(),
        status: i === 0 ? 'open' : 'scheduled'
      });
    }
    
    res.json({
      success: true,
      schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get draw schedule'
    });
  }
});

export default router;