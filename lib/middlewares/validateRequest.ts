import { ValidationResult } from "@/types/klines";

export const validateQueryParams = (
  crypto: string | null,
  date: string | null
): ValidationResult => {
  if (!crypto || !date) {
    return {
      valid: false,
      error: "Paramètres 'crypto' et 'date' requis",
    };
  }

  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(date)) {
    return {
      valid: false,
      error: "Format de date invalide (JJ/MM/AAAA attendu)",
    };
  }

  return { valid: true, error: null };
};
