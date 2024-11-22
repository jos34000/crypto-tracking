import logError from "@/hooks/logs";
import { validateQueryParams } from "@/hooks/validateRequest";
import getKlines from "@/middlewares/getKlines";
import { NextApiRequest, NextApiResponse } from "next";

const fileName = "higherPrice";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    logError(
      fileName,
      "verifyMethodHTTP",
      `Methode non autorisée **${req.method}**`
    );
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const queryParams = new URLSearchParams(req.url?.split("?")[1] || "");
  const crypto = queryParams.get("crypto");
  const date = queryParams.get("date");

  const validation = validateQueryParams(crypto, date);
  if (!validation.valid) {
    logError(fileName, "validateQueryParams", validation.error);
    return res.status(400).json({ error: validation.error });
  }

  try {
    const response = await getKlines(crypto, date);
    const cryptoData = response[crypto]?.EUR;

    if (typeof cryptoData === "object" && cryptoData !== null) {
      res.status(200).json({ high: cryptoData.high });
    } else {
      logError(
        fileName,
        "getKlines",
        `Données reçues non correctes : ${JSON.stringify(cryptoData)}`
      );
      res.status(404).json({ error: "Données non trouvées" });
    }
  } catch (error) {
    logError(
      "higherPrice.ts",
      "getHigherPrice",
      error instanceof Error ? error.message : "Erreur inconnue"
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données" });
  }
}
