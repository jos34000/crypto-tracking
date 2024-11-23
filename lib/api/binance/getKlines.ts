import fetchKlineData from "@/api/binance/fetchKlinesData";
import { FIAT_CURRENCIES } from "@/constants/currencies";
import { KlineData, PriceData, ValidationSchema } from "@/types/types";
import clearDate from "@/utils/formatting/clearDate";
import clearNumber from "@/utils/formatting/clearNumber";
import { convertCurrency } from "@/utils/formatting/convertCurrency";
import { toTimestamp } from "@/utils/formatting/toTimestamp";
import logError from "@/utils/logging/logs";
import { validateRequest } from "../validation/validateRequest";

const fileName = "getKlines";

const validationSchema: ValidationSchema = {
  method: ["GET"],
  query: {
    crypto: { required: true, type: "string" },
    date: { required: true, type: "string" },
  },
};

const isPriceData = (data: unknown): data is PriceData => {
  return typeof data === "object" && data !== null;
};

const createPriceData = (item: any): PriceData => ({
  prixOuverture: parseFloat(item[1]),
  high: parseFloat(item[2]),
  low: parseFloat(item[3]),
  prixFermeture: parseFloat(item[4]),
});

const createKlineEntry = (item: any): KlineData => ({
  dateOuverture: clearDate(item[0]),
  dateFermeture: clearDate(item[6]),
});

async function convertPrice(
  price: string,
  from: string,
  to: string
): Promise<number> {
  return await convertCurrency(price, from, to);
}

async function convertPriceData(
  prices: PriceData,
  fromCurrency: string,
  toCurrency: string
): Promise<PriceData> {
  return {
    prixOuverture: await convertPrice(
      clearNumber(prices.prixOuverture),
      fromCurrency,
      toCurrency
    ),
    high: await convertPrice(
      clearNumber(prices.high),
      fromCurrency,
      toCurrency
    ),
    low: await convertPrice(clearNumber(prices.low), fromCurrency, toCurrency),
    prixFermeture: await convertPrice(
      clearNumber(prices.prixFermeture),
      fromCurrency,
      toCurrency
    ),
  };
}

const getKlines = async (
  crypto: string | undefined,
  date: string | undefined
): Promise<{ [crypto: string]: KlineData }> => {
  const validation = validateRequest(
    {
      method: "GET",
      url: `?crypto=${crypto}&date=${date}`,
      query: { crypto, date },
    } as any,
    validationSchema,
    fileName
  );

  if (!validation.valid || !validation.data?.query) {
    throw new Error(validation.error || "Validation failed");
  }

  const { crypto: validatedCrypto, date: validatedDate } =
    validation.data.query;
  const { startDate, endDate } = toTimestamp(validatedDate);
  const symbol = validatedCrypto.toUpperCase();

  try {
    const pricesByCrypto: { [key: string]: KlineData } = {};

    // Tentative EUR
    try {
      const eurData = await fetchKlineData(symbol, "EUR", startDate, endDate);
      if (eurData?.[0]) {
        pricesByCrypto[symbol] = createKlineEntry(eurData[0]);
        pricesByCrypto[symbol].EUR = createPriceData(eurData[0]);
      }
    } catch (error) {
      logError(fileName, "fetchEUR", error);
    }

    // Si pas de données EUR, essayer USDT et convertir
    if (!pricesByCrypto[symbol]?.EUR) {
      for (const fiat of FIAT_CURRENCIES.filter((f) => f !== "EUR")) {
        try {
          const data = await fetchKlineData(symbol, fiat, startDate, endDate);
          if (data?.[0]) {
            if (!pricesByCrypto[symbol]) {
              pricesByCrypto[symbol] = createKlineEntry(data[0]);
            }
            const prices = createPriceData(data[0]);
            pricesByCrypto[symbol][fiat] = prices;

            if (fiat === "USDT") {
              pricesByCrypto[symbol].EUR = await convertPriceData(
                prices,
                "USDT",
                "EUR"
              );
            }
          }
        } catch (error) {
          logError(fileName, `fetch${fiat}`, error);
        }
      }
    }

    return pricesByCrypto;
  } catch (error) {
    logError(fileName, "getKlines", error);
    throw error;
  }
};

export default getKlines;
