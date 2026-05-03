// src/helpers/response.ts
import { Response } from 'express';

const sendResponse = <T>(res: Response, data: any) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || 'Success',
    data: data.data,
  });
};

export default sendResponse;