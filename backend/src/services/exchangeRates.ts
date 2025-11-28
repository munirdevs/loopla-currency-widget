import axios from 'axios';
import { config } from '../config/api';
import { objx } from '../utils/objx';

interface ExchangeRateApiResponse {
  result: string;
  base_code: string;
  conversion_rates: Record<string, number>;
  time_last_update_unix: number;
}

interface RatesData {
  success: boolean;
  base: string;
  rates: Record<string, number>;
  timestamp: number;
  lastUpdate: string;
  cached?: boolean;
}

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'CHF', 'AUD', 'CAD'];

export async function fetchExchangeRates(): Promise<RatesData> {
  try {
    const url = `${config.apiUrl}/${config.apiKey}/latest/GBP`;
    
    const response = await axios.get<ExchangeRateApiResponse>(url, {
      timeout: 5000
    });

    if (response.data.result !== 'success') {
      throw new Error('API returned unsuccessful response');
    }

    const allRates = response.data.conversion_rates;
    const filteredRates: Record<string, number> = {};
    
    SUPPORTED_CURRENCIES.forEach(currency => {
      if (allRates[currency]) {
        filteredRates[currency] = parseFloat(allRates[currency].toFixed(4));
      }
    });

    const currentTime = Date.now();
    
    const result: RatesData = {
      success: true,
      base: 'GBP',
      rates: filteredRates,
      timestamp: currentTime,
      lastUpdate: new Date(currentTime).toISOString(),
      cached: false
    };

    return objx(result);
    
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      
      if (status === 401 || status === 403) {
        throw new Error('Invalid API key. Please check your configuration.');
      }
      
      if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      throw new Error(`Exchange rate API error: ${err.message}`);
    }
    
    if (err instanceof Error) {
      throw err;
    }
    
    throw new Error('An unknown error occurred while fetching exchange rates');
  }
}
