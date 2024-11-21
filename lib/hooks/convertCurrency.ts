import { fetchBinancePrice } from "@/middlewares/binanceService";
export const convertCurrency = async (
  amount: string,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    const priceInSource = parseFloat(amount.replace(",", "."));

    if (fromCurrency === toCurrency) return priceInSource;

    const isUsdtToEur = fromCurrency === "USDT" && toCurrency === "EUR";
    const isEurToUsdt = fromCurrency === "EUR" && toCurrency === "USDT";

    const eurUsdtRate = await fetchBinancePrice("EURUSDT");

    if (isUsdtToEur) return priceInSource / eurUsdtRate;
    if (isEurToUsdt) return priceInSource * eurUsdtRate;

    const targetRate = await fetchBinancePrice(`EUR${toCurrency}`);
    return priceInSource * targetRate;
  } catch (error) {
    console.error("Erreur de conversion:", error);
    return NaN;
  }
};
