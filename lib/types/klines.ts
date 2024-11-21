export type PriceData = {
  prixOuverture: number;
  high: number;
  low: number;
  prixFermeture: number;
};

export type KlineData = {
  dateOuverture: string;
  dateFermeture: string;
  [currency: string]: PriceData | string;
};

export type ValidationResult = {
  valid: boolean;
  error: string | null;
};
