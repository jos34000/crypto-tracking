import clearDate from "../hooks/clearDate";
import clearNumber from "../hooks/clearNumber";
import logError from "../hooks/logs";
import { toTimestamp } from "../hooks/toTimestamp";
import USDTtoEUR from "../hooks/USDTtoEUR";

const getKlines = async (crypto: string, date: string): Promise<any> => {
  const { startDate, endDate } = toTimestamp(date);
  const symbol = crypto.toUpperCase();

  try {
    let response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}EUR&interval=1d&startTime=${startDate}&endTime=${endDate}`
    );

    if (response.ok) {
      const data = await response.json();
      const formattedData = data.map((item: any) => ({
        dateOuverture: clearDate(item[0]),
        prixOuverture: clearNumber(item[1]),
        high: clearNumber(item[2]),
        low: clearNumber(item[3]),
        prixFermeture: clearNumber(item[4]),
        volume: clearNumber(item[5]),
        dateFermeture: clearDate(item[6]),
        currency: "EUR",
      }));

      return formattedData;
    } else {
      response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&startTime=${startDate}&endTime=${endDate}`
      );

      if (response.ok) {
        const data = await response.json();
        const formattedData = await Promise.all(
          data.map(async (item: any) => {
            let prixOuverture = await USDTtoEUR(item[1]);
            prixOuverture = clearNumber(prixOuverture);
            let high = await USDTtoEUR(item[2]);
            high = clearNumber(high);
            let low = await USDTtoEUR(item[3]);
            low = clearNumber(low);
            let prixFermeture = await USDTtoEUR(item[4]);
            prixFermeture = clearNumber(prixFermeture);

            return {
              dateOuverture: clearDate(item[0]),
              prixOuverture,
              high,
              low,
              prixFermeture,
              volume: clearNumber(item[5]),
              dateFermeture: clearDate(item[6]),
              currency: "USDT",
            };
          })
        );

        return formattedData;
      }
    }
  } catch (error) {
    logError("getKlines", `getKlines for ${crypto}`, error);
    return "erreur";
  }
};

export default getKlines;
