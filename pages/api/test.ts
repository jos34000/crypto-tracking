import { NextApiRequest, NextApiResponse } from "next";
import getKlines from "../../lib/middlewares/getKlines";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { crypto, date } = req.query;

  if (typeof crypto !== "string" || typeof date !== "string") {
    res.status(400).json({ error: "Paramètres 'crypto' et 'date' requis" });
    return;
  }

  try {
    const prices = await getKlines(crypto, date);
    res.status(200).json(prices);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données" });
  }
}
