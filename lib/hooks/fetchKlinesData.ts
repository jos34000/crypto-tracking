import { BINANCE_API_BASE_URL } from "@/constants/currencies";
import logError from "@/hooks/logs";

const fileName = "fetchKlinesData";

const fetchKlineData = async (
  symbol: string,
  fiat: string,
  startDate: number,
  endDate: number
) => {
  try {
    const response = await fetch(
      `${BINANCE_API_BASE_URL}/klines?symbol=${symbol}${fiat}&interval=1d&startTime=${startDate}&endTime=${endDate}`
    );
    console.log(response);

    if (!response.ok) {
      throw new Error(`Données non disponibles pour ${symbol}${fiat}`);
    }

    return await response.json();
  } catch (error) {
    logError(fileName, "fetchKlineData", error);
    throw error;
  }
};

export default fetchKlineData;
