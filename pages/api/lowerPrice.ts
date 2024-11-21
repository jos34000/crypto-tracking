import { NextApiRequest, NextApiResponse } from "next";
import logError from "../../lib/hooks/logs";
import getKlines from "../../lib/middlewares/getKlines";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "GET") {
    const validateQueryParams = (
      crypto: string | null,
      date: string | null
    ) => {
      if (!crypto || !date) {
        return { valid: false, error: "Paramètre 'crypto' ou 'date' manquant" };
      }
      return { valid: true, error: null }; // Ajout de cette ligne
    };
    const queryParams = new URLSearchParams(req.url.split("?")[1]);
    let crypto = queryParams.get("crypto");
    const date = queryParams.get("date");

    const validation = validateQueryParams(crypto, date);
    if (!validation.valid) {
      logError("lowerPrice.ts", "getLowerPrice", validation.error);
      res.status(400).json({ error: validation.error });
      return;
    }

    try {
      let response = await getKlines(crypto, date);
      res.status(200).json(response[0].low);
    } catch (error) {
      logError("lowerPrice.ts", "getLowerPrice", error.message);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des données" });
    }
  }
}
