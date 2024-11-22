import { FIAT_CURRENCIES } from "@/constants/currencies";
import clearDate from "@/hooks/clearDate";
import { convertCurrency } from "@/hooks/convertCurrency";
import fetchKlineData from "@/hooks/fetchKlinesData";
import logError from "@/hooks/logs";
import { toTimestamp } from "@/hooks/toTimestamp";
import { KlineData, PriceData } from "@/types/types";

const fileName = "getKlines";

const isPriceData = (data: string | PriceData): data is PriceData => {
  return typeof data === "object" && data !== null;
};

const fetchPrices = async (
  symbol: string,
  startDate: number,
  endDate: number
): Promise<{ [key: string]: KlineData }> => {
  const pricesByCrypto: { [key: string]: KlineData } = {};

  // Essayer de récupérer les données en EUR d'abord
  try {
    const data = await fetchKlineData(symbol, "EUR", startDate, endDate);
    processKlineData(pricesByCrypto, symbol, data, "EUR");
  } catch (error) {
    console.log(
      "Échec de la récupération en EUR, tentative avec d'autres devises..."
    );
  }

  // Essayer avec les autres devises fiat
  for (const fiat of FIAT_CURRENCIES) {
    if (fiat !== "EUR") {
      // Éviter de réessayer avec EUR
      try {
        const data = await fetchKlineData(symbol, fiat, startDate, endDate);
        processKlineData(pricesByCrypto, symbol, data, fiat);
      } catch (error) {
        console.log(`Échec de la récupération avec ${fiat}:`, error);
      }
    }
  }

  return pricesByCrypto;
};

// Fonction pour traiter les données Kline
const processKlineData = (
  pricesByCrypto: { [key: string]: KlineData },
  symbol: string,
  data: any,
  fiat: string
) => {
  if (data) {
    data.forEach((item: any) => {
      if (!pricesByCrypto[symbol]) {
        pricesByCrypto[symbol] = {
          dateOuverture: clearDate(item[0]),
          dateFermeture: clearDate(item[6]),
        };
      }
      pricesByCrypto[symbol][fiat] = {
        prixOuverture: parseFloat(item[1].toString()),
        high: parseFloat(item[2].toString()),
        low: parseFloat(item[3].toString()),
        prixFermeture: parseFloat(item[4].toString()),
      };
    });
  }
};

const convertToEUR = async (entry: KlineData) => {
  if (!entry.EUR || Object.values(entry.EUR).some((val) => val === "NaN")) {
    if (isPriceData(entry.USDT)) {
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
        prixOuverture: prixOuverture,
        high: high,
        low: low,
        prixFermeture: prixFermeture,
      };
    }
  }
};

const convertToOtherFiats = async (entry: KlineData) => {
  if (
    entry.EUR &&
    isPriceData(entry.EUR) &&
    !Object.values(entry.EUR).some(
      (val) => typeof val === "string" && val === "NaN"
    )
  ) {
    for (const fiat of FIAT_CURRENCIES) {
      if (
        !entry[fiat] ||
        (isPriceData(entry[fiat]) &&
          Object.values(entry[fiat]).some(
            (val) => typeof val === "number" && isNaN(val)
          ) &&
          fiat !== "EUR")
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
          prixOuverture: prixOuverture,
          high: high,
          low: low,
          prixFermeture: prixFermeture,
        };
      }
    }
  }
};

const getKlines = async (
  crypto: string,
  date: string
): Promise<{ [crypto: string]: KlineData }> => {
  const { startDate, endDate } = toTimestamp(date);
  const symbol = crypto.toUpperCase();

  try {
    const pricesByCrypto = await fetchPrices(symbol, startDate, endDate);

    for (const cryptoKey in pricesByCrypto) {
      const entry = pricesByCrypto[cryptoKey];
      await convertToEUR(entry);
      await convertToOtherFiats(entry);
    }

    return pricesByCrypto;
  } catch (error) {
    logError(fileName, "getKlines", error);
    throw error;
  }
};

export default getKlines;
