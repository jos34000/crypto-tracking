import { BINANCE_API_BASE_URL } from "@/constants/currencies";

export const fetchBinancePrice = async (symbol: string): Promise<number> => {
  const response = await fetch(
    `${BINANCE_API_BASE_URL}/ticker/price?symbol=${symbol}`
  );

  if (!response.ok) {
    throw new Error(`Impossible de récupérer le prix pour ${symbol}`);
  }

  const data = await response.json();
  return Number(data.price);
};

export const fetchKlineData = async (
  symbol: string,
  fiat: string,
  startDate: number,
  endDate: number
) => {
  const response = await fetch(
    `${BINANCE_API_BASE_URL}/klines?symbol=${symbol}${fiat}&interval=1d&startTime=${startDate}&endTime=${endDate}`
  );

  if (!response.ok) {
    throw new Error(`Données non disponibles pour ${symbol}${fiat}`);
  }

  return await response.json();
};
