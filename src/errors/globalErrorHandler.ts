import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";
import AppError from "./AppError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors: string[] = [];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";

    errors = err.issues.map((issue: ZodIssue) => {
      // এখানে String() ব্যবহার করা হয়েছে যাতে symbol থাকলেও তা string এ রূপান্তরিত হয়
      const path = String(issue.path[issue.path.length - 1]); 
      return `${path}: ${issue.message}`;
    });

    message = errors.join(' | ');
  } 
  else if (!(err instanceof AppError) && statusCode === 500) {
    console.error("Critical Server Error:", err);
  }

  if (errors.length === 0 && err.message) {
    errors.push(err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default globalErrorHandler;