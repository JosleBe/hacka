import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(`${err.message}`, {
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Errores no esperados
  logger.error(`Unexpected error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
