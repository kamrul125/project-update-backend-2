import { Request, Response } from 'express';
import * as dashboardService from './dashboard.service';
import catchAsync from '../../../utils/catchAsync';

export const getOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getOverviewStats();
  res.status(200).json({
    success: true,
    message: 'Dashboard overview fetched successfully',
    data: result,
  });
});

export const getCharts = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getChartData();
  res.status(200).json({
    success: true,
    message: 'Dashboard chart data fetched successfully',
    data: result,
  });
});

export const getUserMetrics = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const role = typeof req.query.role === 'string' ? req.query.role : undefined;

  const result = await dashboardService.getUserMetrics(page, limit, role);
  res.status(200).json({
    success: true,
    message: 'User metrics fetched successfully',
    data: result,
  });
});