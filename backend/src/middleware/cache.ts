import NodeCache from 'node-cache';
import { config } from '../config/api';

const cache = new NodeCache({ 
  stdTTL: config.cacheTTL,
  checkperiod: 60,
  useClones: false
});

export const cacheMiddleware = (key: string) => {
  return (req: any, res: any, next: any) => {
    const cachedData = cache.get(key);
    
    if (cachedData) {
      return res.json({
        ...cachedData,
        cached: true
      });
    }
    
    // Store the original send function
    const originalSend = res.json.bind(res);
    
    res.json = (data: any) => {
      if (res.statusCode === 200) {
        cache.set(key, data);
      }
      return originalSend(data);
    };
    
    next();
  };
};

export const clearCache = (key?: string) => {
  if (key) {
    cache.del(key);
  } else {
    cache.flushAll();
  }
};
