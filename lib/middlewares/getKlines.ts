import clearDate from "../hooks/clearDate";
import clearNumber from "../hooks/clearNumber";
import convertCurrency from "../hooks/convertCurrency";
import logError from "../hooks/logs";
import { toTimestamp } from "../hooks/toTimestamp";

// Types
type PriceData = {
  prixOuverture: number;
  high: number;
  low: number;
  prixFermeture: number;
  volume: number;
};

type KlineData = {
  dateOuverture: string;
  dateFermeture: string;
  [currency: string]: PriceData | string; // Pour permettre les devises dynamiques
};

const FIAT_CURRENCIES: string[] = ["EUR", "USDC", "USDT"]; // Liste des devises à récupérer

const fetchKlineData = async (
  symbol: string,
  fiat: string,
  startDate: number,
  endDate: number
) => {
  const response = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}${fiat}&interval=1d&startTime=${startDate}&endTime=${endDate}`
  );

  if (!response.ok) {
    logError(
      "getKlines",
      "fetchKlineData",
      `Données non disponibles pour ${symbol}${fiat}`
    );
    return null;
  }

  return await response.json();
};

const getKlines = async (
  crypto: string,
  date: string
): Promise<{ [crypto: string]: KlineData }> => {
  const { startDate, endDate } = toTimestamp(date);
  const symbol = crypto.toUpperCase();
  const pricesByCrypto: { [key: string]: KlineData } = {};

  try {
    for (const fiat of FIAT_CURRENCIES) {
      const data = await fetchKlineData(symbol, fiat, startDate, endDate);
      if (data) {
        data.forEach((item: any) => {
          const cryptoKey = crypto;
          if (!pricesByCrypto[cryptoKey]) {
            pricesByCrypto[cryptoKey] = {
              dateOuverture: clearDate(item[0]),
              dateFermeture: clearDate(item[6]),
            };
          }
          pricesByCrypto[cryptoKey][fiat] = {
            prixOuverture: clearNumber(item[1].toString()),
            high: clearNumber(item[2].toString()),
            low: clearNumber(item[3].toString()),
            prixFermeture: clearNumber(item[4].toString()),
            volume: clearNumber(item[5].toString()),
          };
        });
      }
    }

    // Conversion des devises si nécessaire
    for (const cryptoKey in pricesByCrypto) {
      const entry = pricesByCrypto[cryptoKey];
      for (const fiat of FIAT_CURRENCIES) {
        if (!entry[fiat]) {
          if (entry.EUR) {
            const prixOuverture = await convertCurrency(
              entry.EUR.prixOuverture.toString(),
              "EUR",
              fiat
            );
            const high = await convertCurrency(
              entry.EUR.high.toString(),
              "EUR",
              fiat
            );
            const low = await convertCurrency(
              entry.EUR.low.toString(),
              "EUR",
              fiat
            );
            const prixFermeture = await convertCurrency(
              entry.EUR.prixFermeture.toString(),
              "EUR",
              fiat
            );

            entry[fiat] = {
              prixOuverture: clearNumber(prixOuverture),
              high: clearNumber(high),
              low: clearNumber(low),
              prixFermeture: clearNumber(prixFermeture),
              volume: clearNumber(entry.EUR.volume),
            };
          }
        }
      }
    }

    return pricesByCrypto; // Retourner l'objet directement
  } catch (error) {
    logError(
      "getKlines",
      `Erreur lors de la récupération des klines pour ${crypto}`,
      error
    );
    throw error;
  }
};

export default getKlines;
