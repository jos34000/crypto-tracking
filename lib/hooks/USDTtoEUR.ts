const USDTtoEUR = async (usdt: string): Promise<string> => {
  const priceInUSD = Number(usdt);
  const response = await fetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=EURUSDT`
  );
  const data = await response.json();
  const conversionRate = data.price;
  const priceInEUR = priceInUSD / conversionRate;
  return priceInEUR.toLocaleString();
};

export default USDTtoEUR;
