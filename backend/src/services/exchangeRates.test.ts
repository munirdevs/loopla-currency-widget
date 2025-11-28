import { fetchExchangeRates } from './exchangeRates';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Exchange Rates Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and format exchange rates correctly', async () => {
    const mockResponse = {
      data: {
        result: 'success',
        base_code: 'GBP',
        conversion_rates: {
          USD: 1.27,
          EUR: 1.17,
          CHF: 1.13,
          AUD: 1.95,
          CAD: 1.76
        },
        time_last_update_unix: 1700000000
      }
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await fetchExchangeRates();

    expect(result.success).toBe(true);
    expect(result.base).toBe('GBP');
    expect(result.rates).toHaveProperty('USD');
    expect(result.rates).toHaveProperty('EUR');
    expect(typeof result.timestamp).toBe('number');
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    await expect(fetchExchangeRates()).rejects.toThrow();
  });
});
