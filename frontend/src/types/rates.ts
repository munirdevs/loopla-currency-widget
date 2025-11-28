export interface ExchangeRate {
  currency: string;
  rate: number;
  name: string;
}

export interface RatesResponse {
  success: boolean;
  base: string;
  rates: Record<string, number>;
  timestamp: number;
  lastUpdate: string;
  cached?: boolean;
  error?: string;
}
