// server/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors.js';
import { ZodError } from 'zod';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        fields: err.fields,
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      const fieldPath = issue.path.join('.');
      fields[fieldPath] = issue.message;
    }

    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed for request data.',
        fields,
      },
    });
    return;
  }

  // Generic internal server error
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL',
      message: 'An unexpected internal error occurred. Please try again later.',
    },
  });
}
