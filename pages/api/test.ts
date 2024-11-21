import { NextApiRequest, NextApiResponse } from "next";
import logError from "../../lib/hooks/logs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  logError("ok", "ok", "erreur");
  res.send("ok");
}
