import validateBody from "@/api/validation/validateBody";
import validateMethod from "@/api/validation/validateMethod";
import validateQueryParams from "@/api/validation/validateParams";
import { ValidationResponse, ValidationSchema } from "@/types/types";
import { NextApiRequest } from "next";

export function validateRequest(
  req: NextApiRequest,
  schema: ValidationSchema,
  fileName: string
): ValidationResponse {
  const methodResult = validateMethod(req.method, schema.method, fileName);
  if (!methodResult.valid) return methodResult;

  const validatedData: ValidationResponse = {
    valid: true,
    data: {},
  };

  if (schema.query) {
    const queryResult = validateQueryParams(req.url, schema.query, fileName);
    if (!queryResult.valid) return queryResult;
    validatedData.data!.query = queryResult.data?.query;
  }

  if (schema.body) {
    const bodyResult = validateBody(req.body, schema.body, fileName);
    if (!bodyResult.valid) return bodyResult;
    validatedData.data!.body = bodyResult.data?.body;
  }

  return validatedData;
}
