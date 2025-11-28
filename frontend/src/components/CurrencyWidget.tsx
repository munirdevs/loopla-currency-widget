'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchRates } from '@/services/ratesApi';
import { ExchangeRate } from '@/types/rates';

const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  CHF: 'Swiss Franc',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
};

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

export default function CurrencyWidget() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isCached, setIsCached] = useState(false);
  const [amount, setAmount] = useState<string>('1');
  const [isReverse, setIsReverse] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  const loadRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchRates();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch rates');
      }

      const ratesArray: ExchangeRate[] = Object.entries(data.rates).map(
        ([currency, rate]) => ({
          currency,
          rate,
          name: CURRENCY_NAMES[currency] || currency,
        })
      );

      setRates(ratesArray);
      setLastUpdate(data.lastUpdate);
      setIsCached(data.cached || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRates();
    const interval = setInterval(loadRates, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadRates]);

  const handleRefresh = () => {
    loadRates();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const calculateConversion = (rate: number): string => {
    const numAmount = parseFloat(amount) || 0;
    if (isReverse) {
      // Convert FROM selected currency TO GBP
      return (numAmount / rate).toFixed(2);
    } else {
      // Convert FROM GBP TO other currencies
      return (numAmount * rate).toFixed(2);
    }
  };

  const getSelectedRate = (): number => {
    const selected = rates.find(r => r.currency === selectedCurrency);
    return selected?.rate || 1;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-0.5">GBP Exchange Rates</h1>
              <p className="text-primary-100 text-xs">1 GBP equals</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all
                       flex items-center gap-1.5 backdrop-blur-sm"
              aria-label="Refresh rates"
            >
              <svg 
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              <span className="text-xs font-medium">Refresh</span>
            </button>
          </div>
          {lastUpdate && (
            <div className="mt-2 text-xs text-primary-100">
              Updated: {new Date(lastUpdate).toLocaleString('en-GB', { 
                day: 'numeric', 
                month: 'short', 
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
              {isCached && <span className="ml-2">• Cached</span>}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-xs font-medium">{error}</p>
            </div>
          )}

          {/* Conversion Calculator */}
          {rates.length > 0 && (
            <div className="mb-5 p-3 sm:p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg border border-primary-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  Currency Converter
                </label>
                <button
                  onClick={() => setIsReverse(!isReverse)}
                  className="px-3 py-1 text-xs font-medium text-primary-700 bg-white 
                           rounded-md hover:bg-primary-100 transition-colors border border-primary-300
                           flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Reverse
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* From */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {isReverse ? 'From Currency' : 'From GBP'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                               min-w-0"
                    />
                    {isReverse && (
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                 bg-white font-semibold w-20 sm:w-auto"
                      >
                        {rates.map((rate) => (
                          <option key={rate.currency} value={rate.currency}>
                            {rate.currency}
                          </option>
                        ))}
                      </select>
                    )}
                    {!isReverse && (
                      <div className="px-2 sm:px-3 py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-lg font-semibold w-16 sm:w-auto text-center">
                        GBP
                      </div>
                    )}
                  </div>
                </div>

                {/* To */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {isReverse ? 'To GBP' : 'To Currency'}
                  </label>
                  <div className="flex gap-2">
                    {isReverse ? (
                      <>
                        <input
                          type="text"
                          value={calculateConversion(getSelectedRate())}
                          readOnly
                          className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg 
                                   bg-gray-50 font-semibold text-gray-700 min-w-0"
                        />
                        <div className="px-2 sm:px-3 py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-lg font-semibold w-16 sm:w-auto text-center">
                          GBP
                        </div>
                      </>
                    ) : (
                      <>
                        <select
                          value={selectedCurrency}
                          onChange={(e) => setSelectedCurrency(e.target.value)}
                          className="px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                   bg-white font-semibold w-20 sm:w-auto"
                        >
                          {rates.map((rate) => (
                            <option key={rate.currency} value={rate.currency}>
                              {rate.currency}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={calculateConversion(getSelectedRate())}
                          readOnly
                          className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg 
                                   bg-gray-50 font-semibold text-gray-700 min-w-0"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && rates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600"></div>
              <p className="mt-3 text-gray-500 text-xs">Loading rates...</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {rates.map((rate) => (
                <div
                  key={rate.currency}
                  className="flex items-center justify-between p-3.5 bg-gray-50 
                           rounded-lg hover:bg-gray-100 transition-all hover:shadow-sm
                           border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 
                                  rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-sm">
                        {rate.currency}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-base">
                        {rate.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {rate.currency}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 tracking-tight">
                      {rate.rate.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-500">
                      per 1 GBP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
