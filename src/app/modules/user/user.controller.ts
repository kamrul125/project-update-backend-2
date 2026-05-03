import { Request, Response } from "express";
import sendResponse from "../../../helpers/response";
import catchAsync from "../../../utils/catchAsync";
import * as userService from "./user.service";

export const getMe = catchAsync(async (req: any, res: Response) => {
  const user = req.user;

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved successfully",
    data: user,
  });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const role = typeof req.query.role === 'string' ? req.query.role : undefined;

  const result = await userService.getAllUsers(page, limit, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users retrieved successfully",
    data: result,
  });
});