import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function logError(
  fileName: string,
  functionName: string,
  error: unknown
): void {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const logDirPath = path.join(__dirname, "../../logs");

  if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath, { recursive: true });
  }

  const logFilePath = path.join(logDirPath, `${fileName}.log`);
  console.log(logFilePath);

  const now = new Date();
  const date = now.toLocaleDateString("fr-FR");
  const time = now.toLocaleTimeString("fr-FR");
  const timestamp = `${date} ${time}`;
  const errorMessage =
    error instanceof Error ? error.toString() : String(error);
  const logMessage = `-------------------------------\n${timestamp} - ERROR in ${fileName} ${functionName}: \n${errorMessage}\n\n`;

  try {
    fs.appendFileSync(logFilePath, logMessage);
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
}

export default logError;
