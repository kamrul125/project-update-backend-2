import { Request, Response } from 'express';
import * as aiService from './ai.service';
import catchAsync from '../../../utils/catchAsync';

export const getSearchSuggestions = catchAsync(async (req: Request, res: Response) => {
  const query = String(req.query.q || '');
  const suggestions = await aiService.getSearchSuggestions(query);

  res.status(200).json({
    success: true,
    message: 'AI search suggestions generated successfully',
    data: suggestions,
  });
});

export const chat = catchAsync(async (req: Request, res: Response) => {
  const { message } = req.body;
  const response = await aiService.chatResponse(String(message || ''));

  res.status(200).json({
    success: true,
    message: 'AI chat response generated successfully',
    data: { response },
  });
});