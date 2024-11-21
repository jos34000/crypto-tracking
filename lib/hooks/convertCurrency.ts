import logError from "./logs"; // Assurez-vous que le chemin est correct

// Types
type CurrencyData = {
  prixOuverture: number;
  high: number;
  low: number;
  prixFermeture: number;
  volume: number;
};

const convertCurrency = async (
  amount: string,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  const priceInSource = Number(amount);

  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${fromCurrency}${toCurrency}`
    );

    if (!response.ok) {
      // Essayer via EUR comme intermédiaire si la conversion directe n'existe pas
      const toEUR = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${fromCurrency}EUR`
      );
      const EURtoTarget = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=EUR${toCurrency}`
      );

      if (!toEUR.ok || !EURtoTarget.ok) {
        throw new Error(
          `Impossible de convertir ${fromCurrency} vers ${toCurrency}`
        );
      }

      const eurRate = await toEUR.json();
      const targetRate = await EURtoTarget.json();

      const convertedAmount =
        priceInSource * Number(eurRate.price) * Number(targetRate.price);
      return convertedAmount;
    }

    const data = await response.json();
    const convertedAmount = priceInSource * Number(data.price);
    return convertedAmount;
  } catch (error) {
    logError(
      "convertCurrency",
      `Erreur lors de la conversion de ${fromCurrency} à ${toCurrency}`,
      error
    );
    throw error;
  }
};

export default convertCurrency;
