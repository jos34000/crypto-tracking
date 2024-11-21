import clearDate from "@/hooks/clearDate";
import clearNumber from "@/hooks/clearNumber";
import { convertCurrency } from "@/hooks/convertCurrency";
import logError from "@/hooks/logs";
import { toTimestamp } from "@/hooks/toTimestamp";

// Types
type PriceData = {
  prixOuverture: number | string;
  high: number | string;
  low: number | string;
  prixFermeture: number | string;
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

const isPriceData = (data: string | PriceData): data is PriceData => {
  return typeof data === "object" && data !== null;
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
          };
        });
      }
    }

    // Conversion des devises si nécessaire
    for (const cryptoKey in pricesByCrypto) {
      const entry = pricesByCrypto[cryptoKey];

      // Si on a des données en USDT mais pas en EUR valides
      if (
        (!entry.EUR || Object.values(entry.EUR).some((val) => val === "NaN")) &&
        entry.USDT &&
        typeof entry.USDT !== "string"
      ) {
        const prixOuverture = await convertCurrency(
          entry.USDT.prixOuverture.toString(),
          "USDT",
          "EUR"
        );
        const high = await convertCurrency(
          entry.USDT.high.toString(),
          "USDT",
          "EUR"
        );
        const low = await convertCurrency(
          entry.USDT.low.toString(),
          "USDT",
          "EUR"
        );
        const prixFermeture = await convertCurrency(
          entry.USDT.prixFermeture.toString(),
          "USDT",
          "EUR"
        );

        entry.EUR = {
          prixOuverture: clearNumber(prixOuverture.toString()),
          high: clearNumber(high.toString()),
          low: clearNumber(low.toString()),
          prixFermeture: clearNumber(prixFermeture.toString()),
        };
      }

      // Une fois qu'on a l'EUR, on peut convertir vers les autres devises
      if (
        entry.EUR &&
        isPriceData(entry.EUR) &&
        !Object.values(entry.EUR).some((val) => val === "NaN")
      ) {
        for (const fiat of FIAT_CURRENCIES) {
          if (
            (!entry[fiat] ||
              (isPriceData(entry[fiat]) &&
                Object.values(entry[fiat]).some((val) => val === "NaN"))) &&
            fiat !== "EUR"
          ) {
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
              prixOuverture: clearNumber(prixOuverture.toString()),
              high: clearNumber(high.toString()),
              low: clearNumber(low.toString()),
              prixFermeture: clearNumber(prixFermeture.toString()),
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
