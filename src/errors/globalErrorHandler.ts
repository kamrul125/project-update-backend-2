import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import AppError from "./AppError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors: string[] | undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    errors = err.errors.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    message = errors.join(' | ');
  }

  if (!(err instanceof AppError) && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default globalErrorHandler;