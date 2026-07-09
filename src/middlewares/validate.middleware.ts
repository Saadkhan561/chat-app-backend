import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validate =
  (schema: ZodType, source: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req[source]);

      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          field: issue.path.length > 0 ? issue.path.join(".") : "root",
          message: issue.message,
          code: issue.code,
        }));

        return res.status(400).json({
          message: "Validation failed",
          errors: errors,
        });
      }

      (req as any)[source] = result.data;

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Internal validation error",
      });
    }
  };
