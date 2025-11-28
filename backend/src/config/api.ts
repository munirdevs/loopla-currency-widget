import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  apiKey: process.env.EXCHANGE_API_KEY || '',
  apiUrl: process.env.EXCHANGE_API_URL || 'https://v6.exchangerate-api.com/v6',
  cacheTTL: parseInt(process.env.CACHE_TTL || '120', 10),
  nodeEnv: process.env.NODE_ENV || 'development'
};

if (!config.apiKey && config.nodeEnv === 'production') {
  throw new Error('EXCHANGE_API_KEY is required in production');
}
