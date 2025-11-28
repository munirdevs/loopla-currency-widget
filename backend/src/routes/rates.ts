import { Router, Request, Response } from 'express';
import { fetchExchangeRates } from '../services/exchangeRates';
import { cacheMiddleware, clearCache } from '../middleware/cache';

const router = Router();

router.get('/rates', cacheMiddleware('exchange-rates'), async (req: Request, res: Response) => {
  try {
    const rates = await fetchExchangeRates();
    res.json(rates);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to fetch exchange rates';
    
    res.status(500).json({
      success: false,
      error: message
    });
  }
});

router.post('/rates/refresh', (req: Request, res: Response) => {
  clearCache('exchange-rates');
  res.json({ success: true, message: 'Cache cleared' });
});

export default router;
