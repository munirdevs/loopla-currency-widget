import { RatesResponse } from '@/types/rates';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchRates(): Promise<RatesResponse> {
  const response = await fetch(`${API_URL}/api/rates`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
