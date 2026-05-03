import { Request, Response } from "express";
import * as authService from "./auth.service";
import catchAsync from '../../../utils/catchAsync';
import { registerSchema, loginSchema } from "./auth.validation";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = registerSchema.parse(req.body);
  const result = await authService.registerUser(name, email, password);
  res.status(201).json({ status: "success", data: result });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);
  const result = await authService.loginUser(email, password);
  res.status(200).json({ status: "success", data: result });
});